import { Router } from 'express';
import { decodeUser } from '../crypto';
import { fetchUser, createNote, fetchNotesByUser, fetchNote, deleteNote, updateNote } from '../../db';
import { math, mathHtml } from 'micromark-extension-math';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';
const router = new Router();

const auth = async (req, res, next) => {
  if (req.cookies['user.id']) {
    try {
      const userDetails = decodeUser(req.cookies['user.id']);
      const user = await fetchUser(userDetails.id);
      if (user.error) res.json({ error: user.error });
      else {
        req.user = user;
        next();
      }
    } catch (e) {
      res.json({ error: 'Invalid uid.' });
    }
  } else res.json({ error: 'No uid.' });
};

router.post('/create', auth, async (req, res) => {
  if (req.body && req.body.title) {
    const note = await createNote(req.user.id, req.body.title);
    res.json({ ...note });
  } else res.status(400).send('BAD REQUEST');
});

router.get('/all', auth, async (req, res) => {
  const notes = await fetchNotesByUser(req.user.id);
  notes.sort((a, b) => (b.timeUpdated || b.timeCreated).getTime() - (a.timeUpdated || a.timeCreated).getTime());
  res.json({ notes });
});

router.post('/delete/:id', auth, async (req, res) => {
  const note = await fetchNote(req.params.id);
  if (note.user === req.user.id) {
    const deletion = await deleteNote(req.params.id);
    res.json({ deleted: deletion });
  } else res.json({ error: 'This note does not belong to you!' });
});

router.get('/:id', auth, async (req, res) => {
  const note = await fetchNote(req.params.id);
  if (note && note.user === req.user.id) res.json({ ...note });
  else res.json({ error: note.error || 'No such note found.' });
});

router.post('/run', auth, async (req, res) => {
  if (req.body && req.body.id) {
    const note = await fetchNote(req.body.id);
    if (note) {
      if (note.user === req.user.id) {
        if (req.body.content) await updateNote(req.body.id, req.body.content);
        try {
          const html = micromark(req.body.content || note.content, {
            extensions: [gfm(), math()],
            htmlExtensions: [gfmHtml, mathHtml()],
            allowDangerousHtml: true
          });
          res.json({ html });
        } catch (e) {
          console.error(e);
          res.json({ html: `<span class="error">${e.message}</span>` });
        }
      } else res.json({ error: note.error || "Note doesn't exist!" });
    } else res.json({ error: note.error || "Note doesn't exist!" });
  } else res.status(400).send('BAD REQUEST!');
});

export default router;
