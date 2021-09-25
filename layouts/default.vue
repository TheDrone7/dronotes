<template>
  <div>
    <c-theme-provider>
      <c-color-mode-provider value="dark">
        <c-box font-family="body" as="main">
          <c-reset />
          <Nuxt />
        </c-box>
      </c-color-mode-provider>
    </c-theme-provider>
  </div>
</template>

<script>
import {
  CThemeProvider,
  CColorModeProvider,
  CReset,
  CBox
} from '@chakra-ui/vue'

export default {
  name: 'App',
  components: {
    CThemeProvider,
    CColorModeProvider,
    CReset,
    CBox
  }
}
</script>

<style>
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: none;
}

::-webkit-scrollbar-thumb {
  background: #999;
}

::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

::placeholder {
  color: #999999 !important;
}

html {
  overflow: hidden;
}

a {
  color: #9DECF9;
  transition: all linear 100ms;
}
a:hover {
  color: #0BC5EA;
}
</style>
