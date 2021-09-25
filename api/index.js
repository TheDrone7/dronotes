import express from 'express';

import userRouter from './routes/user';
import notesRouter from './routes/notes';

const app = express();

app.use('/', userRouter);
app.use('/notes', notesRouter)

export default app;
