const detox = require('detox');
const { detox: config } = require('../package.json');
beforeAll(async () => { await detox.init(); }, 300000);
afterAll(async () => { await detox.cleanup(); });
