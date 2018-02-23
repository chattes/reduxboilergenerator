## About


If you have used Redux in your Project, you must be aware that common convention is
to have a Reducers Folder which contains all your Reducers.
You also should be having an Actions folder with atleast two file.

* Action File
* Action Type File

Usually you have to have 3 actions for any API calls

* `<ACTION>_REQ`
* `<ACTION>_RES`
* `<ACTION>_ERROR`

That is a lot of Boiler Plate that needs to be written for every API that you want to call
and get the Data.

**reduxboilergenerator** provides you with a Command Line utility to generate this and arranges
in the following file structure.

```
--Actions
  --<actionname>Actions.js
  --<actionname>ActionType.js
--reducers
  --<actionname>Reducers
  --index.js
```



It will generate the common boiler plate code for you and then you just fill up the rest according to your 
requirements.

Currently the boiler plate expects `jquery` and makes an `xhr` request and does not use `Fetch`.
Feel free to submit a pull request or raise Issues, if you see any shortcomings!

### HAPPY BOILING!!

## Example

```
$ npm install -g reduxboilergen
```

## Usage

In Command Line type the Command and follow along the Prompts

```
$ boilredux
```
