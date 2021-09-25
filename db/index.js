import db from './firestore';
import { uid } from 'uid/secure';
import {createHash} from 'crypto';

export const createUser = async (email, username, password) => {
  const id = uid(10);
  const userDoc = db.collection('users').doc(id);
  const hashedPassword = createHash('sha256').update(password).digest('hex');
  const checkUser = await fetchUserByName(username);
  if (checkUser && !checkUser.error) return { error: 'This username is already in use. Please use a new username or login if it is your own username.' };
  await userDoc.set({
    email, username,
    password: hashedPassword,
    verified: true
  }).catch(err => {
    throw err;
  });
  return {email, username, password: hashedPassword, verified: true, id};
}

export const fetchUserByName = async (username) => {
  const userDoc = await db.collection('users').where('username', '==', username).get();
  if (userDoc.size) return { id: userDoc.docs[0].id, timeCreated: new Date(userDoc.docs[0].createTime.seconds * 1000), ...userDoc.docs[0].data() };
  else return { error: 'User does not exist.' };
}

export const fetchUser = async (id) => {
  const userDoc = await db.collection('users').doc(id).get();
  if (userDoc.exists) return { id: userDoc.id, timeCreated: new Date(userDoc.createTime.seconds * 1000), ...userDoc.data() };
  else return { error: 'User does not exist.' };
}

export const createNote = async (user, title) => {
  const nid = uid(16);
  const notesDoc = db.collection('notes').doc(nid);
  await notesDoc.set({user, title, content: ''}).catch(err => {
    return { error: err };
  });
  return { id: nid, user, title, content: '', timeCrated: new Date() };
}

export const fetchNotesByUser = async (uid) => {
  const notesDocs = await db.collection('notes').where('user', '==', uid).get();
  if (notesDocs.size) {
    return notesDocs.docs.map(note => ({
      id: note.id,
      timeCreated: note.createTime.toDate(),
      timeUpdated: note.updateTime.toDate(),
      user: note.data().user,
      title: note.data().title,
      lang: note.data().lang
    }));
  } else return [];
}

export const fetchNote = async (nid) => {
  const noteDoc = await db.collection('notes').doc(nid).get();
  if (noteDoc.exists) return { id: noteDoc.id, timeCreated: new Date(noteDoc.createTime.seconds * 1000), ...noteDoc.data() };
  else return { error: 'Note does not exist.' };
}

export const updateNote = async (nid, content) => {
  const noteDoc = await db.collection('notes').doc(nid).update({ content });
  if (noteDoc) return { success: true };
  else return { error: 'Error updating the note.' };
}

export const deleteNote = async (nid) => {
  const noteDoc = db.collection('notes').doc(nid);
  try {
    await noteDoc.delete();
    return { success: true };
  } catch (error) {
    return { error };
  }
}


