<template>
  <div>
    <markdown-editor v-model="content"/>
  </div>
</template>

<script>
import MarkdownEditor from '@scp/markdown'
export default {
  name: 'markdown_page',
  components: {
    MarkdownEditor
  },
  data () {
    return {
      content: ''
    }
  }
}
</script>

<style>

</style>
