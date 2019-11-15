<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <HelloWorld/>
      <employe-search
        :show-emp-details="true"
        :fullscreen="false"
        :multi="false"
        sort-by-field='nom'
        :multiple-sort="false"
      >
        <template v-slot:activator="{ on }">
          <v-btn color="success" v-on="on">ici</v-btn>
        </template>
      </employe-search>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import EmployeSearch from './components/EmployeSearch';

export default {
  name: 'App',
  components: {
    HelloWorld,
    EmployeSearch
  },
  data: () => ({
    //
  })
};
</script>
