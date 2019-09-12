const admin = require('firebase-admin')
admin.initializeApp()

const db = admin.firestore()

const type = 'Humans'
const mappingDB = db.collection(type)

async function getHuman(name) {
  //console.log(name)
  try {
    const snapshot = await mappingDB
      .where('Name', '==', name)
      .get();
    //console.log("Snapshot " + JSON.stringify(snapshot))
    if (snapshot.empty) {
      return null;
    }else {
      return snapshot.docs[0].data();
    }
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getHuman
}