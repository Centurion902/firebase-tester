const {
    dialogflow,
    SimpleResponse,
} = require('actions-on-google')
const functions = require('firebase-functions')
const config = functions.config().environment
const database = require('./database')
//const name = config.name

const app = dialogflow({})
  
app.intent('AgeOffsetRequest', async (conv, params) => {
  //console.log("Conv: " + JSON.stringify(conv),"Params:" + JSON.stringify(params))
  const name = params.person.name
  const offset = params.number
  conv.contexts.delete('DefaultContext')
  //conv.contexts.set('DefaultContext', 3)
  try {
    let human = await database.getHuman(params.person.name)
    //console.log("Human object returned: " + JSON.stringify(human))

    //
    if (human) {
      let newAge = parseInt(human.Age) + parseInt(offset);
      return conv.ask(`${name}, will be ${newAge} in ${offset} years.`)
    } else {
      conv.close("Could not find this human in database.")
      return
    }
  } catch (err) {
    conv.close("Could not read from database.")
    throw err
  }  
})
  
app.intent('NoInput', (conv) => {
  const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'))
  if (repromptCount === 0) {
      conv.ask(`Are you still there?`);
    } else if (repromptCount === 1) {
      conv.close(`Okay let's try this again later.`);
    }
  return
})

app.intent('Reprompt', (conv) => {
  const repromptCount = parseInt(conv.arguments.get('REPROMPT_COUNT'));
  if (repromptCount === 0) {
  conv.ask(`What was that?`);
  } else if (repromptCount === 1) {
  conv.ask(`Sorry I didn't catch that. Could you repeat yourself?`);
  } else if (conv.arguments.get('IS_FINAL_REPROMPT')) {
  conv.close(`Okay let's try this again later.`);
  }
});

app.intent('Exit Conversation', (conv) => {
    conv.close(new SimpleResponse({
      speech: 'Okay, see you next time!',
      text: 'Okay, see you next time!'
    }))
    return
})
  
app.fallback((conv) => {
    conv.ask(`Sorry we don't support that command, try another one`)
    return
})
  
app.catch((conv, error) => {
    console.error(error)
    conv.ask("I encountered a glitch. Can you say that again?")
    return
})
  
module.exports = app;