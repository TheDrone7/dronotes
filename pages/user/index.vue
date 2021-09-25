<template>
  <box>
    <navbar :username="currentUser.username" :home="true" />
    <heading size="lg" display="flex" alignItems="center" ml="10" mt="12" text-decoration="underline">My notes</heading>
    <note-list :notes="notes" />
  </box>
</template>

<script>
import {CBox as Box, CHeading as Heading, CButton} from '@chakra-ui/vue'
import Navbar from "../../components/Navbar.vue";
import NoteList from "../../components/NoteList";

export default {
  name: "user",
  components: {NoteList, Navbar, Box, Heading, CButton },
  middleware: ['get-user', 'get-notes'],
  data: () => ({}),
  computed: {
    currentUser() {return this.$store.state.user;},
    notes() {return this.$store.state.notes;}
  },
  head: {
    title: 'My Notes'
  }
}
</script>
