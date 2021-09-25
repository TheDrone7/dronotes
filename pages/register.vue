<template>
  <box display="flex" flexDirection="column" pt="8" alignItems="center" px="16">
    <box display="flex" w="100%">
      <nuxt-link to="/" exact><c-button variant-color="blue">Go Back</c-button></nuxt-link>
    </box>
    <heading>Create an account on DroNotes!</heading>
    <box as="form" mt="32" w="50%">
      <c-form-control mb="4">
        <c-input
          placeholder="E-Mail ID"
          autofocus
          name="email"
          font-family="mono"
          type="email"
          v-model="email"
          :disabled="disabled"
        />
      </c-form-control>
      <c-form-control mb="4">
        <c-input
          placeholder="Username"
          name="username"
          font-family="mono"
          type="text"
          v-model="username"
          :disabled="disabled"
        />
      </c-form-control>
      <c-form-control mb="4">
        <c-input
          placeholder="Password"
          name="password"
          font-family="mono"
          type="password"
          v-model="password"
          :disabled="disabled"
        />
        <c-form-helper-text id="password-strength">
          Strength of your password: <strong>{{ strength ? strength.value : 'unknown' }}</strong>
          <c-progress :value="((strength.id + 1) / 4) * 100" size="sm" mt="2" :color="colors[strength.id]" />
        </c-form-helper-text>
      </c-form-control>
      <c-button variant-color="green" w="100%" :isLoading="disabled" loading-text="REGISTERING" @click="submitForm"
        >REGISTER NOW</c-button
      >
    </box>
  </box>
</template>

<script>
  import {
    CBox as Box,
    CHeading as Heading,
    CButton,
    CFormControl,
    CInput,
    CFormHelperText,
    CProgress
  } from '@chakra-ui/vue';
  import { passwordStrength } from 'check-password-strength';
  import { serialize } from 'cookie';

  export default {
    name: 'register',
    components: {
      Box,
      Heading,
      CButton,
      CFormControl,
      CInput,
      CFormHelperText,
      CProgress
    },
    data: () => ({
      email: '',
      username: '',
      password: '',
      disabled: false,
      colors: {
        0: 'red',
        1: 'orange',
        2: 'yellow',
        3: 'green'
      }
    }),
    methods: {
      notify(title, description, status) {
        this.$toast({
          position: 'bottom-right',
          title,
          description,
          status,
          duration: 5000
        });
      },
      async submitForm() {
        this.disabled = true;
        const { username, email, password } = this;
        if (!username || !email || !password) {
          let missing = [];
          if (!username) missing.push('Username');
          if (!email) missing.push('E-Mail ID');
          if (!password) missing.push('Password');
          this.notify(
            'Registration error',
            'You need to provide the following details - ' + missing.join(', ') + '.',
            'error'
          );
        } else if (this.strength.id < 2) {
          this.notify('Registration error', 'You need to come up with a more secure password.', 'error');
        } else {
          const user = await this.$axios.$post('/new-user', { username, email, password });
          if (user.success) {
            this.notify(
              'Registered!',
              'You have successfully registered! You will be logged in automatically.',
              'success'
            );
            document.cookie = serialize('user.id', user.key);
            setTimeout(() => window.open('/user', '_self'), 5000);
          } else this.notify('Registration error', user.error, 'error');
        }
        this.disabled = false;
      }
    },
    computed: {
      strength() {
        return passwordStrength(this.password);
      }
    },
    head: {
      title: 'Register'
    }
  };
</script>
