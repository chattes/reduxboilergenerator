import { appendFile } from "fs";

const fs = require("fs")
const path = require("path")
const fsPath  = require('fs-path')
const R = require('ramda')
// Captitalize First Letter
export const CapitalizeFirst = word => (
       word.
       slice(0,1).
      toUpperCase().
      concat(
        word.slice(1).toLowerCase()
      )
  
)
// Utility - Convert Under_Score to camelCase
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

// Get ActionType File Path
export const getActionTypePath = ({reducerName}) => (
  path.join(
    process.cwd(),
    'Actions',
    `${CapitalizeFirst(reducerName)}ActionType.js`
  ) 
)

// Return Action -Type File Contents String, String -> String

export const GenActionTypeFile = ({fileContentsRaw = null, actionName}) => {
 let actionTypeFileContents = null
 const newActionEntry = `\n
    ${actionName}_REQ : '${actionName}_REQ',
    ${actionName}_RES : '${actionName}_RES',
    ${actionName}_ERR : '${actionName}_ERR',
  ` 
  if(fileContentsRaw){
  let fileContents = fileContentsRaw.toString()
  let closingBrace = fileContents.indexOf('}')
   actionTypeFileContents = [
    `${fileContents.slice(0, closingBrace)},`,
    newActionEntry,
    fileContents.slice(closingBrace)
  ].join("")
  } else {
    actionTypeFileContents = `
    export const ${actionName.toLowerCase()}ActionTypes = {
    ${newActionEntry}
    }
    `
  }
  return actionTypeFileContents 
}

// Redux Action File Path Object -> String

export const GetActionFilePath = ({ reducerName, 
                                    currentDir = process.cwd() }) => (
  path.join(
  currentDir,
  'Actions',
  `${CapitalizeFirst(reducerName)}Actions.js`
)
)

// Action File Contents Object -> String

export const GenActionFileContents = ({
      reducerName,
      actionName,
      crudOperation,
      parameters,
      fileContents = null
}) => {

  let actionNameL = actionName.toLowerCase()
  let headerCode = `
  import $ from 'jquery'
  import { ${CapitalizeFirst(reducerName)}ActionType } from './${CapitalizeFirst(reducerName)}ActionType'
  
  
  const TIMEOUT = 5000
  `
  let actionCode = `
  export const ${actionNameL }Req = ({${[...parameters]}}) => ({
    type: ${reducerName.toLowerCase()}ActionType.${actionName}_REQ,
    ${[...parameters]}
  })
  export const ${actionNameL }Res = ({payload, ${[...parameters]}}) => ({
    type: ${reducerName.toLowerCase()}ActionType.${actionName}_RES,
    payload,
    ${[...parameters]}
  })
  export const ${actionNameL }Err = ({error, ${[...parameters]}}) => ({
    type: ${reducerName.toLowerCase()}ActionType.${actionName}_ERR,
    error,
    ${[...parameters]}
  })  
  `
  let apiCode = ``
  switch(crudOperation){
    case 'C':
    apiCode = `
    //API Call for ${actionNameL}
    export const ${actionNameL}API = ({
      authKey,
      isAuthenticated,
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
      isAuthenticated,
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
      isAuthenticated,
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
      isAuthenticated,
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

  let newCode = fileContents ? (
    `
   ${fileContents}
   ${actionCode}
   ${apiCode}
    `
  ) : (
    
    `
   ${headerCode}
   ${actionCode}
   ${apiCode}
    `
  )

return newCode

}

export const reducerFilePath = 
({reducerName, currentDir = process.cwd()}) => (
  path.join(
    currentDir,
    'Reducers',
    `${CapitalizeFirst(reducerName)}Reducers`,
    'index.js'
  )  
)

export const genReducerCode = ({
fileContent = null,
reducerName,
actionName,

}) => {

let reducerCode = null

if(fileContent !== null ){
  let delimiter = fileContent.indexOf('default:')
  reducerCode = [
    fileContent.slice(0, delimiter),
    reducerCommonCode({reducerName, actionName}),
    fileContent.slice(delimiter)
  ].join("")

} else {
  reducerCode = `
  import { ${CapitalizeFirst(reducerName)}ActionType as Actions } from '../../Actions/${CapitalizeFirst(reducerName)}ActionType'  
  
    export const ${reducerName.toLowerCase()}Reducers = (
      state = {},  //Some Default State Needs to be passed here
      action
    ) => {
      let newState = null
      let payload = null
  
      switch(action.type) {
  
    ${reducerCommonCode({
      reducerName,
      actionName
    })}
   
        default:
        return state
      }
    }
     
  `

}

return reducerCode

}

export const reducerCommonCode = ({ reducerName, actionName }) => {

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
