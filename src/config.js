export const DEV = process.env.NODE_ENV === 'development'

export const EMP_URL_AJAX = DEV ? 'http://localhost/goeland/employe/ajax' : '/goeland/employe/ajax'

export const ORGUNIT_URL_AJAX = DEV ? 'http://localhost/goeland/uniteorg/ajax' : '/goeland/uniteorg/ajax'

export const EMPLOYEE_INIT = {
  nom: null,
  prenom: null,
  loginnt: null,
  id: null,
  idou: null
}

export const ORGUNIT_INIT = {
  isactive: 1
}

export const HEADERS = [
  /*
  {
    text: '',
    value: 'select',
    width: 1
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
    width: 20
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
  },
  {
    text: '',
    value: 'data-table-expand'
  },
]