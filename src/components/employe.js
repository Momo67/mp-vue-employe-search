import axios from 'axios'
import { DEV } from '../config'
import Log from 'cgil-log'

const MODULE_NAME = 'employe.js'
const log = (DEV) ? new Log(MODULE_NAME, 4) : new Log(MODULE_NAME, 2)

var objGlobal = window;
if(!(objGlobal.escape && objGlobal.unescape)) {
  var escapeHash = {
    _ : function(input) {
      var ret = escapeHash[input];
      if(!ret) {
        if(input.length - 1) {
          ret = String.fromCharCode(input.substring(input.length - 3 ? 2 : 1));
        }
        else {
          var code = input.charCodeAt(0);
          ret = code < 256
            ? "%" + (0 + code.toString(16)).slice(-2).toUpperCase()
            : "%u" + ("000" + code.toString(16)).slice(-4).toUpperCase();
        }
        escapeHash[ret] = input;
        escapeHash[input] = ret;
      }
      return ret;
    }
  };
  objGlobal.escape = objGlobal.escape || function(str) {
    return str.replace(/[^\w @*\-+./]/g, function(aChar) {
      return escapeHash._(aChar);
    });
  };
  objGlobal.unescape = objGlobal.unescape || function(str) {
    return str.replace(/%(u[\da-f]{4}|[\da-f]{2})/gi, function(seq) {
      return escapeHash._(seq);
    });
  };
}

let instance = null
/*  Singleton to retrieve employe
*/
class Employe {
  constructor() {
    if (!instance) {
      instance = this
    }
    // to test whether we have singleton or not and store how old is data
    this.time = new Date()
    this.data = []
    this.isReady = false
    return instance
  }


  getList(employe, get_data_url, display_nonactive, callback) {
    if (employe.idou == null) {
      employe.idou = 0
    }
    if ((employe.nom === null) || (employe.nom === undefined) || (employe.nom == '')) {
      employe.nom = '*'
    } else if (employe.nom.slice(-1) != '*') {
      employe.nom += '*'
    }
    if ((employe.prenom === null) || (employe.prenom === undefined) || (employe.prenom == '')) {
      employe.prenom = '*'
    } else if (employe.prenom.slice(-1) != '*') {
      employe.prenom += '*'
    }
    employe.nom = escape(employe.nom)
    employe.prenom = escape(employe.prenom)

    let __fetch_url = `${get_data_url}/employe_get_liste.php`
    axios.post(__fetch_url, {params: employe}).then(response => {
      if (response.data.Employe !== undefined) {
        let __data = response.data.Employe.filter(employe => (employe.IsActive === '1') || display_nonactive)
  
        __data.forEach(function(employee) {
          for (var prop in employee) {
            employee[prop.toLowerCase()] = employee[prop]
            if (typeof employee.prenom === 'object')
              employee.prenom = ''
            delete employee[prop]
          }
        })
        callback(__data)
  
        log.l('## in Employe::getList employees: ', __data)
      } else {
        callback(undefined)
      }
    }).catch(error => {
      if (error.response) {
        log.e(`## in Employe::getList Error data: ${error.response.data}, status: ${error.response.status}, headers: ${error.response.headers}`)
      } else if (error.request) {
        log.e(`## in Employe::getList Error request: `, error.request)
      } else {
        log.e(`## in Employe::getList Error: `, error.message)
      }
      log.e(`## in Employe::getList Error: `, error.config)
    })
  }
}

export const employe = new Employe()
