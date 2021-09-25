import key from './db-key';
import admin  from 'firebase-admin';

let db;
if (admin.apps && admin.apps.length)
  db = admin.apps[0].firestore();
else {
  const app = admin.initializeApp({credential: admin.credential.cert(key)});
  db = app.firestore();
}

export default db;
