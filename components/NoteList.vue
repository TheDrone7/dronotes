<template xmlns="http://www.w3.org/1999/html">
  <box mx="8" mt="12">
    <pseudo-box bg="gray.700" px="4" py="4" rounded="md" my="4" display="flex" v-for="note in notes" :key="note.id" justify-content="space-between" align-items="center" width="100%">
      <box>
        <box display="flex" align-items="center">
          <heading color="blue.100" size="md">{{ note.title }}</heading>
          <box ml="4">{{ languages[note.lang] }}</box>
        </box>
        <box font-family="mono" font-size="sm">Last modified: {{ modificationTimes[note.id] }}</box>
      </box>
      <box display="flex" align-items="center" justify-content="center" height="100%">
        <c-button as="nuxt-link" :to="'/user/note/' + note.id" variant-color="vue" variant="outline" font-weight="bold">Edit</c-button>
        <c-button ml="4" variant-color="red" variant="outline" font-weight="bold" @click.prevent="deleteNote(note.id)">Delete</c-button>
      </box>
    </pseudo-box>
  </box>
</template>

<script>
import { CBox as Box, CHeading as Heading, CPseudoBox as PseudoBox, CButton } from '@chakra-ui/vue';
import moment from 'moment';
export default {
  name: "NoteList",
  props: ['notes'],
  components: { Box, Heading, PseudoBox, CButton },
  data: () => ({
    languages: { 'tex': 'Latex', 'md': 'Markdown' }
  }),
  methods: {
    notify(title, description, status) {
      this.$toast({
        position: 'bottom-right',
        title, description, status,
        duration: 5000
      });
    },
    async deleteNote(nid) {
      const { deleted } = await this.$axios.$post('/notes/delete/' + nid);
      if (deleted.success) {
        this.notify('Success', 'Note deleted successfully.', 'success');
        this.$store.commit('setNotes', this.notes.filter(n => n.id !== nid));
      }
      else this.notify('Error', 'There was an error while deleting the note.', 'error');
    }
  },
  computed: {
    modificationTimes() {
      let noteTimes = {};
      for (const note of this.notes) {
        noteTimes[note.id] = moment(note.timeUpdated || note.timeCreated).fromNow();
      }
      return noteTimes;
    }
  }
}
</script>
