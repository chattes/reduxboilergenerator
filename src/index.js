#!/usr/bin/env node
import {  getActionTypePath,
          GenActionTypeFile, 
          GetActionFilePath, 
          GenActionFileContents,
          reducerFilePath,
          genReducerCode } from "./utils";

// Generates React Redux- Boiler Plate for API calls using jquery AJAX
const fs = require("fs")
const path = require("path")
const argv = process.argv.slice(2)
const promptly = require('promptly')
const fsPath  = require('fs-path')
const possibleActions = ['C', 'R', 'U', 'D']
const R = require('ramda')
const prettier = require('prettier')
let reducerName = null
let actionName = null
let parameters = []
let crudOp = null

const createActionTypeFile = () => {
  console.info('Creating Action Type Files...')
  if(fs.existsSync(getActionTypePath({reducerName}))){
    fs.readFile(getActionTypePath({reducerName}), 
    (err, data) => {
      if (err) throw err
      // Write the Generated File
      fsPath.writeFile(
        getActionTypePath({reducerName}),
        prettier.format(
        GenActionTypeFile({
          fileContentsRaw: data,
          actionName
        }),
        {semi: false}
        ),
        err => {
          if(err) throw err
          console.info('Generated Action type File Succesfully...')
        }
      )
   }
  )
  } else{
      fsPath.writeFile(
        getActionTypePath({reducerName}),
        prettier.format(GenActionTypeFile({actionName}),{semi: false}),
        err => {
          if(err) throw err
          console.info('Generated Action type File Succesfully...')
        }
      )
  }
}

const createActionFile = () => {
  console.info('Creating Action Files...')
   if(fs.existsSync(GetActionFilePath({reducerName, currentDir:process.cwd()}))){
    fs.readFile(GetActionFilePath({reducerName, currentDir: process.cwd()}), 
    (err, data) => {
      if (err) throw err
      // Write the Generated File
      fsPath.writeFile(
        GetActionFilePath({reducerName, currentDir:process.cwd()}),   
        prettier.format(GenActionFileContents({
          reducerName,
          actionName,
          crudOperation: crudOp,
          parameters,
          fileContents: data.toString(),
        }), {semi: false}),
        err => {
          if(err) throw err
          console.info('Generated Action File Succesfully...')
        }
      )
   }
  )
  } else{
      // Write the Generated File
      fsPath.writeFile(
        GetActionFilePath({reducerName, currentDir: process.cwd()}),   
        prettier.format(GenActionFileContents({
          reducerName,
          actionName,
          crudOperation: crudOp,
          parameters
        }), {semi: false}),
        err => {
          if(err) throw err
          console.info('Generated Action File Succesfully...')
        }
      )
  } 
}
// Write Reducer Files
const createReducerFile = () => {
  console.info('Creating Reducer Files...')
   if(fs.existsSync(reducerFilePath({reducerName, 
    currentDir: process.cwd()}))){
    fs.readFile(reducerFilePath({reducerName, currentDir: process.cwd()}), 
    (err, data) => {
      if (err) throw err
      // Write the Generated File
      fsPath.writeFile(
        reducerFilePath({reducerName, currentDir: process.cwd()}),   
        prettier.format(genReducerCode({
          fileContent: data.toString(),
          reducerName,
          actionName
        }), {semi: false}),
        err => {
          if(err) throw err
          console.info('Generated Reducer File Succesfully...')
        }
      )
   }
  )
  } else{
      // Write the Generated File
      fsPath.writeFile(
        reducerFilePath({reducerName, currentDir: process.cwd()}),   
        prettier.format(genReducerCode({
          reducerName,
          actionName
        }), {semi: false}),
        err => {
          if(err) throw err
          console.info('Generated Reducer File Succesfully...')
        }
             
      )
  } 
}

promptly.prompt('Reducer For?(Enter The Top level Component):', {
  default: 'MyAppReducer'
})
.then(value => {
  reducerName = value.toLowerCase()
  promptly.prompt('Action Name: ')
  .then( action => {
    actionName = action.toUpperCase()
    promptly.prompt('Additonal Parameters for Action(Comma separated values):')
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
  createActionTypeFile()
  createActionFile()
  createReducerFile()
}

