import { convCamelCase } from '.'

test('Test conversion from snake_case to CamelCase', 
() => (
  expect(convCamelCase('test_case')).toBe('testCase')  
)
)
test('Test conversion from snake_case to CamelCase- Capitalize', 
() => (
  expect(convCamelCase('TEST_CASE')).toBe('testCase')  
)
)