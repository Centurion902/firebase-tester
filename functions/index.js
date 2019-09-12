const functions = require('firebase-functions');

const googleApp = require('./intents')

exports.fulfillment = functions.https.onRequest(googleApp);