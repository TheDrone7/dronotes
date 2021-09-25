<template>
  <box
    bg="gray.900"
    px="12"
    py="4"
    border-top="solid 1px"
    border-color="gray.700"
    display="flex"
    align-items="center"
    justify-content="space-between"
  >
    <heading size="lg">{{ note.title }}</heading>
    <box display="flex" align-items="center">
      <c-button variant-color="green" px="8" v-if="note" @click="run">
        <span class="material-icons">play_arrow</span>
      </c-button>
      <c-button variant-color="blue" ml="8" @click="viewNote">
        <span class="material-icons">launch</span>
      </c-button>
      <c-button variant-color="red" ml="8" @click="deleteNote(note.id)">
        <span class="material-icons">delete</span>
      </c-button>
    </box>
  </box>
</template>

<script>
  import { CBox as Box, CHeading as Heading, CButton } from '@chakra-ui/vue';
  export default {
    name: 'NoteDetails',
    props: ['note'],
    components: { Box, Heading, CButton },
    methods: {
      run() {
        this.$emit('run');
      },
      notify(title, description, status) {
        this.$toast({
          position: 'bottom-right',
          title,
          description,
          status,
          duration: 5000
        });
      },
      async deleteNote(nid) {
        const { deleted } = await this.$axios.$post('/notes/delete/' + nid);
        if (deleted.success) {
          this.notify('Success', 'Note deleted successfully.', 'success');
          const notes = this.$store.state.notes;
          this.$store.commit(
            'setNotes',
            notes.filter(n => n.id !== nid)
          );
          window.open('/user', '_self');
        } else this.notify('Error', 'There was an error while deleting the note.', 'error');
      },
      viewNote() {
        window.open('/view/' + this.note.id, '_blank');
      }
    }
  };
</script>
