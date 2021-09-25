<template>
  <box class="output" v-html="output" style="overflow-y: auto !important; height: 100vh !important" />
</template>

<script>
  import { CBox as Box } from '@chakra-ui/vue';
  export default {
    name: 'view-id',
    components: { Box },
    data: () => ({
      output: 'Loading the note ...'
    }),
    middleware: ['get-note', 'get-user'],
    async asyncData(ctx) {
      const id = ctx.params.id;
      const output = await ctx.$axios.$post('/notes/run', { id });
      if (output.error) return { output: `<div class='error'>${output.error}</div>` };
      else return { output: output.html };
    },
    head() {
      return {
        title: this.$store.state.currentNote.title
      };
    }
  };
</script>

<style scoped></style>
