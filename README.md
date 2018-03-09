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

That is a lot of Boiler Plate for every API Calls.

**reduxboilergenerator** provides you with a Command Line utility to generate this boiler plate so that you quickly get to the core logic.

There are 3 files and 2 folder generated.

```
--Actions
  --<actionname>Actions.js
  --<actionname>ActionType.js
--reducers
  --<actionname>Reducers
    --index.js
```

![alt text](https://im.ezgif.com/tmp/ezgif-1-58f530d898.gif)

It will generate the common boiler plate code for you and then you just fill up the rest according to your 
requirements.

Currently the boiler plate uses `jquery` and makes an `xhr` request and does not use `Fetch` or `Axios`.
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
