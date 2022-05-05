import { createRequire } from "module"
const require = createRequire(import.meta.url)
const serviceAccount = require("./firebase_key.json")
import { initializeApp,} from 'firebase/app'
import { getStorage } from "firebase/storage";
import admin from "firebase-admin"
import * as config from "./config.js";
const storage = initializeApp(config.firebaseConfig)
const storageRef = getStorage(storage)
const app =admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})
const firebase_firestore = app.firestore()



export { firebase_firestore, storageRef, app as firebase_app };