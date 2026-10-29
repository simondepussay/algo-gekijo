// POST /api/explique : Azure Function (fonctions gérées de Static Web Apps)
const { app } = require('@azure/functions');
const { explique, clientIp } = require('../coeur');

app.http('explique', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'explique',
  handler: async (request) => {
    const ip = clientIp(request.headers.get('x-forwarded-for'), request.headers.get('x-client-ip') || '');
    const { status, body } = await explique(await request.text(), ip);
    return { status, jsonBody: body };
  },
});
