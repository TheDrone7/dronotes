<template>
  <box px="8" bg="gray.900" py="4" display="flex" justify-content="space-between" align-items="center" font-family="mono">
    <c-menu>
      <c-menu-button right-icon="chevron-down">
        <box as="strong" pr="8">{{ username }}</box>
      </c-menu-button>
      <c-menu-list style="margin-left: 1.5rem !important;">
        <c-menu-item py="4" @click="goHome" v-if="!home">Home</c-menu-item>
        <c-menu-item py="4" color="red.200" @click="logoutUser">Logout</c-menu-item>
      </c-menu-list>
    </c-menu>
    <box class="buttons-box" display="flex">
      <c-button variant-color="blue" mr="4" @click="open"><span class="material-icons">add</span></c-button>
    </box>
    <c-modal :is-open="openNew" :on-close="close" is-centered>
      <c-modal-content ref="content">
        <c-modal-header>New Note</c-modal-header>
        <c-modal-close-button />
        <c-modal-body>
          <box as="div" mt="4" mb="12">
            <c-form-control mb="2">
              <c-input placeholder="Title" autocomplete="title" autofocus name="title" font-family="mono" type="text" v-model="title" :disabled="disabled" />
            </c-form-control>
          </box>
        </c-modal-body>
        <c-modal-footer>
          <c-button variant-color="vue" mr="3" @click="createNote">CREATE</c-button>
          <c-button variant-color="red" @click="close">CANCEL</c-button>
        </c-modal-footer>
      </c-modal-content>
      <c-modal-overlay />
    </c-modal>
  </box>
</template>

<script>
import {
  CModal, CModalOverlay, CModalContent, CModalHeader, CModalFooter, CModalBody, CModalCloseButton,
  CMenu, CMenuButton, CMenuList, CMenuItem, CMenuGroup, CMenuDivider, CMenuOptionGroup, CMenuItemOption,
  CBox as Box, CHeading as Heading, CButton, CIconButton, CFormControl, CInput, CIcon
} from '@chakra-ui/vue';
import {serialize} from "cookie";

export default {
  name: "Navbar",
  props: ['username', 'home'],
  components: {
    CModal, CModalOverlay, CModalContent, CModalHeader, CModalFooter, CModalBody, CModalCloseButton,
    Box, Heading, CButton, CIconButton, CMenu, CFormControl, CInput, CIcon,
    CMenuButton, CMenuList, CMenuItem, CMenuGroup, CMenuDivider, CMenuOptionGroup, CMenuItemOption
  },
  data: () => ({
    openNew: false,
    disabled: false,
    title: '',
  }),
  methods: {
    logoutUser() {if (process.client) {window.open('/logout', '_self');}},
    goHome() {if (process.client) {window.open('/user', '_self');}},
    open() {this.openNew = true},
    close() {this.openNew = false},
    notify(title, description, status) {
      this.$toast({
        position: 'bottom-right',
        title, description, status,
        duration: 5000
      });
    },
    async createNote() {
      this.disabled = true;
      const { title } = this;
      if (!title) this.notify('Error', 'Please provide a name for your note.', 'error');
      else {
        const note = await this.$axios.$post('/notes/create', { title });
        if (note && !note.error) {
          window.open('/user/note/' + note.id, '_self');
        } else {
          this.notify('Error', note.error || 'Could not create the notes due to a database error. Try again later!', 'error');
        }
      }
      this.disabled = false;
    }
  }

}
</script>
