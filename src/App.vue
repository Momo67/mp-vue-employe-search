<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank">
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <HelloWorld/>
      recherche d'employés:
      <employe-search v-bind="init">
        <template v-slot:default>ici</template>
        <template v-slot:employee_data="employee">
          <!-- <td></td> -->
          <td>{{employee.employee_data.nom}}</td>
          <td>{{employee.employee_data.prenom}}</td>
          <td>{{getOUFinal(employee.employee_data.orgunits)}}</td>
          <td>{{employee.employee_data.idemploye}}</td>
          <td>{{employee.employee_data.mainntlogin}}</td>
        </template>
        <template v-slot:employee_details="employee">
          <div class="employee_details">
            <span>Nom: {{employee.employee_details.prenom}}&nbsp;{{employee.employee_details.nom}}</span>
            <br>
            <span>{{employee.employee_details.mainntlogin}}</span>
            <br>
            <span>{{getOUFinal(employee.employee_details.orgunits)}}</span>
          </div>
        </template>
      </employe-search>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import EmployeSearch from './components/EmployeSearch'
import jsonpath from 'jsonpath'

export default {
  name: 'App',
  components: {
    HelloWorld,
    'employe-search': EmployeSearch
  },
  data () {
    return {
      init: {
        propNumber: 666,
        propString: 'The Beast',
        get_data_url: {
          orgunit_url: 'http://mygolux.lausanne.ch/goeland/uniteorg/ajax',
          employee_url: 'http://mygolux.lausanne.ch/goeland/employe/ajax'
        },
        headers : [
  /*        
          {
            text: '',
            value: '',
            align: 'left',
            sortable: false,
            width: 10
          },
  */        
          {
            text: 'Nom',
            value: 'nom',
            align: 'left',
            sortable: true,
            width: 10
          }, 
          {
            text: 'Prénom',
            value: 'prenom',
            align: 'left',
            sortable: true,
            width: 10
          }, 
          {
            text: 'Unité organisationnelle',
            value: 'orgunits',
            align: 'left',
            sortable: true,
            width: 400
          }, 
          {
            text: 'Id',
            value: 'idemploye',
            align: 'left',
            sortable: true,
            width: 10
          }, 
          {
            text: 'Login NT',
            value: 'mainntlogin',
            align: 'left',
            sortable: true,
            width: 10
          }
        ]
      },
    }
  },
  methods: {
    getOUFinal (orgunits) {
      return jsonpath.value(orgunits, '$..OrgUnit[?(@.LevelOU==0)].OUName')
    }
  }
}
</script>

<style lang="css">
.demo {
  width: 100px;
  height: 10px;
}
.employee_details span {
  text-decoration: line-through;
}
.employee_data_item {
  vertical-align: auto;
}
#mp-vue-employe-search {
  background-color: #ff0000;
  width: 0px;
  display: inline-block;
  height: 0px;
}
</style>