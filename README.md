This project is meant to serve as base for new projects that use Electron.

[TOC]

# Resources
## common/ambient
Allows to identify the ambient in which the module is currently running.
### isElectron
Type: `function() : boolean`

Returns:
* `true` if the module is running through **Electron**. 
* `false` otherwise.

### electron
Type: `string` or `object<Electron>` 

Returns:
* The **executable path** from **Electron** if the module is running through **Node.js**
* The **Electron module** caso o module esteja running via **Electron**.

## common/loggr
Utility module that allows tagging the printed messages via `console`. It allows to register the messages in a log file.
Soon, I'll release this module separately.

### loggr = new Loggr()
Constructor, no parameters.
### Level
Native object that describes a tag.
### Level.name 
Type: `string`
The name (alias) of tag.
### Level.color
Type: `string`
The message color when the message is using this tag (RGB hexadecimal).
Examples: #FF0000
### Level.defaultShown
Type: `boolean`
Indicates if the message will show on terminal.
If this value is false, the message will be only appended to log file.
It's possible to use dynamic values in place of constants `true` or `false`, for instance:
`!!process.argv.find(arg=>(/info/gi).test(arg))` returns `true` when `info` is present on the command line.
### loggr.register(Level[, Level[, Level[, ...]]])
Registers one or more tags.
Each tag will create a new function with the same name from tag.
Example:
```
loggr.register({
	name: "warn",
	color: "#FF8800",
	defaultShown: true
});
loggr.warn("Electron 1 2 3...");

/* Output example: 
[02:59:30] [warn] Electron 1 2 3...
*/
```
### loggr._name-of-tag_(msg[, msg[, msg[, ...]]])
Registers the message.
### loggr.messages
Type: `array`
Array where messages are registered
### loggr.filename
Type: `string`
Log file name.
### loggr.skipWritingFile
Type: `boolean`
If true, the messages won't be registered in the file, only in terminal.

## common/electron-logger
Utility module that creates a new global instance of `Loggr` and registers some tag types.

Default registered tags:

|  Name  |   Color  |      Shown on terminal?       |
|:------:|:--------:|:-----------------------------:|
|  error | \#cc0000 |              Yes              |
|  info  | \#cccccc |   `--info` on command line    |
|  debug | \#888888 |   `--debug` on command line   |
|   ok   | \#008800 |              Yes              |
|  fail  | \#880000 |              Yes              |
|  lessc | \#886600 |   `--debug` on command line   |
|   cli  | \#006688 |   `--debug` on command line   |

### init: function() => Loggr
instantiates a new `Loggr` and defines a global variable (`global.loggr`) for the newly-created instance.
If the global variable is already defined, then it returns the previously-created instance.

## common/electron-ipc
Utility module that allows the communication between contexts.
Example:
```
//Either inside Electron context

myIPC = new IPC("Back-end", function(from, ...msg){
	//Do something with the msg.
});

//Or inside browserWindow context

myIPC = new IPC("CLI", function(from, ...msg){
	//Do something with the msg.
});
```
Like the loggr, I pretend to release this module separately, soon.
### ipc = new IPC(ID: string[, handler: function])
Constructor.
Behind the scenes, it uses `Electron.ipcRenderer` or `Electron.ipcMain` for sending and receiving messages, depending on the context that the module is running. The context is automatically detected.

### ipc.handler
Type: `function(from, ...msgParts)`
Callback function destined to handle the messages received by the IPC.

### ipc.send
Type: `function(...msg)`
Sends a message.
* If sent through `BrowserWindow` context, sends the message to the IPC inside Electron context.
* If sent through Electron context, sends the message to all the `BrowserWindow`.

## common/electron-spawn
If the ambient is Node.js, this module is responsible for running Electron through a child process.

## common/electron-main
If the ambient is Electron, listens unhandled errors, awaits Electron readiness and initializes `electron/index.js`.

## electron/index.js
Your content. In this file, you can instantiate one or more `BrowserWindow`, register protocols, etc...
At this moment, it means that **the Electron is ready**. 
So, **do not use `Electron.app.on("ready", ...)`**.
By default, this file comes with a `BrowserWindow` already instantiated, that will load the content inside `cli/index.htm`.
## cli/index.htm
Your front-end content. By default, this is the page that will be loaded by `electron/index.js`
Includes script from `cli/index.js`.
## cli/index.js
Your front-end script. This is the code that will run in context of `BrowserWindow`.
## cli/css/
Your stylesheets. It can be either CSS or LESS or SASS or SCSS... It depends on how you coded your front-end.
## cli/img/
Your images, brand logos, etc.
# running
`node . --color=16m` or `electron . --color=16m`.

`--color=16m` is optional: this indicates 24-bit color support to **Chalk**.

If it's started from `node`, it automatically runs `electron` behind the scenes (see `common/electron-spawn`).
