// path: /src/services/mixpanel-service.js
const util = require('util');
const mixpanel = require('mixpanel').init('a2229b42988461d6b1f1ddfdcd9cc8c3');
const trackAsync = util.promisify(mixpanel.track);
// We tried to wrap it with async/await to consist the
// codebase style and to avoid callback hell.
async function track(event, properties) {
    await trackAsync(event, properties)
}

module.exports = { track }