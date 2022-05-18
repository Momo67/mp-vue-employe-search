new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: () => ({
    selected_ou: [],
    active: [],
    items: [],
    open: [],
    allOpened: false,
    lastOpen: [],
    search: '',
    caseSensitive: false,  
  }),
  computed: {
    filter () {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined
    },
  },
  methods: {
    getActiveValue (value) {
      console.log(value[0].id)
    },
    handleSearch: function (val) {
      if ((val) && (val.length > 2)) {
        if (!this.allOpened) {
          this.lastOpen = this.open;
          this.allOpened = true;
          this.$refs.tree.updateAll(true);
        }
      } else {
        this.$refs.tree.updateAll(false);
        this.allOpened = false;
        this.open = this.lastOpen;
      }
    }
  },
  mounted () {
    this.items = JSON.parse('[{ "id": 482, "name": "Culture et développement urbain", "children": [{ "id": 23, "name": "Secrétariat municipal", "children": [{ "id": 216, "name": "Secrétariat de la municipalité" },{ "id": 447, "name": "Santé et sécurité au travail" },{ "id": 220, "name": "Elections / Votations" },{ "id": 359, "name": "Cellule ARC" },{ "id": 223, "name": "Déclarations - Naturalisations - Registre civique" },{ "id": 337, "name": "Commission de police" },{ "id": 338, "name": "Conseil juridique" },{ "id": 452, "name": "Huissiers - Intendance - Courrier" },{ "id": 222, "name": "Casino de Montbenon" },{ "id": 21, "name": "Bureau de la communication", "children": [{ "id": 112, "name": "Web et multimédia" },{ "id": 111, "name": "Info cité" } ]},{ "id": 761, "name": "Unité d\'amélioration des prestations et d\'innovation" } ]},{ "id": 488, "name": "Secrétariat général", "children": [{ "id": 494, "name": "Direction" },{ "id": 495, "name": "Comptabilité" },{ "id": 527, "name": "Bureau du développement de la Ville et des relations extérieurs" },{ "id": 114, "name": "Commission immobilière" },{ "id": 343, "name": "Bureau de développement et projet Métamorphose" },{ "id": 443, "name": "Union Mondiale des Villes Olympiques" },{ "id": 783, "name": "Lausanne à table (Manifestations)" } ]},{ "id": 399, "name": "Culture", "children": [{ "id": 463, "name": "Administration" },{ "id": 464, "name": "Fond des arts plastiques" } ]},{ "id": 316, "name": "Bibliothèques et Archives de la Ville", "children": [{ "id": 57, "name": "Bibliothèques de la Ville" },{ "id": 218, "name": "Archives de la Ville" },{ "id": 457, "name": "Centre BD" } ]},{ "id": 25, "name": "Urbanisme", "children": [{ "id": 262, "name": "Administration" },{ "id": 77, "name": "Atelier des maquettes" },{ "id": 75, "name": "Bureau d\'études" },{ "id": 76, "name": "Office des permis de construire", "children": [{ "id": 105, "name": "OPC Technique" },{ "id": 106, "name": "OPC Administratif" },{ "id": 436, "name": "OPC Hygiène et Habitat" },{ "id": 80, "name": "Analyse et inspection des construction" } ]},{ "id": 110, "name": "Protection du patrimoine bâti" } ]},{ "id": 54, "name": "Contrôle des finances de la Ville de Lausanne" },{ "id": 167, "name": "Secrétariat du conseil communal" }]}]')
  }
})