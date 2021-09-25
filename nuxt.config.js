import cookies from 'cookie-parser';
import bodyParser from 'body-parser';
import app from './api';

export default {
  head: {
    title: 'Home',
    titleTemplate: titleChunk => (titleChunk ? `${titleChunk} | DroNotes` : 'DroNotes'),
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://unpkg.com/katex@0.12.0/dist/katex.min.css' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fira+Code&family=PT+Sans&family=Montserrat&family=Raleway:wght@300&family=Material+Icons&display=swap'
      }
    ]
  },
  css: ['~/assets/prism.css', '~/assets/view.css', '~/assets/output.css'],

  plugins: [{ src: '~/plugins/editor.js', mode: 'client' }],
  components: true,
  modules: ['@chakra-ui/nuxt', '@nuxtjs/emotion', '@nuxtjs/pwa', '@nuxtjs/axios'],
  buildModules: [],

  chakra: {
    extendTheme: {
      fonts: {
        heading: '"Montserrat", sans-serif',
        body: '"Raleway", sans-serif',
        mono: '"Fira Code", monospace'
      },
      colors: {
        gray: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B'
        }
      }
    },
    config: { autoImport: true }
  },

  build: {},

  compilerOptions: {
    types: ['@nuxt/types', '@nuxtjs/axios']
  },

  serverMiddleware: [
    { path: '/', handler: cookies() },
    { path: '/', handler: bodyParser.json() },
    { path: '/', handler: app }
  ]
};
