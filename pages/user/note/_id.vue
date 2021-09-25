<template>
  <box display="flex" flex-direction="column" height="100vh" overflow="hidden">
    <navbar :username="user.username" />
    <note-details :note="note" @run="runCode" />
    <box display="flex" width="100%" flex-grow="1" overflow-y="auto">
      <box class="editor-box" :width="editorWidth">
        <box as="div" id="editor" bg="gray.700" class="editor line-numbers" font-family="mono" />
        <box bg="gray.900" class="resizer resizer-r" @mousedown="mouseWentDown" />
      </box>
      <box class="note-preview" ml="4" :width="previewWidth" v-html="output" id="output" />
    </box>
  </box>
</template>

<script>
import {CBox as Box, CHeading as Heading} from '@chakra-ui/vue';
import Navbar from "../../../components/Navbar.vue";
import NoteDetails from "../../../components/NoteDetails.vue";

export default {
  name: "note-by-id",
  components: {NoteDetails, Navbar, Box, Heading },
  middleware: ['get-user', 'get-note'],
  computed: {
    user() { return this.$store.state.user; },
    note() { return this.$store.state.currentNote; },
    content() {
      if (process.client) return window.localStorage.getItem(this.$store.state.currentNote.id + '-content') || this.$store.state.currentNote.content;
      else return this.$store.state.currentNote.content;
    }
  },
  data: () => ({
    editorWidth: '52%',
    previewWidth: '48%',
    moving: false,
    output: ''
  }),
  mounted() {
    this.$setup('#editor');
    document.addEventListener('mouseup', this.mouseWentUp);
    document.addEventListener('mousemove', this.mouseMove);
    const run = this.runCode;
    document.addEventListener("keydown", function(e) {
      if (e.key === 'F5' || (e.key === 's' && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey))) {
        e.preventDefault();
        run();
      }
    }, false);
  },
  methods: {
    mouseWentDown(e) {
      this.moving = true;
    },
    mouseMove(e) {
      if (this.moving) {
        this.editorWidth = `${e.clientX + 10}px`;
        this.previewWidth = `${window.innerWidth - e.clientX - 10}px`;
      }
    },
    mouseWentUp() {
      this.moving = false;
    },
    async runCode() {
      this.output = 'Now running code!';
      const code = window.localStorage.getItem(this.note.id + '-content');
      const { id, timeCreated, timeUpdated, user, title, lang } = this.note;
      const newNote = { content: code, id, timeCreated, timeUpdated, user, lang, title };
      this.$store.commit('setCurrent', newNote);
      const output = await this.$axios.$post('/notes/run', { content: code, id: this.note.id });
      this.output =  output.html;
    }
  },
  head() {
    return {
      title: this.$store.state.currentNote.title
    }
  }
}
</script>


<style>
.editor {
  color: #eed;
  border-radius: 6px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.05rem;
  padding: 10px;
  white-space: pre-wrap !important;
  word-wrap: break-word;
  overflow: auto;
  height: 100%;
  tab-size: 2;
}
.codejar-wrap {
  height: 100%;
  overflow-y: auto;
}

.editor-box {
  position: relative;
}

.resizer {
  position: absolute;
}
.resizer-r {
  cursor: col-resize;
  margin-left: 10px;
  height: 100%;
  right: -5px;
  top: 0;
  width: 5px;
}
</style>
