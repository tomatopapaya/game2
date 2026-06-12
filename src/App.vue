<template>
  <div class="app-wrapper">
    <RouterView />
  </div>
</template>

<script lang="js">
import { RouterView } from 'vue-router'

export default {
  components: { RouterView }
}
</script>


<style scoped>
.app-wrapper {
  width: 920px;
  height: 485px;
  background-image: url('/洞窟.png');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0;
  padding: 0;
}
</style>