<template>

  <div id="app">
    <Navigation></Navigation>
    <router-view/>
  </div>
</template>

<script>
/* eslint quote-props: "off" */
import Navigation from './components/Navigation'
export default {
  name: 'App',
  components: {
    'Navigation': Navigation
  }
}
</script>

<style >

</style>
