JHOVE2020
=========

Getting Started
---------------
JHOVE 2020 is an [Electron](https://www.electronjs.org/) application.

### Pre-requisites
You'll need the following for developing Electron apps:

 - [NodeJS as a JavaScript runtime](https://nodejs.org/) v12.14.1-LTS; and
 - [Node Package Manager (NPM)](https://www.npmjs.com/).

### Development environment
Electron, Node and their dependencies can make for a complicated stack. To avoid
contaminating a development environment it's best to use [Node virtual environments]
(https://github.com/ekalinin/nodeenv). This is a Python utility that can create
a discrete Node environment with it's own installation directories and shared
libraries. While NodeEnv can be installed globally using Python's `pip` package
manager it can also be installed in a Python virtual environment. This means
running a Node virtual environment within a Python virtual environment but avoids
unnecessary local installations.

You'll need:

 - [Python](https://www.python.org/) (2.6+ or 3.3+)
 - [Virtualenv](https://virtualenv.pypa.io/en/latest/) for Python virtual environments

A virtual development environment can then be set up, e.g. fi:
```shell
$ virtualenv .venv
$ source .venv/bin/activate
(.venv) $ pip install nodeenv
(.venv) $ nodeenv --version
1.3.4
```

#### NodeEnv
To get a list of available node.js versions:
```shell
(.venv) $ nodeenv --list
```

To install and activate a node.js 12.14.1-LTS environment:
```shell
(.venv) $ npmnodeenv --node=12.4.1 .node-12.4
(.venv) $ source .node-12.4/bin/activate
(.node-12.4) (.venv) $ node --version
v12.14.1
(.node-12.4) (.venv) $ npm --version
6.13.4
```

#### Installing node dependencies
From the project root directory type `npm install`.
