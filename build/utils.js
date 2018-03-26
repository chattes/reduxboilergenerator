"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducerCommonCode = exports.genReducerCode = exports.reducerFilePath = exports.GenActionFileContents = exports.GetActionFilePath = exports.GenActionTypeFile = exports.getActionTypePath = exports.convCamelCase = exports.CapitalizeFirst = undefined;

var _fs = require("fs");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fs = require("fs");
var path = require("path");
var fsPath = require('fs-path');
var R = require('ramda');
// Captitalize First Letter
var CapitalizeFirst = exports.CapitalizeFirst = function CapitalizeFirst(word) {
  return word.slice(0, 1).toUpperCase().concat(word.slice(1).toLowerCase());
};
// Utility - Convert Under_Score to camelCase
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

// Get ActionType File Path
var getActionTypePath = exports.getActionTypePath = function getActionTypePath(_ref) {
  var reducerName = _ref.reducerName;
  return path.join(process.cwd(), 'Actions', CapitalizeFirst(reducerName) + "ActionType.js");
};

// Return Action -Type File Contents String, String -> String

var GenActionTypeFile = exports.GenActionTypeFile = function GenActionTypeFile(_ref2) {
  var _ref2$fileContentsRaw = _ref2.fileContentsRaw,
      fileContentsRaw = _ref2$fileContentsRaw === undefined ? null : _ref2$fileContentsRaw,
      actionName = _ref2.actionName;

  var actionTypeFileContents = null;
  var newActionEntry = "\n\n    " + actionName + "_REQ : '" + actionName + "_REQ',\n    " + actionName + "_RES : '" + actionName + "_RES',\n    " + actionName + "_ERR : '" + actionName + "_ERR',\n  ";
  if (fileContentsRaw) {
    var fileContents = fileContentsRaw.toString();
    var closingBrace = fileContents.indexOf('}');
    actionTypeFileContents = [fileContents.slice(0, closingBrace) + ",", newActionEntry, fileContents.slice(closingBrace)].join("");
  } else {
    actionTypeFileContents = "\n    export const " + actionName.toLowerCase() + "ActionTypes = {\n    " + newActionEntry + "\n    }\n    ";
  }
  return actionTypeFileContents;
};

// Redux Action File Path Object -> String

var GetActionFilePath = exports.GetActionFilePath = function GetActionFilePath(_ref3) {
  var reducerName = _ref3.reducerName,
      _ref3$currentDir = _ref3.currentDir,
      currentDir = _ref3$currentDir === undefined ? process.cwd() : _ref3$currentDir;
  return path.join(currentDir, 'Actions', CapitalizeFirst(reducerName) + "Actions.js");
};

// Action File Contents Object -> String

var GenActionFileContents = exports.GenActionFileContents = function GenActionFileContents(_ref4) {
  var reducerName = _ref4.reducerName,
      actionName = _ref4.actionName,
      crudOperation = _ref4.crudOperation,
      parameters = _ref4.parameters,
      _ref4$fileContents = _ref4.fileContents,
      fileContents = _ref4$fileContents === undefined ? null : _ref4$fileContents;


  var actionNameL = actionName.toLowerCase();
  var headerCode = "\n  import $ from 'jquery'\n  import { " + CapitalizeFirst(reducerName) + "ActionType } from './" + CapitalizeFirst(reducerName) + "ActionType'\n  \n  \n  const TIMEOUT = 5000\n  ";
  var actionCode = "\n  export const " + actionNameL + "Req = ({" + [].concat(_toConsumableArray(parameters)) + "}) => ({\n    type: " + reducerName.toLowerCase() + "ActionType." + actionName + "_REQ,\n    " + [].concat(_toConsumableArray(parameters)) + "\n  })\n  export const " + actionNameL + "Res = ({payload, " + [].concat(_toConsumableArray(parameters)) + "}) => ({\n    type: " + reducerName.toLowerCase() + "ActionType." + actionName + "_RES,\n    payload,\n    " + [].concat(_toConsumableArray(parameters)) + "\n  })\n  export const " + actionNameL + "Err = ({error, " + [].concat(_toConsumableArray(parameters)) + "}) => ({\n    type: " + reducerName.toLowerCase() + "ActionType." + actionName + "_ERR,\n    error,\n    " + [].concat(_toConsumableArray(parameters)) + "\n  })  \n  ";
  var apiCode = "";
  switch (crudOperation) {
    case 'C':
      apiCode = "\n    //API Call for " + actionNameL + "\n    export const " + actionNameL + "API = ({\n      authKey,\n      isAuthenticated,\n      link,\n      " + [].concat(_toConsumableArray(parameters)) + ",\n      createData}) => (dispatch, getState) => {\n      let state = getState()\n      if (isAuthenticated) {\n        dispatch(" + actionNameL + "Req({" + [].concat(_toConsumableArray(parameters)) + "}))\n        //FILL ACTUAL DATA ---HERE!!!!\n        let data = null\n        //FILL API DATA******\n        return $.ajax({\n          method: 'POST',\n          url: link,\n          headers: {\n            Authorization: authKey \n          },\n          data: data,\n          // processData: false,\n          // contentType: false,\n          // crossDomain: true,\n          // mimeType: 'multipart/form-data',\n          success: payload => dispatch(" + actionNameL + "Res({payload," + [].concat(_toConsumableArray(parameters)) + "})),\n          error: (error) => dispatch(" + actionNameL + "Err({error," + [].concat(_toConsumableArray(parameters)) + "})),\n          timeout: TIMEOUT\n        })\n      } else {\n        return this\n      }\n    }      \n    ";
      break;
    case 'R':
      apiCode = "\n    //API Call for " + actionNameL + " --READ\n    export const " + actionNameL + "API = ({\n      authKey,\n      isAuthenticated,\n      link,\n      " + [].concat(_toConsumableArray(parameters)) + "}) => (dispatch, getState) => {\n      dispatch(fetchToken(storage))\n      let state = getState()\n      if (isAuthenticated) {\n        dispatch(" + actionNameL + "Req({" + [].concat(_toConsumableArray(parameters)) + "}))\n        return $.ajax({\n          method: 'GET',\n          url: link,\n          headers: {\n            Authorization: authKey \n          },\n          success: payload => dispatch(" + actionNameL + "Res({payload," + [].concat(_toConsumableArray(parameters)) + "})),\n          error: (error) => dispatch(" + actionNameL + "Err({error," + [].concat(_toConsumableArray(parameters)) + "})),\n          timeout: TIMEOUT\n        })\n      } else {\n        return this\n      }\n    }\n      \n    ";
      break;
    case 'U':
      apiCode = "\n    //API Call for " + actionNameL + "\n    export const " + actionNameL + "API = ({\n      authKey,\n      isAuthenticated,\n      link,\n      " + [].concat(_toConsumableArray(parameters)) + ",\n      updateData}) => (dispatch, getState) => {\n      dispatch(fetchToken(storage))\n      let state = getState()\n      if (isAuthenticated) {\n        dispatch(" + actionNameL + "Req({" + [].concat(_toConsumableArray(parameters)) + "}))\n        let data = null\n        //FILL API DATA******\n        return $.ajax({\n          method: 'PUT',\n          url: link,\n          headers: {\n            Authorization: authKey \n          },\n          data: data,\n          // processData: false,\n          // contentType: false,\n          // crossDomain: true,\n          // mimeType: 'multipart/form-data',\n          success: payload => dispatch(" + actionNameL + "Res({payload," + [].concat(_toConsumableArray(parameters)) + "})),\n          error: (error) => dispatch(" + actionNameL + "Err({error," + [].concat(_toConsumableArray(parameters)) + "})),\n          timeout: TIMEOUT\n        })\n      } else {\n        return this\n      }\n    }\n       \n    ";
      break;
    case 'D':
      apiCode = "\n    //API Call for " + actionNameL + "\n    export const " + actionNameL + "API = ({\n      authKey,\n      isAuthenticated,\n      link,\n      " + [].concat(_toConsumableArray(parameters)) + "\n      }) => (dispatch, getState) => {\n      dispatch(fetchToken(storage))\n      let state = getState()\n      if (isAuthenticated) {\n        dispatch(" + actionNameL + "Req({payload:{}," + [].concat(_toConsumableArray(parameters)) + "}))\n        return $.ajax({\n          method: 'DELETE',\n          url: link,\n          headers: {\n            Authorization: authKey \n          },\n         success: payload => dispatch(" + actionNameL + "Res({payload," + [].concat(_toConsumableArray(parameters)) + "})),\n         error: (error) => dispatch(" + actionNameL + "Err({error})),\n         timeout: TIMEOUT\n        })\n      } else {\n        return this\n      }\n    }\n    ";
      break;
    default:
      apiCode = "";
  }

  var newCode = fileContents ? "\n   " + fileContents + "\n   " + actionCode + "\n   " + apiCode + "\n    " : "\n   " + headerCode + "\n   " + actionCode + "\n   " + apiCode + "\n    ";

  return newCode;
};

var reducerFilePath = exports.reducerFilePath = function reducerFilePath(_ref5) {
  var reducerName = _ref5.reducerName,
      _ref5$currentDir = _ref5.currentDir,
      currentDir = _ref5$currentDir === undefined ? process.cwd() : _ref5$currentDir;
  return path.join(currentDir, 'Reducers', CapitalizeFirst(reducerName) + "Reducers", 'index.js');
};

var genReducerCode = exports.genReducerCode = function genReducerCode(_ref6) {
  var _ref6$fileContent = _ref6.fileContent,
      fileContent = _ref6$fileContent === undefined ? null : _ref6$fileContent,
      reducerName = _ref6.reducerName,
      actionName = _ref6.actionName;


  var reducerCode = null;

  if (fileContent !== null) {
    var delimiter = fileContent.indexOf('default:');
    reducerCode = [fileContent.slice(0, delimiter), reducerCommonCode({ reducerName: reducerName, actionName: actionName }), fileContent.slice(delimiter)].join("");
  } else {
    reducerCode = "\n  import { " + CapitalizeFirst(reducerName) + "ActionType as Actions } from '../../Actions/" + CapitalizeFirst(reducerName) + "ActionType'  \n  \n    export const " + reducerName.toLowerCase() + "Reducers = (\n      state = {},  //Some Default State Needs to be passed here\n      action\n    ) => {\n      let newState = null\n      let payload = null\n  \n      switch(action.type) {\n  \n    " + reducerCommonCode({
      reducerName: reducerName,
      actionName: actionName
    }) + "\n   \n        default:\n        return state\n      }\n    }\n     \n  ";
  }

  return reducerCode;
};

var reducerCommonCode = exports.reducerCommonCode = function reducerCommonCode(_ref7) {
  var reducerName = _ref7.reducerName,
      actionName = _ref7.actionName;


  return "\n  case Actions." + actionName + "_REQ:\n  newState = state\n  payload = action.payload\n  // Serializer transform state -> newState\n\n  return newState\ncase Actions." + actionName + "_RES:\n  newState = state\n  payload = action.payload\n  // Serializer transform state -> newState\n\n  return newState\n\ncase Actions." + actionName + "_ERR:\n  newState = state\n  payload = action.payload\n  // Serializer transform state -> newState\n\n  return newState\n  ";
};