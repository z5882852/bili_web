<template>
    <TopNavbar />
    <router-view />
</template>

<script>
import TopNavbar from "./components/TopNavbar.vue";

export default {
    name: "App",
    components: {
        TopNavbar,
    },
    setup() {

        return {

        };
    },
};
</script>

<style>
html,
body {
    height: 100%;
    margin: 0;
}

#app {
    height: 100%;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
