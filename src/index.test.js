import { convCamelCase, GetActionFilePath, GenActionFileContents, reducerFilePath, genReducerCode, CapitalizeFirst } from './utils'

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

test('Test Capitalize the First Letter', 
() => (
  expect(CapitalizeFirst('testcase')).toBe('Testcase')  
)
)
test('Test Capitalize the First Letter - II', 
() => (
  expect(CapitalizeFirst('testCase')).toBe('Testcase')  
)
)
test('Test Action File Contents---Existing File', () => (
  expect(
  GenActionFileContents({
    reducerName: 'Conference',
    actionName: 'Schedule',
    crudOperation: 'R',
    parameters: ['confId'],    
    fileContents: 'Just some old file contents'
  })
  )
  .toMatch(/method: 'GET'/)
))

test('Test Action File Contents---Existing File', () => (
  expect(
  GenActionFileContents({
    reducerName: 'Conference',
    actionName: 'Schedule',
    crudOperation: 'R',
    parameters: ['confId'],    
    fileContents: 'Just some old file contents'
  })
  )
  .toMatch(/Just some old file contents/) 
))
test('Test Action File Contents---New File', () => (
  expect(
  GenActionFileContents({
    reducerName: 'Conference',
    actionName: 'Schedule',
    crudOperation: 'R',
    parameters: ['confId'],    
  })
  ).toMatch(/import \$ from 'jquery'/)

))

test('Reducer file Path', () => (
  expect(
  reducerFilePath({
    reducerName: 'Conference',
    currentDir: process.cwd()
  })
  )
  .toMatch(/Reducers/)
))

test('Reducer file Path -- Default The Directory Path', () => (
  expect(
  reducerFilePath({
    reducerName: 'Conference',
  })
  )
  .toMatch(/Reducers/)
))

test('Test Generated Reducer code ---New File', () => (
  expect(
  genReducerCode({
    reducerName: 'Conference',
    actionName: 'Schedule'
  })
  )
  .toMatch(/default:/)
))

test('Test Generated Reducer code ---Exisiting File w delimiter as default:', () => (
  expect(
  genReducerCode({
    fileContent: `
    some file content
    default:
    `,
    reducerName: 'Conference',
    actionName: 'Schedule'
  })
  )
  .toMatch(/some file content/)
))