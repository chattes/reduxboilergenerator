#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Generates React Redux- Boiler Plate for API calls using jquery AJAX
var fs = require("fs");
var path = require("path");
var argv = process.argv.slice(2);
var promptly = require('promptly');
var fsPath = require('fs-path');
var possibleActions = ['C', 'R', 'U', 'D'];
var R = require('ramda');
var reducerName = null;
var actionName = null;
var parameters = [];
var crudOp = null;

promptly.prompt('Reducer For?(Enter The Top level Component):', {
  default: 'AppReducer'
}).then(function (value) {
  reducerName = value.toLowerCase();
  promptly.prompt('Action Name: ').then(function (action) {
    actionName = action.toUpperCase();
    promptly.prompt('Additonal Parameters for Action(Comma separated values):').then(function (values) {
      parameters = values.split(',').map(function (value) {
        return value.trim();
      });
      promptly.prompt('CRUD action(Enter C, R, U or D):').then(function (value) {
        crudOp = value.toUpperCase();
        if (possibleActions.findIndex(function (action) {
          return action == value;
        }) < 0) {
          throw 'Invalid Action Supplied';
        }
        StartBoiler();
      });
    });
  });
});

var StartBoiler = function StartBoiler() {

  ProcessReducer({
    actionName: actionName,
    reducerName: reducerName
  });
};

var ProcessReducer = function ProcessReducer(_ref) {
  var actionName = _ref.actionName,
      reducerName = _ref.reducerName;


  // Adds Action files and Directory Structure
  console.log('Start...');
  var actionTypeReq = actionName + "_REQ";
  var actionTypeRes = actionName + "_RES";
  var actionTypeErr = actionName + "_ERR";
  var actionTypePath = path.join(process.cwd(), 'Actions', reducerName.toLowerCase() + "ActionType.js");
  if (fs.existsSync(actionTypePath)) {
    fs.readFile(actionTypePath, function (err, data) {
      addActionTypeFile(err, data, actionTypePath);
      AddActionFile();
    });
  } else {
    var actionTypeCode = "export const " + reducerName.toLowerCase() + "ActionType = {\n    " + actionTypeReq + " : '" + actionTypeReq + "',\n    " + actionTypeRes + " : '" + actionTypeRes + "',\n    " + actionTypeErr + " : '" + actionTypeErr + "',\n   }\n     ";
    fsPath.writeFile(actionTypePath, actionTypeCode, function (err) {
      if (err) throw err;
      console.log('Done Action Types Generation...');
      AddActionFile();
    });
  }

  // Adds Reducer files and Directory Structure
  addReducerFile();
};

var addActionTypeFile = function addActionTypeFile(err, data, path) {
  if (err) throw err;
  var fileContents = data.toString();
  var closingBrace = fileContents.indexOf('}');
  var newActionEntry = "\n\n  " + actionName + "_REQ : '" + actionName + "_REQ',\n  " + actionName + "_RES : '" + actionName + "_RES',\n  " + actionName + "_ERR : '" + actionName + "_ERR',\n  ";
  var mod = [fileContents.slice(0, closingBrace), newActionEntry, fileContents.slice(closingBrace)].join("");

  fs.writeFile(path, mod, function (err) {
    if (err) throw err;
    console.log("done Action Types...");
  });
};
// Utility - Convert Under_score to camelCase
var convCamelCase = exports.convCamelCase = function convCamelCase(actionName) {
  return actionName.split("_").map(function (word, index) {
    // If it is the first word make sure to lowercase all the chars.
    if (index == 0) {
      return word.toLowerCase();
    }
    // If it not the first word only upper case the first char and lowercase the parameters.
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join("");
};

var AddActionFile = function AddActionFile() {
  var actionCreatorPath = path.join(process.cwd(), 'Actions', reducerName.toLowerCase() + "Actions.js");
  console.log('Add Action Creators...');

  var apiCode = "";
  var actionNameL = actionName.toLowerCase();
  switch (crudOp) {
    case 'C':
      apiCode = "\n      //API Call for " + actionNameL + "\n      export const " + actionNameL + "API = ({\n        authKey,\n        isAuthenticated,\n        link,\n        " + [].concat(_toConsumableArray(parameters)) + ",\n        createData}) => (dispatch, getState) => {\n        let state = getState()\n        if (isAuthenticated) {\n          dispatch(" + actionNameL + "Req({" + [].concat(_toConsumableArray(parameters)) + "}))\n          //FILL ACTUAL DATA ---HERE!!!!\n          let data = null\n          //FILL API DATA******\n          return $.ajax({\n            method: 'POST',\n            url: link,\n            headers: {\n              Authorization: authKey \n            },\n            data: data,\n            // processData: false,\n            // contentType: false,\n            // crossDomain: true,\n            // mimeType: 'multipart/form-data',\n            success: payload => dispatch(" + actionNameL + "Res({payload," + [].concat(_toConsumableArray(parameters)) + "})),\n            error: (error) => dispatch(" + actionNameL + "Err({error," + [].concat(_toConsumableArray(parameters)) + "})),\n            timeout: TIMEOUT\n          })\n        } else {\n          return this\n        }\n      }      \n      ";
      break;
    case 'R':
      apiCode = "\n      //API Call for " + actionNameL + " --READ\n      export const " + actionNameL + "API = ({\n        authKey,\n        isAuthenticated,\n        link,\n        " + [].concat(_toConsumableArray(parameters)) + "}) => (dispatch, getState) => {\n        dispatch(fetchToken(storage))\n        let state = getState()\n        if (isAuthenticated) {\n          dispatch(" + actionNameL + "Req({" + [].concat(_toConsumableArray(parameters)) + "}))\n          return $.ajax({\n            method: 'GET',\n            url: link,\n            headers: {\n              Authorization: authKey \n            },\n            success: payload => dispatch(" + actionNameL + "Res({payload," + [].concat(_toConsumableArray(parameters)) + "})),\n            error: (error) => dispatch(" + actionNameL + "Err({error," + [].concat(_toConsumableArray(parameters)) + "})),\n            timeout: TIMEOUT\n          })\n        } else {\n          return this\n        }\n      }\n        \n      ";
      break;
    case 'U':
      apiCode = "\n      //API Call for " + actionNameL + "\n      export const " + actionNameL + "API = ({\n        authKey,\n        isAuthenticated,\n        link,\n        " + [].concat(_toConsumableArray(parameters)) + ",\n        updateData}) => (dispatch, getState) => {\n        dispatch(fetchToken(storage))\n        let state = getState()\n        if (isAuthenticated) {\n          dispatch(" + actionNameL + "Req({" + [].concat(_toConsumableArray(parameters)) + "}))\n          let data = null\n          //FILL API DATA******\n          return $.ajax({\n            method: 'PUT',\n            url: link,\n            headers: {\n              Authorization: authKey \n            },\n            data: data,\n            // processData: false,\n            // contentType: false,\n            // crossDomain: true,\n            // mimeType: 'multipart/form-data',\n            success: payload => dispatch(" + actionNameL + "Res({payload," + [].concat(_toConsumableArray(parameters)) + "})),\n            error: (error) => dispatch(" + actionNameL + "Err({error," + [].concat(_toConsumableArray(parameters)) + "})),\n            timeout: TIMEOUT\n          })\n        } else {\n          return this\n        }\n      }\n         \n      ";
      break;
    case 'D':
      apiCode = "\n      //API Call for " + actionNameL + "\n      export const " + actionNameL + "API = ({\n        authKey,\n        isAuthenticated,\n        link,\n        " + [].concat(_toConsumableArray(parameters)) + "\n        }) => (dispatch, getState) => {\n        dispatch(fetchToken(storage))\n        let state = getState()\n        if (isAuthenticated) {\n          dispatch(" + actionNameL + "Req({payload:{}," + [].concat(_toConsumableArray(parameters)) + "}))\n          return $.ajax({\n            method: 'DELETE',\n            url: link,\n            headers: {\n              Authorization: authKey \n            },\n           success: payload => dispatch(" + actionNameL + "Res({payload," + [].concat(_toConsumableArray(parameters)) + "})),\n           error: (error) => dispatch(" + actionNameL + "Err({error})),\n           timeout: TIMEOUT\n          })\n        } else {\n          return this\n        }\n      }\n      ";
      break;
    default:
      apiCode = "";

  }
  var actionNameCC = convCamelCase(actionName);
  if (fs.existsSync(actionCreatorPath)) {
    console.log('Append to file Action...');

    fs.readFile(actionCreatorPath, function (err, data) {
      if (err) throw err;
      var content = data.toString();
      var actionCreatorCodeExists = "\n    export const " + actionNameCC + "Req = ({" + [].concat(_toConsumableArray(parameters)) + "}) => ({\n      type: " + reducerName.toLowerCase() + "ActionType." + actionName + "_REQ,\n      " + [].concat(_toConsumableArray(parameters)) + "\n    })\n    export const " + actionNameCC + "Res = ({payload, " + [].concat(_toConsumableArray(parameters)) + "}) => ({\n      type: " + reducerName.toLowerCase() + "ActionType." + actionName + "_RES,\n      payload,\n      " + [].concat(_toConsumableArray(parameters)) + "\n    })\n    export const " + actionNameCC + "Err = ({error, " + [].concat(_toConsumableArray(parameters)) + "}) => ({\n      type: " + reducerName.toLowerCase() + "ActionType." + actionName + "_ERR,\n      error,\n      " + [].concat(_toConsumableArray(parameters)) + "\n    })\n\n    " + apiCode + "      \n    ";
      var newCode = "\n    " + content + "\n// Action Creators for " + actionName + "\n    " + actionCreatorCodeExists + "\n    ";
      fs.writeFile(actionCreatorPath, newCode, function (err) {
        if (err) throw err;
        console.log("done Action Creator...");
      });
    });
  } else {
    var actionCreatorCode = "\n    import $ from 'jquery'\n    import { " + reducerName.toLowerCase() + "ActionType } from './" + reducerName.toLowerCase() + "ActionType'\n    \n    \n    const TIMEOUT = 5000\n\n    export const " + actionNameCC + "Req = ({" + [].concat(_toConsumableArray(parameters)) + "}) => ({\n      type: " + reducerName.toLowerCase() + "ActionType." + actionName + "_REQ,\n      " + [].concat(_toConsumableArray(parameters)) + "\n    })\n    export const " + actionNameCC + "Res = ({payload, " + [].concat(_toConsumableArray(parameters)) + "}) => ({\n      type: " + reducerName.toLowerCase() + "ActionType." + actionName + "_RES,\n      payload,\n      " + [].concat(_toConsumableArray(parameters)) + "\n    })\n    export const " + actionNameCC + "Err = ({error, " + [].concat(_toConsumableArray(parameters)) + "}) => ({\n      type: " + reducerName.toLowerCase() + "ActionType." + actionName + "_ERR,\n      error,\n      " + [].concat(_toConsumableArray(parameters)) + "\n    })\n\n    " + apiCode + "\n    ";
    fsPath.writeFile(actionCreatorPath, actionCreatorCode, function (err) {
      if (err) throw err;
      console.log('Action Generators Done...');
    });
  }
};

var addReducerFile = function addReducerFile() {
  var reducerFilePath = path.join(process.cwd(), 'Reducers', reducerName.toLowerCase() + "Reducers", 'index.js');
  if (fs.existsSync(reducerFilePath)) {
    console.log('Appending New Reducer to Reducer File...');
    fs.readFile(reducerFilePath, function (err, data) {
      if (err) throw err;

      var delimiter = data.toString().indexOf('default:');
      var moddedEntry = [data.toString().slice(0, delimiter), reducerCommon({ reducerName: reducerName, actionName: actionName }), data.toString().slice(delimiter)].join("");
      fsPath.writeFile(reducerFilePath, moddedEntry, function (err) {
        if (err) throw err;
        console.log('Reducer Generators Done...');
      });
    });
  } else {
    var reducerNewCode = "\n  import { " + reducerName.toLowerCase() + "ActionType as Actions } from '../../Actions/" + reducerName.toLowerCase() + "ActionType'  \n\n  export const " + reducerName.toLowerCase() + "Reducers = (\n    state = {},  //Some Default State Needs to be passed here\n    action\n  ) => {\n    let newState = null\n    let payload = null\n\n    switch(action.type) {\n\n  " + reducerCommon({
      reducerName: reducerName,
      actionName: actionName
    }) + "\n \n      default:\n      return state\n    }\n  }\n  ";
    fsPath.writeFile(reducerFilePath, reducerNewCode, function (err) {
      if (err) throw err;
      console.log('Reducers Create Done...');
    });
  }
};

var reducerCommon = function reducerCommon(_ref2) {
  var reducerName = _ref2.reducerName,
      actionName = _ref2.actionName;

  return "\n     case Actions." + actionName + "_REQ:\n        newState = state\n        payload = action.payload\n        // Serializer transform state -> newState\n\n        return newState\n      case Actions." + actionName + "_RES:\n        newState = state\n        payload = action.payload\n        // Serializer transform state -> newState\n\n        return newState\n \n      case Actions." + actionName + "_ERR:\n        newState = state\n        payload = action.payload\n        // Serializer transform state -> newState\n\n        return newState\n\n";
};