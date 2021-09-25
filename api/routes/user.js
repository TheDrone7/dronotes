import { Router} from 'express';
import {decodeUser, encodeUser} from '../crypto';
import {createUser, fetchUser, fetchUserByName} from '../../db';
import {createHash} from 'crypto';

const router = new Router()

router.get('/get-user', async (req, res) => {
  if (req.cookies['user.id']) {
    try {
      const userDetails = decodeUser(req.cookies['user.id']);
      const user = await fetchUser(userDetails.id)
      if (user.error) res.json({ error: user.error });
      else res.json({ user });
    } catch (e) {
      res.json({ error: 'Invalid uid.' });
    }
  } else res.json({ error: 'No uid.' });
})

router.post('/new-user', async (req, res) => {
  if (req.body && req.body.username && req.body.password && req.body.email) {
    try {
      const user = await createUser(req.body.email, req.body.username, req.body.password);
      if (user && !user.error) {
        const key = encodeUser(user.id, user.password);
        res.json({ success: true, key });
      } else {
        res.json({ error: user.error || 'There was a database error during registration.' });
      }
    } catch (err) {
      console.error(err);
      res.json({ error: 'Unable to create user. DB ERROR.' });
    }
  } else res.status(400).send('BAD REQUEST');
});

router.post('/login', async (req, res) => {
  if (req.body && req.body.username && req.body.password) {
    try {
      const user = await fetchUserByName(req.body.username);
      if (user.error) res.json({ error: user.error });
      else {
        const hashedPassword = createHash('sha256').update(req.body.password).digest('hex');
        if (user.password === hashedPassword) {
          res.json({ success: true, key: encodeUser(user.id, user.password) });
        } else res.json({ error: 'Invalid Password' });
      }
    } catch (e) {
      console.error(e);
      res.json({ error: 'Could not find the user. DB error.' });
    }
  } else res.status(400).send('BAD REQUEST');
});

router.get('/logout', (req, res) => {
  if (req.cookies['user.id']) res.cookie('user.id', 'deleted', { maxAge: -1 });
  res.redirect('/');
});

export default router;
