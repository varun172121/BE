'use strict'
import express, {
    json
} from 'express'
import cors from 'cors'
import {
    port,
    url,
    host,
    session_key
} from './config.js'
import {
    routes as userRoutes
} from "./routes/user.js"
import {
    routes as examRoutes
} from "./routes/exam.js"
// import bodyParser from 'body-parser'

import session from 'express-session'

import {
    FirestoreStore
} from "@google-cloud/connect-firestore"
import {
    Firestore
} from "@google-cloud/firestore"
import {
    firebase_firestore
} from './db.js'

import bodyParser from "body-parser"
import cookieParser from 'cookie-parser'
import { routes as proctorRoutes } from "./routes/proctor.js"
import path from 'path'
// import { routes as proctorRoutes } from "./routes/proctor.js"
import { sendMail } from './helpers/email.js'
import https from "https"
import fs from "fs"

const __dirname = path.resolve();
// var store = new FirestoreStore({
//     dataset: firebase_firestore,
//     // dataset:new Firestore(),
//     kind: 'session'
// })

 var privateKey = fs.readFileSync( 'privkey.pem' );
 var certificate = fs.readFileSync( 'fullchain.pem' );

const app = express()
app.use(express.json())
// app.use(json())
app.use(cors({
   origin:["http://"+host+":3000"],
   methods:"GET,POST,DELETE,PUT",
   credentials:true,
}
))
// app.use(bodyParser.json())

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//session use 
// app.use(session({
//     store: store,
//     name: "session",
//     resave: false,
//     secret: session_key,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 2,
//         sameSite: true,
//         secure: true,
//         HttpOnly: true
//     }
// }))

// app.use(session({secret: session_key,resave:true,saveUninitialized: true,httponly:false,cookie: {}}))
app.use(express.static(path.join(__dirname, 'build')));

app.use("/api/user", userRoutes)
app.use("/api/exam", examRoutes)
app.use("/api/proctor", proctorRoutes)

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
// app.get("/", (req, res) => {
//     console.log(req.session);
//     res.write("hello world");
//     res.end();
// });


// app.get('/game', function (req, res) {
// 	res.write("hello");
// 	res.end();
// 	//res.sendFile(path.join(__dirname, 'build', 'index.html'));
// 	//res.end();
// });


// app.get('/pubg', function (req, res) {
//         res.write("pubg");
//         res.end();
//         //res.sendFile(path.join(__dirname, 'build', 'index.html'));
//         //res.end();
// });

// app.get('/cod', function (req, res) {
//         res.write("cod");
//         res.end();
//         //res.sendFile(path.join(__dirname, 'build', 'index.html'));
//         //res.end();
// });

 https.createServer({
     key: privateKey,
     cert: certificate
 }, app).listen(443);

//app.listen(8080, () => {
//   console.log(`Server is running on ${url}`);
//})


