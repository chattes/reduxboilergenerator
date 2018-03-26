'use strict';

var _utils = require('./utils');

test('Test conversion from snake_case to CamelCase', function () {
  return expect((0, _utils.convCamelCase)('test_case')).toBe('testCase');
});
test('Test conversion from snake_case to CamelCase- Capitalize', function () {
  return expect((0, _utils.convCamelCase)('TEST_CASE')).toBe('testCase');
});

test('Test Capitalize the First Letter', function () {
  return expect((0, _utils.CapitalizeFirst)('testcase')).toBe('Testcase');
});
test('Test Capitalize the First Letter - II', function () {
  return expect((0, _utils.CapitalizeFirst)('testCase')).toBe('Testcase');
});
test('Test Action File Contents---Existing File', function () {
  return expect((0, _utils.GenActionFileContents)({
    reducerName: 'Conference',
    actionName: 'Schedule',
    crudOperation: 'R',
    parameters: ['confId'],
    fileContents: 'Just some old file contents'
  })).toMatch(/method: 'GET'/);
});

test('Test Action File Contents---Existing File', function () {
  return expect((0, _utils.GenActionFileContents)({
    reducerName: 'Conference',
    actionName: 'Schedule',
    crudOperation: 'R',
    parameters: ['confId'],
    fileContents: 'Just some old file contents'
  })).toMatch(/Just some old file contents/);
});
test('Test Action File Contents---New File', function () {
  return expect((0, _utils.GenActionFileContents)({
    reducerName: 'Conference',
    actionName: 'Schedule',
    crudOperation: 'R',
    parameters: ['confId']
  })).toMatch(/import \$ from 'jquery'/);
});

test('Reducer file Path', function () {
  return expect((0, _utils.reducerFilePath)({
    reducerName: 'Conference',
    currentDir: process.cwd()
  })).toMatch(/Reducers/);
});

test('Reducer file Path -- Default The Directory Path', function () {
  return expect((0, _utils.reducerFilePath)({
    reducerName: 'Conference'
  })).toMatch(/Reducers/);
});

test('Test Generated Reducer code ---New File', function () {
  return expect((0, _utils.genReducerCode)({
    reducerName: 'Conference',
    actionName: 'Schedule'
  })).toMatch(/default:/);
});

test('Test Generated Reducer code ---Exisiting File w delimiter as default:', function () {
  return expect((0, _utils.genReducerCode)({
    fileContent: '\n    some file content\n    default:\n    ',
    reducerName: 'Conference',
    actionName: 'Schedule'
  })).toMatch(/some file content/);
});