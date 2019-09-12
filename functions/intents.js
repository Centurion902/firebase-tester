const {
    dialogflow,
    SimpleResponse,
} = require('actions-on-google')
const functions = require('firebase-functions')
const config = functions.config().environment
const database = require('./database')
//const name = config.name

const app = dialogflow({})
  
app.intent('Age Offset Request', async (conv, params) => {
  //console.log("Conv: " + JSON.stringify(conv),"Params:" + JSON.stringify(params))
  const name = params.person.name;
  const offset = params.number;

  try {
    let human = await database.getHuman(params.person.name)
    //console.log("Human object returned: " + JSON.stringify(human))
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

  




    // let offset = params[number]
    // let name = params[person]
    // try {
      
    //   let age = await api.getHumanAge(name)
    //   if (!age) {
    //     conv.ask(`Sorry, something went wrong.`)
    //     return
    //   }
    //   let newAge = age + offset
    //   conv.ask(`${name}, will be ${newAge} in ${offset} years.`)
      
    //   return
    // } catch(err) {
    //     conv.ask(`Sorry, something went wrong.`)
    //     throw err
    // }
})
  
  

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