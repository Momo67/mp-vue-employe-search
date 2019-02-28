<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <HelloWorld/>
      recherche d'employés:<EmployeSearch>ici</EmployeSearch>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import EmployeSearch from './components/EmployeSearch'

export default {
  name: 'App',
  components: {
    HelloWorld,
    EmployeSearch
  },
  data () {
    return {
      //
    }
  }
}
</script>

<style lang="css">
  .demo {
    width: 100px;
    height: 10px;
  }
  .employee_info span {
    /* text-decoration: line-through; */
  }
  #mp-vue-employe-search {
    background-color: #FF0000;
    width: 0px;
    display: inline-block;
    height: 0px;
  }
</style>