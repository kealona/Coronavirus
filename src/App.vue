<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
@font-face {
  font-family: myfont;
  src: url("./assets/head_font.otf");
}

* {
  font-family: myfont;
}

html {
  height: 100%;
}

  body {
    height: 100%;
    margin: 0;
    width: 100%;
    overflow-x: hidden;
  }

#app {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
