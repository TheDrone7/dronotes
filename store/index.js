export const state = () => ({
  user: null,
  notes: [],
  currentNote: null
});

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setNotes(state, notes) {
    state.notes = notes;
  },
  setCurrent(state, content) {
    state.currentNote = content;
  }
};
