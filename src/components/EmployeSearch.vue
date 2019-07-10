<template>
  <div id="mp-vue-employe-search">
    <v-container grid-list-xs>
      <v-layout row>
        <v-dialog v-model="dialog" max-width="800px" :fullscreen="$vuetify.breakpoint.xsOnly">
          <template slot="activator">
            <slot></slot>
          </template>

          <v-card>
            <v-card-title>
              <span class="headline">{{multi ? $tc('userInterface.searchEmp' , 2) : $tc('userInterface.searchEmp', 1)}}</span>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="show_form = !show_form">
                    <v-icon>{{ show_form ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                  </v-btn>
                </template>
                <span>{{$t('userInterface.displayCriterionBtn')}}</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>

          <v-card v-show="show_form">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="clear">
                    <v-icon>clear</v-icon>
                  </v-btn>
                </template>
                <span>{{$t('userInterface.resetBtn')}}</span>
              </v-tooltip>
            </v-card-actions>
            <v-card-text>
              <v-container grid-list-md class="pt-0 pb-0">
                <v-form ref="form">
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-autocomplete
                        v-model="employee.idou"
                        :items="orgunits"
                        color="primary"
                        hide-no-data
                        clearable
                        item-text="Description"
                        item-value="IdOrgUnit"
                        :label="$t('userInterface.orgUnit')"
                        :placeholder="$t('userInterface.searchHint')"
                        browser-autocomplete="something-new"
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field v-model="employee.nom" :label="$t('userInterface.lastName')" clearable :rules="[rules.nomprenom]" browser-autocomplete="something-new"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field v-model="employee.prenom" :label="$t('userInterface.firstName')" clearable :rules="[rules.nomprenom]" browser-autocomplete="something-new"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field v-model="employee.loginnt" label="Login NT" clearable :rules="[rules.loginnt]" browser-autocomplete="something-new"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                      <v-text-field v-model="employee.id" label="Id" clearable :rules="[rules.id]" browser-autocomplete="something-new"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-form>
                <v-flex xs12>
                  <v-switch
                    :label="$t('userInterface.displayNonActive')+': ' + (display_nonactive ? $t('userInterface.yes') : $t('userInterface.no'))"
                    v-model="display_nonactive"
                    :false-value="false"
                    :true-value="true"
                  ></v-switch>
                </v-flex>
                <v-flex xs12>
                  <v-alert
                    v-model="alert"
                    dismissible
                    type="warning"
                    icon="error"
                  >
                    {{$t('userInterface.alertMsg')}}
                  </v-alert>
                </v-flex>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="fetchData">{{$t('userInterface.searchBtn')}}</v-btn>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="show_list = !show_list">
                    <v-icon>{{ show_list ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                  </v-btn>
                </template>
                <span>{{$t('userInterface.displayListBtn')}}</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>

          <v-card v-show="show_list">
            <v-card-title>
              <v-spacer></v-spacer>
              <v-layout wrap>
                <v-flex xs8 offset-xs4>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-on="on"
                        v-model="search"
                        append-icon="search"
                        :label="$t('userInterface.search')"
                        single-line
                        hide-details
                      ></v-text-field>
                    </template>
                    <span>{{$t('userInterface.searchListLabel')}}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-card-text>
              <v-layout wrap>
                <v-flex xs12>
                  <v-data-table
                    v-model="selected"
                    :headers="tableHeaders"
                    :items="employees"
                    item-key="idemploye"
                    :search="search"
                    :hide-actions="false"
                    :select-all="false"
                    class="elevation-1"
                    prev-icon="mdi-menu-left"
                    next-icon="mdi-menu-right"
                    sort-icon="mdi-menu-down"
                    :no-data-text="$t('userInterface.noDataText')"
                    :no-results-text="$t('dataIterator.noResultsText')"
                    :rows-per-page-items="[5,10,25,{'text':$t('dataIterator.rowsPerPageAll'),'value':-1}]"
                    :rows-per-page-text="$t('dataTable.rowsPerPageText')">

                    <template v-slot:headerCell="props">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <span v-on="on">
                            {{ props.header.text }}
                          </span>
                        </template>
                        <span>
                          {{ props.header.text }}
                        </span>
                      </v-tooltip>
                    </template>

                    <template v-slot:items="props">
                      <tr :class="(props.item.isactive == '1') ? '' : 'disabled'" class="employee_data_item" @click="if (showEmpDetails) props.expanded = !props.expanded">
                        <slot name="employee_data" :employee_data="props.item">
                          <td>
                            <v-checkbox v-show="(props.item.isactive == '1') || allowNonactiveSelectable"
                              @click.native.stop
                              v-model="props.selected"
                              :disabled="!((props.item.isactive == '1') || allowNonactiveSelectable)"
                              primary
                              hide-details
                            ></v-checkbox>
                          </td>
                          <td>{{props.item.nom}}</td>
                          <td>{{props.item.prenom}}</td>
                          <td>{{getOUFinal(props.item.orgunits)}}</td>
                          <td>{{props.item.idemploye}}</td>
                          <td>{{extractLoginNT(props.item.mainntlogin)}}</td>
                        </slot>
                      </tr>
                    </template>

                    <template v-slot:expand="props">
                      <v-card flat>
                        <v-card-text>
                          <slot name="employee_details" :employee_details="props.item">
                            <div class="employee_details">
                              <span>{{props.item.prenom}}&nbsp;{{props.item.nom}}</span><br>
                              <span>Téléphone prof.: {{props.item.telprof}}</span><br>
                              <span>Email: {{props.item.email}}</span><br>
                              <span>Unité organisationnelle: {{getOUPath(props.item.orgunits.OrgUnit)}}</span>
                            </div>
                          </slot>
                        </v-card-text>
                      </v-card>
                    </template>

                    <template v-slot:no-data>
                      <v-alert :value="true" color="info" icon="info">
                        {{$t('userInterface.noResult')}}
                      </v-alert>
                    </template>

                  </v-data-table>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="cancel">{{$t('userInterface.cancel')}}</v-btn>
              <v-btn color="blue darken-1" flat @click.native="ok">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// import 'babel-polyfill'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import { DEV, ORGUNIT_INIT, EMPLOYEE_INIT, HEADERS } from '../config'
import { ORGUNIT_URL_AJAX, EMP_URL_AJAX } from '../config'
import { employe as EMPLOYE } from './employe'
import { orgunit as ORGUNIT } from './orgunit'

import Log from 'cgil-log'
import jsonpath from 'jsonpath'

const MODULE_NAME = 'EmployeSearch.vue'
const log = (DEV) ? new Log(MODULE_NAME, 4) : new Log(MODULE_NAME, 2)

export default {
  name: 'EmployeSearch',
  props: {
    multi: {
      type: Boolean,
      default: true,
      require: false
    },
    showNonActive: {
      type: Boolean,
      default: false,
      require: false
    },
    showEmpDetails: {
      type: Boolean,
      default: true,
      require: false
    },
    allowNonactiveSelectable: {
      type: Boolean,
      default: false,
      require: false
    },
    json: {
      type: Boolean,
      default: true,
      require: false
    },
    headers: {
      type: Array,
      default: () => [],
      require: false
    },
    get_data_url: {
      type: Object,
      default: () => {
        return {
          orgunit_url: '',
          employee_url: ''
        }
      },
      require: false
    }
  },
  data () {
    return {
      dialog: false,
      show: true,
      show_form: true,
      show_list: false,
      alert: false,
      alert_msg: '',
      display_nonactive: true,
      search: '',
      rules: {
        required: value => !!value || 'Required.',
        nomprenom: value => {
          const pattern = /^[a-zA-Z\s-]*\*?$/
          return pattern.test(value) || 'Valeur invalide'
        },
        id: value => {
          const pattern = /^undefined|[\d]+$/
          return pattern.test(value) || 'Valeur invalide'
        },
        loginnt: value => {
          const pattern = /^undefined|[a-zA-Z_*]{1,5}\d*\*?$/
          return pattern.test(value) || 'Valeur invalide'
        }
      },
      tableHeaders: [],
      employee: undefined,
      employees: [],
      selected: [],
      orgunit: undefined,
      orgunits: []
    }
  },
  watch: {
    selected: {
      handler (val) {
        log.l(`## in watch selected val: `, val)
        if ((!this.multi) && (val.length >1)) {
          val.splice(0, val.length-1)
        }
      }
    },
    employee: {
      handler (val) {
        if (!this.isEqual(val, EMPLOYEE_INIT)) {
          Object.keys(val).forEach(function (key) {
            if ((val[key] === null) || (val[key] === '')) {
              val[key] = undefined
            }
          })
        }
      },
      deep: true
    }
  },
  methods: {
    display () {
      this.dialog = !this.dialog
    },
    initialize () {
      this.employee = Object.assign({}, EMPLOYEE_INIT)
      this.orgunit = Object.assign({}, ORGUNIT_INIT)
      this.get_data_url.orgunit_url = (this.get_data_url.orgunit_url === '') ? ORGUNIT_URL_AJAX : this.get_data_url.orgunit_url
      this.get_data_url.employee_url = (this.get_data_url.employee_url === '') ? EMP_URL_AJAX : this.get_data_url.employee_url
      this.tableHeaders = (Array.isArray(this.headers) && this.headers.length !== 0) ? this.headers : HEADERS
      this.display_nonactive = this.showNonActive
      this.getOUList()
    },
    cancel () {
      this.dialog = false
    },
    clear () {
      this.$refs.form.reset()
      this.employee = Object.assign({}, EMPLOYEE_INIT)
      this.employees = []
      this.show_list = false
    },
    ok () {
      this.$emit('selection_ready', this.json ? JSON.stringify(this.selected) : this.selected, this.selected.length)
      this.selected = []
      this.dialog = false
    },
    fetchData () {
      this.alert = false
      if (this.isEqual(this.employee, EMPLOYEE_INIT)) {
        this.alert = true
        this.show_form = true
      } else {
        EMPLOYE.getList (this.employee, this.get_data_url.employee_url, this.display_nonactive, (data) => {
          this.employees = data
          this.show_form = false
          this.show_list = true
        })
      }
    },
    extractLoginNT (mainntlogin) {
      if (/^LAUSANNE_CH/.test(mainntlogin)) {
        return mainntlogin.substring(12)
      } else {
        return mainntlogin
      }
    },
    getOUPath (orgunits)
    {
      if (orgunits !== undefined) {
        if (Array.isArray(orgunits)) {
          let __myorgunits = orgunits.slice()
          __myorgunits.sort(function (a, b) {
            return parseInt(b.LevelOU) - parseInt(a.LevelOU)
          })
          let __oupath = ''
          __myorgunits.forEach(function (orgunit, index, array) {
            __oupath += orgunit.OUName + ((index+1 != array.length) ? ' / ' : '')
          })
          return __oupath
        } else {
          return orgunits.OUName
        }
      } else {
        return ''
      }
    },
    getOUFinal (orgunits) {
      if (orgunits !== undefined) {
        if (Array.isArray(orgunits.OrgUnit)) {
          return jsonpath.value(orgunits, '$..OrgUnit[?(@.LevelOU==0)].OUName')
        }
        else {
          return orgunits.OrgUnit.OUName
        }
      } else {
        return ''
      }
    },
    getOUList() {
      ORGUNIT.getList (this.orgunit, this.get_data_url.orgunit_url, (data) => {
        this.orgunits = data
      })
    },
    isEqual (obj1, obj2) {
      let __isequal = true
      Object.keys(obj1).forEach(function (key) {
        if (obj2[key] !== obj1[key]) {
          __isequal = false
        }
      })
      return __isequal
    }
  },
  created () {
    this.initialize()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>
#mp-vue-employe-search {
  background-color: transparent;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
td {
  width: 50px;
}
.disabled {
  color: grey;
}
</style>

<i18n src="../locales/fr.json"></i18n>
<i18n src="../locales/en.json"></i18n>
