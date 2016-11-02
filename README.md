# pult

`pult` is Concatapult's command-line interface to help you generate solid project boilerplates that are composed of the pieces you choose.

### Requirements

- `git`
- `node >= v6.2.0`
- `yarn ^0.15.1` – install / update with `npm install -g yarn`


## Usage

```bash
$ npm install -g pult-cli
$ pult new my-project
$ cd my-project
$ pult add react
$ pult add ... # See "Modules" section
```

See the "Modules" section for all the different tech you can automatically add to your app.


## Philosophy

Concatapult may not be for everyone. Read the phisilophical points below to see if this project generator fits your use case.

### Minimal

Concatapult should not generate a "batteries included" project. In other words, it will not generate everything you need to launch an application. Instead, Concatapult aims to take care of the boring parts of starting an app.

Once a project is generated, there should not be too much code to wade through. Instead, there should be a minimum amount of code that is easily to edit and extend.

### Low Dependencies

Concatapult chooses to use and compose small modules with as few dependencies as possible.

### Simple

The generated code should be a simple as possible. Complexity should be app-specific requirements, not a requirement of the generated project.

### No Server File Transpiling

You should not need to transpile ES6 just to rune node.js code.

To be clear, transpiling client code is good and encouraged.

### Portable

`pult` should work cross-platform. Any generated code should work on *nix, OS X, and [Windows Bash](https://msdn.microsoft.com/en-us/commandline/wsl/about). If an incompatibility sneaks its way into the project, open an issue and we can resolve it together.

### Opinionated

The code structure that Concatapult generates is opinionated without apology. With that said, we are always seeking the best solution, so if you have a suggestion for improvement, please create an issue and we'll happily discuss.

### Further Reading

- [Don't over-engineer](https://medium.com/@rdsubhas/10-modern-software-engineering-mistakes-bc67fbef4fc8)
- [Write code that is easy to delete](http://programmingisterrible.com/post/139222674273/write-code-that-is-easy-to-delete-not-easy-to)

## Modules

`pult` supports adding several modules to your base project. For any of the following modules, you can run `pult add X`, where `X` is the name of the module.

### pult add knex

[Knex.js](http://knexjs.org/) is a solid library for constructing SQL queries for [many different SQL databases](https://github.com/tgriesser/knex/tree/master/src/dialects).

### pult add knex-model

Generators added:

    pult generate model [model-name]

### pult add api

Generators added:

    pult generate api [resource-name]

TODO: DOCUMENT MORE
