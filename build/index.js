#!/usr/bin/env node
"use strict";

var _utils = require("./utils");

// Generates React Redux- Boiler Plate for API calls using jquery AJAX
var fs = require("fs");
var path = require("path");
var argv = process.argv.slice(2);
var promptly = require('promptly');
var fsPath = require('fs-path');
var possibleActions = ['C', 'R', 'U', 'D'];
var R = require('ramda');
var prettier = require('prettier');
var reducerName = null;
var actionName = null;
var parameters = [];
var crudOp = null;

var createActionTypeFile = function createActionTypeFile() {
  console.info('Creating Action Type Files...');
  if (fs.existsSync((0, _utils.getActionTypePath)({ reducerName: reducerName }))) {
    fs.readFile((0, _utils.getActionTypePath)({ reducerName: reducerName }), function (err, data) {
      if (err) throw err;
      // Write the Generated File
      fsPath.writeFile((0, _utils.getActionTypePath)({ reducerName: reducerName }), prettier.format((0, _utils.GenActionTypeFile)({
        fileContentsRaw: data,
        actionName: actionName
      }), { semi: false }), function (err) {
        if (err) throw err;
        console.info('Generated Action type File Succesfully...');
      });
    });
  } else {
    fsPath.writeFile((0, _utils.getActionTypePath)({ reducerName: reducerName }), prettier.format((0, _utils.GenActionTypeFile)({ actionName: actionName }), { semi: false }), function (err) {
      if (err) throw err;
      console.info('Generated Action type File Succesfully...');
    });
  }
};

var createActionFile = function createActionFile() {
  console.info('Creating Action Files...');
  if (fs.existsSync((0, _utils.GetActionFilePath)({ reducerName: reducerName, currentDir: process.cwd() }))) {
    fs.readFile((0, _utils.GetActionFilePath)({ reducerName: reducerName, currentDir: process.cwd() }), function (err, data) {
      if (err) throw err;
      // Write the Generated File
      fsPath.writeFile((0, _utils.GetActionFilePath)({ reducerName: reducerName, currentDir: process.cwd() }), prettier.format((0, _utils.GenActionFileContents)({
        reducerName: reducerName,
        actionName: actionName,
        crudOperation: crudOp,
        parameters: parameters,
        fileContents: data.toString()
      }), { semi: false }), function (err) {
        if (err) throw err;
        console.info('Generated Action File Succesfully...');
      });
    });
  } else {
    // Write the Generated File
    fsPath.writeFile((0, _utils.GetActionFilePath)({ reducerName: reducerName, currentDir: process.cwd() }), prettier.format((0, _utils.GenActionFileContents)({
      reducerName: reducerName,
      actionName: actionName,
      crudOperation: crudOp,
      parameters: parameters
    }), { semi: false }), function (err) {
      if (err) throw err;
      console.info('Generated Action File Succesfully...');
    });
  }
};
// Write Reducer Files
var createReducerFile = function createReducerFile() {
  console.info('Creating Reducer Files...');
  if (fs.existsSync((0, _utils.reducerFilePath)({ reducerName: reducerName,
    currentDir: process.cwd() }))) {
    fs.readFile((0, _utils.reducerFilePath)({ reducerName: reducerName, currentDir: process.cwd() }), function (err, data) {
      if (err) throw err;
      // Write the Generated File
      fsPath.writeFile((0, _utils.reducerFilePath)({ reducerName: reducerName, currentDir: process.cwd() }), prettier.format((0, _utils.genReducerCode)({
        fileContent: data.toString(),
        reducerName: reducerName,
        actionName: actionName
      }), { semi: false }), function (err) {
        if (err) throw err;
        console.info('Generated Reducer File Succesfully...');
      });
    });
  } else {
    // Write the Generated File
    fsPath.writeFile((0, _utils.reducerFilePath)({ reducerName: reducerName, currentDir: process.cwd() }), prettier.format((0, _utils.genReducerCode)({
      reducerName: reducerName,
      actionName: actionName
    }), { semi: false }), function (err) {
      if (err) throw err;
      console.info('Generated Reducer File Succesfully...');
    });
  }
};

promptly.prompt('Reducer For?(Enter The Top level Component):', {
  default: 'MyAppReducer'
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
  createActionTypeFile();
  createActionFile();
  createReducerFile();
};