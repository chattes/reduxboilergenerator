#!/usr/bin/env node
// Generates React Redux- Boiler Plate for API calls using jquery AJAX
const fs = require("fs")
const path = require("path")
const argv = process.argv.slice(2)
const promptly = require('promptly')
const fsPath  = require('fs-path')
const possibleActions = ['C', 'R', 'U', 'D']
const R = require('ramda')
let reducerName = null
let actionName = null
let parameters = []
let crudOp = null


promptly.prompt('Reducer For?(Enter The Top level Component):', {
  default: 'AppReducer'
})
.then(value => {
  reducerName = value.toLowerCase()
  promptly.prompt('Action Name: ')
  .then( action => {
    actionName = action.toUpperCase()
    promptly.prompt('Parameters for Action(Comma separated values):')
    .then(values => {
      parameters = values.split(',').map(value => value.trim())
      promptly.prompt('CRUD action(Enter C, R, U or D):')
      .then(value => {
       crudOp = value.toUpperCase()
       if(possibleActions.findIndex((action) => action == value) < 0){
         throw 'Invalid Action Supplied'
       }
       StartBoiler()        
      })
    }

  )
  })

})

const StartBoiler = () => {

  ProcessReducer({
    actionName,
    reducerName
  })

}

const ProcessReducer = ({
  actionName,
  reducerName
}) => {

  // Adds Action files and Directory Structure
 console.log('Start...')
 let actionTypeReq = `${actionName}_REQ`
 let actionTypeRes = `${actionName}_RES`
 let actionTypeErr = `${actionName}_ERR`
 let actionTypePath = path.join(
   process.cwd(),
   'Actions',
   `${reducerName.toLowerCase()}ActionType.js`
 ) 
 if(fs.existsSync(actionTypePath)){
   fs.readFile(actionTypePath, (err, data) => {
     addActionTypeFile(err, data, actionTypePath)
     AddActionFile()
   }
    )
 } else{
   const actionTypeCode = 
   `export const ${reducerName.toLowerCase()}ActionType = {
    ${actionTypeReq} : '${actionTypeReq}',
    ${actionTypeRes} : '${actionTypeRes}',
    ${actionTypeErr} : '${actionTypeErr}',
   }
     `
   fsPath.writeFile(actionTypePath, actionTypeCode, err => {
     if(err) throw err
     console.log('Done Action Types Generation...')
     AddActionFile()
   })
 }

  // Adds Reducer files and Directory Structure
 addReducerFile()

}

const addActionTypeFile = (err, data, path) => {
  if(err) throw err
  let fileContents = data.toString()
  let closingBrace = fileContents.indexOf('}')
  const newActionEntry = `\n
  ${actionName}_REQ : '${actionName}_REQ',
  ${actionName}_RES : '${actionName}_RES',
  ${actionName}_ERR : '${actionName}_ERR',
  ` 
  let mod = [
    fileContents.slice(0, closingBrace),
    newActionEntry,
    fileContents.slice(closingBrace)
  ].join("")

    fs.writeFile(path, mod, err => {
      if (err) throw err
      console.log("done Action Types...")
    })
}
// Utility - Convert Under_score to camelCase
export const convCamelCase = actionName => {
  return actionName
    .split("_")
    .map(function(word, index) {
      // If it is the first word make sure to lowercase all the chars.
      if (index == 0) {
        return word.toLowerCase()
      }
      // If it not the first word only upper case the first char and lowercase the parameters.
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join("")
}

const AddActionFile = () => {
  let actionCreatorPath = path.join(
    process.cwd(),
    'Actions',
    `${reducerName.toLowerCase()}Actions.js`
  )
  console.log('Add Action Creators...')
  
    let apiCode = ``
    let actionNameL = actionName.toLowerCase()
    switch(crudOp){
      case 'C':
      apiCode = `
      //API Call for ${actionNameL}
      export const ${actionNameL}API = ({
        authKey,
        isAuthenticated
        link,
        ${[...parameters]},
        createData}) => (dispatch, getState) => {
        let state = getState()
        if (isAuthenticated) {
          dispatch(${actionNameL}Req({${[...parameters]}}))
          //FILL ACTUAL DATA ---HERE!!!!
          let data = null
          //FILL API DATA******
          return $.ajax({
            method: 'POST',
            url: link,
            headers: {
              Authorization: authKey 
            },
            data: data,
            // processData: false,
            // contentType: false,
            // crossDomain: true,
            // mimeType: 'multipart/form-data',
            success: payload => dispatch(${actionNameL}Res({payload,${[...parameters]}})),
            error: (error) => dispatch(${actionNameL}Err({error,${[...parameters]}})),
            timeout: TIMEOUT
          })
        } else {
          return this
        }
      }      
      `
      break
      case 'R':
      apiCode = `
      //API Call for ${actionNameL} --READ
      export const ${actionNameL}API = ({
        authKey,
        isAuthenticated
        link,
        ${[...parameters]}}) => (dispatch, getState) => {
        dispatch(fetchToken(storage))
        let state = getState()
        if (isAuthenticated) {
          dispatch(${actionNameL}Req({${[...parameters]}}))
          return $.ajax({
            method: 'GET',
            url: link,
            headers: {
              Authorization: authKey 
            },
            success: payload => dispatch(${actionNameL}Res({payload,${[...parameters]}})),
            error: (error) => dispatch(${actionNameL}Err({error,${[...parameters]}})),
            timeout: TIMEOUT
          })
        } else {
          return this
        }
      }
        
      `      
      break
      case 'U':
      apiCode = `
      //API Call for ${actionNameL}
      export const ${actionNameL}API = ({
        authKey,
        isAuthenticated
        link,
        ${[...parameters]},
        updateData}) => (dispatch, getState) => {
        dispatch(fetchToken(storage))
        let state = getState()
        if (isAuthenticated) {
          dispatch(${actionNameL}Req({${[...parameters]}}))
          let data = null
          //FILL API DATA******
          return $.ajax({
            method: 'PUT',
            url: link,
            headers: {
              Authorization: authKey 
            },
            data: data,
            // processData: false,
            // contentType: false,
            // crossDomain: true,
            // mimeType: 'multipart/form-data',
            success: payload => dispatch(${actionNameL}Res({payload,${[...parameters]}})),
            error: (error) => dispatch(${actionNameL}Err({error,${[...parameters]}})),
            timeout: TIMEOUT
          })
        } else {
          return this
        }
      }
         
      `
      break
      case 'D':
      apiCode = `
      //API Call for ${actionNameL}
      export const ${actionNameL}API = ({
        authKey,
        isAuthenticated
        link,
        ${[...parameters]}
        }) => (dispatch, getState) => {
        dispatch(fetchToken(storage))
        let state = getState()
        if (isAuthenticated) {
          dispatch(${actionNameL}Req({payload:{},${[...parameters]}}))
          return $.ajax({
            method: 'DELETE',
            url: link,
            headers: {
              Authorization: authKey 
            },
           success: payload => dispatch(${actionNameL}Res({payload,${[...parameters]}})),
           error: (error) => dispatch(${actionNameL}Err({error})),
           timeout: TIMEOUT
          })
        } else {
          return this
        }
      }
      `
      break
      default:
      apiCode = ``

    }
    const actionNameCC = convCamelCase(actionName)
   if(fs.existsSync(actionCreatorPath)){
     console.log('Append to file Action...')
     
    fs.readFile(actionCreatorPath, (err, data) => {
      if(err) throw err
      let content = data.toString()
      const actionCreatorCodeExists = `
    export const ${actionNameCC}Req = ({${[...parameters]}}) => ({
      type: ${reducerName.toLowerCase()}ActionType.${actionName}_REQ,
      ${[...parameters]}
    })
    export const ${actionNameCC}Res = ({payload, ${[...parameters]}}) => ({
      type: ${reducerName.toLowerCase()}ActionType.${actionName}_RES,
      payload,
      ${[...parameters]}
    })
    export const ${actionNameCC}Err = ({error, ${[...parameters]}}) => ({
      type: ${reducerName.toLowerCase()}ActionType.${actionName}_ERR,
      error,
      ${[...parameters]}
    })

    ${apiCode}      
    `
    let newCode = `
    ${content}
// Action Creators for ${actionName}
    ${actionCreatorCodeExists}
    `
    fs.writeFile(actionCreatorPath, newCode, err => {
      if (err) throw err
      console.log("done Action Creator...")
    })

    })
   
  } else{
   const actionCreatorCode = `
    import $ from 'jquery'
    import { ${reducerName.toLowerCase()}ActionType } from './${reducerName.toLowerCase()}ActionType'

    export const ${actionNameCC}Req = ({${[...parameters]}}) => ({
      type: ${reducerName.toLowerCase()}ActionType.${actionName}_REQ,
      ${[...parameters]}
    })
    export const ${actionNameCC}Res = ({payload, ${[...parameters]}}) => ({
      type: ${reducerName.toLowerCase()}ActionType.${actionName}_RES,
      payload,
      ${[...parameters]}
    })
    export const ${actionNameCC}Err = ({error, ${[...parameters]}}) => ({
      type: ${reducerName.toLowerCase()}ActionType.${actionName}_ERR,
      error,
      ${[...parameters]}
    })

    ${apiCode}
    `
    fsPath.writeFile(actionCreatorPath, actionCreatorCode,err => { 
      if(err) throw err
      console.log('Action Generators Done...')
    } )
  } 

}

const addReducerFile = () => {
const reducerFilePath = path.join(
  process.cwd(),
  'Reducers',
  `${reducerName.toLowerCase()}Reducers`,
  'index.js'
)
if(fs.existsSync(reducerFilePath)){
  console.log('Appending New Reducer to Reducer File...')
  fs.readFile(reducerFilePath, (err, data) => {
    if(err) throw err

   let delimiter = data.toString().indexOf('default:')
   let moddedEntry = [
     data.toString().slice(0, delimiter),
     reducerCommon({reducerName, actionName}),
     data.toString().slice(delimiter)
   ].join("")
   fsPath.writeFile(reducerFilePath, moddedEntry,err => { 
      if(err) throw err
      console.log('Reducer Generators Done...')
    })    
  })  
} 
else {
  const reducerNewCode = `
  import { ${reducerName.toLowerCase()}ActionType as Actions } from '../../Actions/${reducerName.toLowerCase()}ActionType'  

  export const ${reducerName.toLowerCase()}Reducers = (
    state = {},  //Some Default State Needs to be passed here
    action
  ) => {
    let newState = null
    let payload = null

    switch(action.type) {

  ${reducerCommon({
    reducerName,
    actionName
  })}
 
      default:
      return state
    }
  }
  `
  fsPath.writeFile(reducerFilePath, reducerNewCode,err => { 
    if(err) throw err
    console.log('Reducers Create Done...')
  }
)  
}
}

const reducerCommon = ({reducerName, actionName}) => {
return `
     case Actions.${actionName}_REQ:
        newState = state
        payload = action.payload
        // Serializer transform state -> newState

        return newState
      case Actions.${actionName}_RES:
        newState = state
        payload = action.payload
        // Serializer transform state -> newState

        return newState
 
      case Actions.${actionName}_ERR:
        newState = state
        payload = action.payload
        // Serializer transform state -> newState

        return newState

`
} 