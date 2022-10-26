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

    <v-main>
      <HelloWorld/>
      {{dialog}}<br/>
      <v-btn color="info" @click="dialog = !dialog">Rechercher</v-btn>
      <!--
      -->
      <v-dialog v-model="dialog" max-width="50%" :fullscreen="false" :scrollable="false" class="employe-search">
      <v-container>
        <v-row justify="center">
          <employe-search
            id="employe-search"
            v-model="dialog"
            :fullscreen="false"
            :select="true"
            :multi="true"
            :json="true"
            :get_data_url="get_data_url"
            @selection-ready="selection_ready"
            @employee-click="employee_click"
            @clear-press="onClearPress"
            @list-ready="onListReady"
          >
          <!--
            <template v-slot:activator="{ on }">
              <v-btn color="success" v-on="on">ici</v-btn>
            </template>
            -->

            <template v-slot:search="{ on: { fetchData } }">
              <v-spacer></v-spacer>
              <v-btn color="info" @click.native="fetchData">Rechercher</v-btn>
            </template>

            <template v-slot:employee_details="{ props: item }">
              <employe
                id="employe"
                v-if="checkRights(item.idemploye, item.orgunits)"
                v-model="item.idemploye"
                :get_data_url="get_data_url"
              >
                <template v-slot:actions="{ on: { save } }">
                  <v-container>
                    <v-row justify="end">
                      <v-col cols="2">
                        <v-btn color="info" @click="save">Sauver</v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </template>
              </employe>
              <div v-else :class="((item.isactive == '1') ? 'actif' : 'inactif') + ' expanded'">
                <span>{{item.prenom}}&nbsp;{{item.nom}}</span><br>
                <span>Téléphone prof.: {{item.telprof}}</span><br>
                <span>Email: {{item.email}}</span><br>
              </div>
            </template>

            <template v-slot:actions="{ on: { ok, cancel } }">
              <v-container>
                <v-row justify="end" no-gutters>
                  <v-spacer></v-spacer>
                  <v-col cols="2">
                    <v-btn color="info" @click.native="cancel">Annuler</v-btn>
                  </v-col>
                  <v-col cols="1">
                    <v-btn color="info" @click.native="ok">OK</v-btn>
                  </v-col>
                </v-row>
                <!--
                <v-row>
                  <v-col>
                    <v-card>
                      <div>{{selected}}</div>
                    </v-card>
                  </v-col>
                </v-row>
                -->
              </v-container>
            </template>
          </employe-search>
        </v-row>
      </v-container>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import EmployeSearch from './components/EmployeSearch.vue'
import Employe from 'mp-vue-employe'

import { employe } from 'mp-vue-employe/src/components/employe'
import jsonpath from 'jsonpath'

export default {
  name: 'App',
  components: {
    HelloWorld,
    EmployeSearch,
    Employe
  },
  data: () => ({
    dialog: false,
    get_data_url: {orgunit_url: 'http://mygolux.lausanne.ch/goeland/uniteorg/ajax', employee_url: 'http://mygolux.lausanne.ch/goeland/employe/ajax'},
    isEditable: false
    //
  }),
  methods: {
    checkRights (idemploye, orgunits) {
      employe.checkRights({idempeditor: 10958, idemployetoedit: idemploye, idou: jsonpath.value(orgunits, '$..OrgUnit[?(@.LevelOU==0)].IdOU')}, this.get_data_url.employee_url, (data) => {
        this.isEditable = (parseInt(data.RetCode) != 0)
      })
      
      return this.isEditable
    },
    selection_ready (employees, length) {
      alert(`selection_ready:\nemployees: ${employees}\nlength: ${length}`)
    },
    employee_click (employee) {
      console.log('### employee_click: ', employee)
    },
    onClearPress () {
      console.log('### onClearPress')
    },
    onListReady (employees) {
      console.log('### onListReady: ', employees)
    }
  }
}
</script>

<style lang="css">
#employe-search {
  background-color: white;
  width: 100%;
}
/*
.actif {
  color: black;
}
.inactif {
  color: red;
}
*/
.expanded {
  /*background: lightgray;*/
  width: 1500px;
}
</style>