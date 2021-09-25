<template>
  <div>
    <box w="100vw" h="100vh" display="flex" flexDirection="column" alignItems="center">
      <hero title="DroNotes" subtitle="EZ Note-taking with Latex and Markdown support" />
      <c-button variant-color="cyan" mt="12" @click="openModal">LOGIN TO GET STARTED!</c-button>
      <box mt="4">Not registered yet?&#8194;<nuxt-link to="/register" exact>Register now</nuxt-link></box>
    </box>
    <c-modal :is-open="loginModal" :on-close="closeModal" block-scroll-on-mount>
      <c-modal-content ref="content">
        <c-modal-header>Login Now</c-modal-header>
        <c-modal-close-button />
        <c-modal-body>
          <box as="form" mt="4">
            <c-form-control mb="2">
              <c-input
                placeholder="Username"
                autocomplete="username"
                name="username"
                font-family="mono"
                type="text"
                v-model="username"
                :disabled="disabled"
              />
            </c-form-control>
            <c-form-control mb="8">
              <c-input
                placeholder="Password"
                autocomplete="current-password"
                name="password"
                font-family="mono"
                type="password"
                v-model="password"
                :disabled="disabled"
              />
            </c-form-control>
            <c-button
              variant-color="green"
              w="100%"
              :isLoading="disabled"
              loading-text="LOGGING IN..."
              @click="submitForm"
              >LOGIN</c-button
            >
            <c-button variant-color="red" mt="2" mb="4" w="100%" :isLoading="disabled" @click="closeModal"
              >CANCEL</c-button
            >
          </box>
        </c-modal-body>
      </c-modal-content>
      <c-modal-overlay />
    </c-modal>
  </div>
</template>

<script lang="js">
  import { CBox as Box, CButton, CModal, CModalContent, CModalHeader, CModalCloseButton, CModalBody, CModalOverlay, CModalFooter, CFormControl, CInput } from '@chakra-ui/vue';
  import { serialize } from "cookie";

  export default {
    name: 'App',
    components: {Box, CButton, CModal, CModalFooter, CModalContent, CModalHeader, CModalCloseButton, CModalBody, CModalOverlay, CInput, CFormControl},
    data () {
      return {
        loginModal: false,
        username: '',
        password: '',
        disabled: false
      };
    },
    middleware: (ctx) => {
      if (process.server) {
        if (ctx.req.headers.cookie && ctx.req.headers.cookie.includes('user.id')) ctx.redirect('/user');
      } else if (process.client) {
        if (document.cookie && document.cookie.includes('user.id')) ctx.redirect('/user');
      }
    },
    methods: {
      openModal() {this.loginModal = true;},
      closeModal() {this.loginModal = false;},
      notify(title, description, status) {
        this.$toast({
          position: 'bottom-right',
          title, description, status,
          duration: 5000
        });
      },
      async submitForm() {
        this.disabled = true;
        const { username, password } = this;
        if (!username || !password) this.notify('Invalid credentials', 'Please provide your username and password.', 'error');
        else {
          const user = await this.$axios.$post('/login', { username, password });
          if (user && user.success) {
            document.cookie = serialize('user.id', user.key);
            window.open('/user', '_self');
          } else {
            this.notify('Login Error', user.error || 'Invalid credentials were provided, please verify and try again.', 'error');
          }
        }
        this.disabled = false;
      }
    }
  }
</script>
