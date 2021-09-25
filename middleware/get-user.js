import { parse } from 'cookie';

export default async ctx => {
  const cookies = process.server ? parse(ctx.req.headers.cookie || '') : parse(document.cookie || '');
  if (cookies['user.id']) {
    if (ctx.req) {
      const userData = await ctx.$axios.$get(
        `http${ctx.req.headers.host.includes('localhost') ? '' : 's'}://${ctx.req.headers.host}/get-user`,
        {
          headers: ctx.req.headers
        }
      );
      if (!userData || userData.error) ctx.redirect('/logout');
      else ctx.store.commit('setUser', userData.user);
    } else if (document) {
      const userData = await ctx.$axios.$get(`/get-user`);
      if (!userData || userData.error) ctx.redirect('/logout');
      else ctx.store.commit('setUser', userData.user);
    }
  } else ctx.redirect('/logout');
};
