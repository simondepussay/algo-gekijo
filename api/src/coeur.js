// アルゴ劇場 — « クキ先生 » : explique l'élément pointé, avec le contexte de l'étape en cours.
// Même service que le chat du portfolio : Azure OpenAI, clé côté serveur (AI_KEY), jamais envoyée au navigateur.
const AI_ENDPOINT = process.env.AI_ENDPOINT || 'https://ai-depussay22.cognitiveservices.azure.com/';
const AI_MODEL = process.env.AI_MODEL || 'gpt-5-mini';

const PER_IP_PER_HOUR = 20;
const PER_DAY_TOTAL = 300;
const MAX_HISTORY = 6;

const SYSTEM = {
  ja: `あなたは「クキ先生」。アルゴリズム学習サイト「アルゴ劇場」で、基本情報技術者試験（科目B）を勉強している学生を助ける、やさしいAIの先生です（サイトの作者の犬の名前を借りています）。
- 学生は画面の一部（擬似言語の行、流れ図の箱、変数、配列のマス、トレース表など）を指さして質問します。「指さした場所」と「今のステップ」の情報を使って、その場所が何をしているのか、なぜその値になるのかを説明してください。
- 答えは日本語で、短く（3〜6文程度）、具体的な値を使って。必要なら「・」の短い箇条書きを使ってよい。見出しや表、コードブロックは使わない。
- この画面の配列の要素番号は 0 から始まる（試験では 1 からのことが多い）。関係があるときだけ触れる。
- 試験で役立つポイントがあれば一言添える。
- アルゴリズムや情報処理と関係のない質問には、やさしく断って学習に戻す。わからないことは推測で答えない。
- 最後に、ときどき「ワン！」と付けてもよい（毎回ではなく）。`,
  en: `You are “Kuki-sensei”, a kind AI teacher on the algorithm learning site “Algo Theater”, helping students prepare for the Japanese Fundamental IT Engineer exam (FE, subject B). (The name comes from the site author's dog.)
- The student points at part of the screen (a pseudocode line, a flowchart box, a variable, an array cell, the trace table…) and asks a question. Use the “pointed at” and “current step” information to explain what that part does and why it has that value.
- Answer in English, briefly (about 3–6 sentences), with the actual values. Short bullet points are fine; no headings, tables or code blocks.
- Array indexes on this screen start at 0 (the exam often starts at 1). Mention it only when relevant.
- Add one exam tip when it helps.
- Politely decline questions unrelated to algorithms or IT and bring the student back. Do not guess when unsure.
- You may sometimes end with “Woof!” (not every time).`
};

const court = (s, n) => String(s ?? '').slice(0, n);

function contexte(c) {
  const ja = c.lang === 'ja';
  const prog = (Array.isArray(c.prog) ? c.prog : []).slice(0, 45).map((l, i) => `${i + 1}: ${court(l, 120)}`).join('\n');
  const vars = Object.entries(c.vars && typeof c.vars === 'object' ? c.vars : {}).slice(0, 12)
    .map(([k, v]) => `${court(k, 20)} = ${court(v, 40)}`).join(', ');
  return [
    `${ja ? '[アルゴリズム]' : '[Algorithm]'} ${court(c.algo, 80)}`,
    `${ja ? '[擬似言語]' : '[Pseudocode]'}\n${prog}`,
    `${ja ? '[今のステップ]' : '[Current step]'} ${court(c.ligne, 4)}${ja ? '行目' : ''}: ${court(c.etape, 300)}`,
    `${ja ? '[変数]' : '[Variables]'} ${vars || '—'}`,
    `${ja ? '[配列など]' : '[Arrays]'} ${court(c.donnees, 300) || '—'}`,
    `${ja ? '[指さした場所]' : '[Pointed at]'} ${court(c.cible, 300)}`
  ].join('\n');
}

function authHeaders() {
  if (process.env.AI_KEY) return { 'api-key': process.env.AI_KEY };
  if (process.env.AZURE_TOKEN) return { Authorization: `Bearer ${process.env.AZURE_TOKEN}` };
  throw new Error('no AI credentials');
}

async function askModel(lang, messages) {
  const res = await fetch(`${AI_ENDPOINT}openai/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [{ role: 'system', content: SYSTEM[lang] }, ...messages],
      max_completion_tokens: 1500,
      reasoning_effort: 'minimal',
    }),
  });
  if (!res.ok) throw new Error(`model ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

// Compteurs en mémoire (par instance) ; le quota du déploiement Azure OpenAI reste le plafond dur.
const hits = new Map();
let day = { date: '', count: 0 };
function allowed(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 3600_000);
  const today = new Date().toISOString().slice(0, 10);
  if (day.date !== today) day = { date: today, count: 0 };
  if (recent.length >= PER_IP_PER_HOUR || day.count >= PER_DAY_TOTAL) return false;
  recent.push(now);
  hits.set(ip, recent);
  day.count++;
  return true;
}

function clientIp(forwardedFor, fallback = '') {
  const first = (forwardedFor || '').split(',')[0].trim() || fallback;
  return first.replace(/^\[(.*)\]:\d+$/, '$1').replace(/^(\d+\.\d+\.\d+\.\d+):\d+$/, '$1');
}

// corps JSON : { lang, question, contexte: {algo, prog, ligne, etape, vars, donnees, cible}, historique: [{role, content}] }
async function explique(rawBody, ip) {
  if (rawBody.length > 30_000) return { status: 413, body: { error: 'too_large' } };
  let b;
  try { b = JSON.parse(rawBody); } catch { return { status: 400, body: { error: 'bad_request' } }; }
  const lang = b.lang === 'en' ? 'en' : 'ja';
  const question = court(b.question, 400).trim();
  if (!question || !b.contexte || typeof b.contexte !== 'object') return { status: 400, body: { error: 'bad_request' } };
  const historique = (Array.isArray(b.historique) ? b.historique : []).slice(-MAX_HISTORY)
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: court(m.content, 1200) }));
  if (!allowed(ip)) return { status: 429, body: { error: 'limit' } };
  const messages = [...historique, { role: 'user', content: `${contexte({ ...b.contexte, lang })}\n\n${lang === 'ja' ? '[質問]' : '[Question]'} ${question}` }];
  try {
    return { status: 200, body: { reply: await askModel(lang, messages) } };
  } catch (err) {
    console.error(err);
    return { status: 502, body: { error: 'ai_unavailable' } };
  }
}

module.exports = { explique, clientIp, contexte };
