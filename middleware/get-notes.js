import { parse } from 'cookie';

export default async (ctx) => {
  const cookies = process.server ? parse(ctx.req.headers.cookie || '') : parse(document.cookie || '');
  if (cookies['user.id']) {
    if (ctx.req) {
      const notesData = await ctx.$axios.$get(`http${ctx.req.headers.host.includes('localhost') ? '' : 's'}://${ctx.req.headers.host}/notes/all`, {
        headers: ctx.req.headers
      });
      if (!notesData || notesData.error) ctx.redirect('/');
      else ctx.store.commit('setNotes', notesData.notes);
    } else if (document) {
      const notesData = await ctx.$axios.$get(`/notes/all`);
      if (!notesData || notesData.error) ctx.redirect('/');
      else ctx.store.commit('setNotes', notesData.notes);
    }
  } else ctx.redirect('/');
}
