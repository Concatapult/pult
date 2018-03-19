![Concatapult](https://raw.githubusercontent.com/concatapult/pult/master/concatapult.png)

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/concatapult/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

`pult` is Concatapult's command-line interface to help you generate solid project boilerplates that are composed of the pieces you choose.

### Requirements

- `git`
- `node >= v7.8.0`
- `yarn >= 0.22.0` – install / update with `npm install -g yarn`


## Usage

```bash
# install with yarn:
$ yarn global add pult-cli

# make a project, and jump in:
$ pult new my-project
$ cd my-project

# add some modules for your project:
$ pult add spa
$ pult add react
$ pult add ... # See "Modules" section

# start up your server:
$ yarn watch
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

### Leading (but not Bleeding) Edge

Because pult is intended to be a rapid starter for greenfield projects, it should always be updated with the lastest proven practices.

Note that this **does not** mean we are eager to use the latest tech fads. It means we will take a step back, observe, and import the progressive ideas that the JavaScript community has learned and proven to be beneficial.

### Portable

`pult` should work cross-platform. Any generated code should work on *nix, OS X, and [Windows Bash](https://msdn.microsoft.com/en-us/commandline/wsl/about). If an incompatibility sneaks its way into the project, open an issue and we can resolve it together.

### Opinionated

The code structure that Concatapult generates is opinionated without apology. With that said, we are always seeking the best solution, so if you have a suggestion for improvement, please create an issue and we'll happily discuss.

### Further Reading

- [Don't over-engineer](https://medium.com/@rdsubhas/10-modern-software-engineering-mistakes-bc67fbef4fc8)
- [Write code that is easy to delete](http://programmingisterrible.com/post/139222674273/write-code-that-is-easy-to-delete-not-easy-to)

## Base Project

When you run `pult new`, you get the following base project:

- **express.js** - A basic server in `server/index.js` with a placeholder endpoint.
- **chai & mocha** - A foundation for testing with `supertest` and [Promise coroutines](https://github.com/airportyh/coroutines-in-node/blob/master/bluebird.js).
- **dotenv** - Frictionless support for environment variables that don't get commited to git.
- **server/config/index.js** - A router mounting pipeline that makes it easy for modules to set themselves up.
- **server/config/setup/index.js** - A series of setup files. Ideally, running `yarn setup` is all that a developer needs to do to before running your app locally.

I encourage you to read through each file. There is not much going on, and once learned you will be able to own your code in a way that no framework would permit.

## Modules

`pult` supports adding several modules to your base project. For any of the following modules, you can run `pult add X`, where `X` is the name of the module.

### Module Dependency Tree Overview

- [api](#pult-add-api)
- [cookie-session](#pult-add-cookie-session)
- [knex](#pult-add-knex)
  - [knex-model](#pult-add-knex-model)
- [less](#pult-add-less)
- [marko](#pult-add-marko)
- [spa](#pult-add-spa)
  - [mithril](#pult-add-mithril)
  - [react](#pult-add-react)
- [typescript](#pult-add-typescript)

TODO: DOCUMENT MORE


### pult add api

This module adds a basic structure and generator for RESTful API endpoints.

Generators added:

    pult generate api [resource-name]


### pult add knex

[Knex.js](http://knexjs.org/) is a solid library for constructing SQL queries for [many different SQL databases](https://github.com/tgriesser/knex/tree/master/src/dialects).

This module adds a driver file that you can require in your models to connect to the database.


### pult add knex-model

Instead of a complicated ORM that requires thousands of lines of code, this module gives you a small model "class" that you can extend as you need to. The starting model provides basic functionality, such as `MyModel.save` and `MyModel.findBy`. It also provides a model generator to help you get started quicker.

Generators added:

    pult generate model [model-name]


### pult add less

[LESS CSS](http://lesscss.org/) is a SASS alternative that is 100% written in JavaScript. Because of this, the tooling is simpler, faster to install, and faster to deploy.


### pult add marko

[Marko.js](https://github.com/marko-js/marko) is an incredible server-side templating system built by Ebay. It supports fast streaming server-side templates with isometric UI component rendering. JavaScript and CSS dependencies are auto-detected based on usage and automatically served to the client.

Marko is best when your project DOES NOT have to be a pure single-page app, but can afford to have multiple pages, perhaps each page being its own mini-app (as most web apps can afford).


### pult add spa

This module installs [browserify](http://browserify.org/) and [browserify-middleware](https://github.com/ForbesLindesay/browserify-middleware) to lay the foundation for adding other modules for Single Page Applications.


### pult add mithril

[Mithril.js](http://mithril.js.org/) is an excellent SPA framework that finds the right balance between size (7.8kb), functionality (router, ajax, Virtual DOM), flexibility, and speed. It requires no compiling / transpiling to work, and can be made to be browser-compatible all the way back to Internet Explorer 6.


### pult add react

[React.js](https://facebook.github.io/react/) is a popular framework for building SPAs. Concatapult does not necessarily endorse React for all, or even most cases; many times, using React can be overkill.


### pult add cookie-session

Using [cookie sessions](https://github.com/expressjs/cookie-session) is a quick and easy solution for your app's sessions. The session is **encrypted** and stored entirely in a cookie in each user's browser, subtracting the need to set up a sessions database.


### pult add typescript

[TypeScript](https://github.com/Microsoft/TypeScript) is a superset of JavaScript that adds type checking and auto-completion. I highly recommend starting all new projects with TypeScript if possible, as it greatly enhances the productivity and maintainability of your projects.

This module will allow you to write and require `.ts` files. Note that TypeScript's `import` / `export` on nodejs translate to `require` and `module.exports`.


## Built-in Generators

Sometimes you need to generate your own quick configuration for your own project. In that case you can use:

    pult g config

## Contributing

Want to add your preferred tech? Need to update something? All modules are specified in the [modules/](./modules) folder and are easy to submit pull requests to.
