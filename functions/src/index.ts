import * as firebaseAdmin from "firebase-admin"; // import the firebase-admin sdk
import * as functions from "firebase-functions";
import * as express from "express";
import * as serviceAccount from "./serviceAccount.json";
import * as router from "./router";

// grant the firebase-admin sdk all administrative privileges to our project
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  }),
});

// initialize the express framework
const app = express();

// tell express server to use the router
app.use(router.initialize());

//hookup our http function to respond with the express framework
export const api = functions.https.onRequest(app);
