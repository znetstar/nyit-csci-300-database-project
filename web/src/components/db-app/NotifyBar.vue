<template>
  <div>
    <md-snackbar :md-position="'center'" :md-duration="15e3" :md-active.sync="this.hasMessage" md-persistent>
      <span :v-if="this.hasMessage">{{ this.message }}</span>
      <md-button class="md-primary" @click="isDone()">Close</md-button>
    </md-snackbar>
  </div>
</template>

<script>
export default {
  name: "NotifyBar",
  props: [
    'message',
    'hasMessage',
    'isDone'
  ]
}
</script>

<style scoped>

</style>
