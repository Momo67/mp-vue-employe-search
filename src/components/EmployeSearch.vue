<template>
  <v-container grid-list-xs>
    <v-layout row>

      <v-flex xs12>
        <v-card>
          <v-card-title>
            <span class="headline">{{select ? (multi ? $tc('userInterface.searchEmp' , 1) : $tc('userInterface.searchEmp', 0)) : $tc('userInterface.searchEmp', 2)}}</span>
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
      </v-flex>

      <v-flex xs12>
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
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="employee.nom" :label="$t('userInterface.lastName')" clearable :rules="[rules.nomprenom]" autocomplete="something-new"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="employee.prenom" :label="$t('userInterface.firstName')" clearable :rules="[rules.nomprenom]" autocomplete="something-new"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="employee.loginnt" label="Login NT" clearable :rules="[rules.loginnt]" autocomplete="something-new"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="employee.id" label="Id" clearable :rules="[rules.id]" autocomplete="something-new"></v-text-field>
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
            <slot name="search" v-bind:on="{ fetchData }">
              <v-spacer></v-spacer>
              <v-btn color="info" text @click.native="fetchData">{{$t('userInterface.searchBtn')}}</v-btn>
            </slot>
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
      </v-flex>

      <v-flex xs12>
        <v-card v-show="show_list">
          <v-card-title>
            <v-spacer></v-spacer>
            <v-layout wrap>
              <v-flex xs8 offset-xs4>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      ref="search_field"
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
                  id="employees_table"
                  v-model="selected"
                  :headers="tableHeaders"
                  :hide-default-header="false"
                  :items="employees"
                  item-key="idemploye"
                  :search="search"
                  :show-select="select"
                  :single-select="!multi"
                  :show-expand="showEmpDetails"
                  :single-expand="true"
                  :calculate-widths="true"
                  class="elevation-1"
                  :multi-sort="multipleSort"
                  :sort-by.sync="computedSortByField"
                  :sort-desc.sync="descending"
                  :no-data-text="$t('userInterface.noDataText')"
                  :no-results-text="$t('dataIterator.noResultsText')"
                  :footer-props="{
                    prevIcon: 'mdi-menu-left',
                    nextIcon: 'mdi-menu-right',
                    sortIcon: 'mdi-menu-down',
                    itemsPerPageOptions: [5,10,25,-1],
                    itemsPerPageText: $t('dataTable.rowsPerPageText'),
                    itemsPerPageAllText: $t('dataIterator.rowsPerPageAll'),
                    pageText: $t('dataIterator.pageText')
                  }"
                >

                  <!--
                  <template v-slot:header.data-table-select="{ on, props }">

                  </template>
                  -->

                  <!--
                  <template v-slot:header="{ props: { headers } }">
                    <thead>
                      <tr>
                      <td>&nbsp;</td>
                      <td><v-simple-checkbox></v-simple-checkbox></td>
                        <td v-for="header in headers" :key="`${header.value}`">
                          <template v-if="header.value != 'data-table-select' && header.value != 'data-table-expand'"> 
                            {{header.text}},{{header.value}}
                          </template>
                        </td>
                      </tr>
                    </thead>
                  </template>
                  -->

                  <!--
                  <template v-slot:item.data-table-select="{ isSelected, select }">
                    <v-simple-checkbox color="green" :value="isSelected" @input="select($event)"></v-simple-checkbox>
                  </template>                    
                  -->

                  <template v-slot:item="{ item, headers, isSelected, select, isExpanded, expand }">
                    <tr :class="((item.isactive == '1') ? 'actif' : 'inactif') + ' employee_row'" @click="$emit('employee_click', item)">
                      <td :key="`check-${item.idemploye}`" v-if="$props.select" style="width:5%;">
                        <v-simple-checkbox :value="isSelected" @input="select($event)"></v-simple-checkbox>
                      </td>
                      <template v-for="header in headers">
                        <td v-if="(header.value != 'data-table-select') && (header.value != 'data-table-expand')" :key="`${header.value}-${item.idemploye}`">
                          {{ displayCell(header.value, item) }}
                        </td>
                      </template>

                      <!--
                      <td>{{item.nom}}</td>
                      <td>{{item.prenom}}</td>
                      <td>{{getOUFinal(item.orgunits)}}</td>
                      <td>{{item.idemploye}}</td>
                      <td>{{extractLoginNT(item.mainntlogin)}}</td>
                      -->

                      <td>
                        <v-icon v-show="showEmpDetails" @click="expand(!isExpanded)">{{ isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>                        
                      </td>
                    </tr>
                  </template>

                  <!--
                  <template v-slot:item.orgunits="{ item }">
                    {{getOUFinal(item.orgunits)}}
                  </template>

                  <template v-slot:item.mainntlogin="{ item }">
                    {{extractLoginNT(item.mainntlogin)}}
                  </template>
                  -->

                  <template v-slot:expanded-item="{item, headers}">
                    <td class="expanded" :colspan="headers.length">
                      <v-card flat>
                        <v-card-text>
                          <slot name="employee_details" v-bind:props="item">
                            <div class="employee_details">
                              <span>{{item.prenom}}&nbsp;{{item.nom}}</span><br>
                              <span>Téléphone prof.: {{item.telprof}}</span><br>
                              <span>Email: {{item.email}}</span><br>
                              <span>Unité organisationnelle: {{getOUPath(item.orgunits.OrgUnit)}}</span>
                            </div>
                          </slot>
                        </v-card-text>
                      </v-card>
                    </td>
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
          <v-card-actions v-if="select">
            <slot name="actions" v-bind:on="{ ok, cancel}" v-bind:props="{ selected }">
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click.native="cancel">{{$t('userInterface.cancel')}}</v-btn>
              <v-btn color="blue darken-1" text @click.native="ok">OK</v-btn>
            </slot>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
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
    value: {
      type: Boolean,
      default: true,
      required: false
    },
    maxWidth: {
      type: [String, Number],
      default: '950px',
      require: false
    },
    select: {
      type: Boolean,
      default: true,
      require: false
    },
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
    fullscreen: {
      type: Boolean,
      default: true,
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
    sortByField: {
      type: [String, Array],
      default: '',
      require: false
    },
    sortDesc: {
      type: Boolean,
      default: false,
      require: false
    },
    multipleSort: {
      type: Boolean,
      default: true,
      require: false
    },
    get_data_url: {
      type: Object,
      default: () => ({
          orgunit_url: '',
          employee_url: ''
      }),
      require: false
    }
  },
  data () {
    return {
      show: true,
      show_form: true,
      show_list: false,
      alert: false,
      alert_msg: '',
      display_nonactive: true,
      search: '',
      descending: false,
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
  computed: {
    computedSortByField: {
      get: function () {
        return (this.sortByField === '') || (this.sortByField === []) ? [this.tableHeaders[0].value, this.tableHeaders[1].value] : this.sortByField
      },
      set: function () {

      }
    } 
  },
  methods: {
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
      this.$emit('input', false)
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
      this.$emit('input', false)
    },
    fetchData () {
      this.alert = false
      if (this.isEqual(this.employee, EMPLOYEE_INIT)) {
        this.alert = true
        this.show_form = true
      } else {
        EMPLOYE.getList (this.employee, this.get_data_url.employee_url, this.display_nonactive, (data) => {
          if (data !== undefined) {
            this.employees = data
            this.show_form = false
            this.show_list = true
          } else {
            this.employees = []
            this.show_form = true
            this.show_list = true
            this.$nextTick(() => this.$refs.search_field.focus())
          }
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
    },
    displayCell (fieldname, row) {
      let __retval = ''
      switch (fieldname) {
        case 'orgunits':
          __retval = this.getOUFinal(row[fieldname])
          break

        case 'mainntlogin':
          __retval = this.extractLoginNT(row[fieldname])
          break

        default:
          __retval = row[fieldname]
      }
      return __retval
    }
  },
  created () {
    this.initialize()
  },
  mounted () {
    this.descending = this.sortDesc
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">
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
.container {
  padding: 1px;
}
.actif {
  color: black;
}
.inactif {
  color: red;
}
</style>

<style scoped>
.expanded {
  background: lightgray;
  padding-bottom: 1px;
  border-color: red;
  color: blue;

}
.employee_row {
  border: 5px solid red;
}
</style>
<i18n src="../locales/fr.json"></i18n>
<i18n src="../locales/en.json"></i18n>
