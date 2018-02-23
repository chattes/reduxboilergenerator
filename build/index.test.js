'use strict';

var _ = require('.');

test('Test conversion from snake_case to CamelCase', function () {
  return expect((0, _.convCamelCase)('test_case')).toBe('testCase');
});
test('Test conversion from snake_case to CamelCase- Capitalize', function () {
  return expect((0, _.convCamelCase)('TEST_CASE')).toBe('testCase');
});