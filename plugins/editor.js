import { CodeJar } from 'codejar';
import { withLineNumbers } from 'codejar/linenumbers';
import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-latex';
import 'prismjs/components/prism-python';

export default (ctx, inject) => {
  inject('setup', selector => {
    const newLanguage = { ...Prism.languages.latex, ...Prism.languages.markdown };
    const content = window.localStorage.getItem(ctx.store.state.currentNote.id + '-content');
    const jar = CodeJar(
      document.querySelector(selector),
      withLineNumbers(editor => {
        const code = editor.textContent;
        window.localStorage.setItem(ctx.store.state.currentNote.id + '-content', code);
        editor.innerHTML = Prism.highlight(code, newLanguage, 'md');
      }),
      { spellcheck: false }
    );
    jar.updateCode(content);
    return jar;
  });
};
