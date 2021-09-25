<template>
  <c-box w="100%" py="8" display="flex" h="40%" flexDirection="column" alignItems="center" justifyContent="center" bg="gray.700">
    <c-heading>{{ title }}</c-heading>
    <c-text font-size="xl" mt="2">{{ subtitle }}</c-text>
  </c-box>
</template>

<script>
import { CBox, CHeading, CText } from '@chakra-ui/vue'
export default {
  name: "Hero",
  props: ['title', 'subtitle'],
  components: {
    CBox,
    CHeading,
    CText
  }
}
</script>
