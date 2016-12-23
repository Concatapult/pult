# Server Configuration

This folder houses all configuration for the server. Specifically:

- `index.json` contains your `routerPipeline`, which specifies the order of files adding routes to your app router.
- `config/*.js` are files that either add routes or do something else.
- `setup/` is the folder that contains code that should run once per server setup.

`index.js` is the file that kicks everything off. It creates a convenient global `CONFIG` variable that contains everything within `index.json`, along with other helpers.

## Generating a New Config File

Many modules automatically add their own config files. However, you may want to add one of your own. You can do so using the `pult` command:

    pult g config my-thing

`pult` will then create the file `server/config/my-thing.js` with the following contents:

```js
// require() your dependencies here


exports.mount = function mountMyThing (router) {
  // `router` is an express router.
  // Add to it as you normally would.
  // Example:
  //   router.get('/some-prefix', require('../my-thing/index.js'))
}
```

## Design Considerations

You can make your development life easier by keeping a few principles in mind.

### Separate your Concerns

Putting important code in config files is strongly discouraged. Instead, you should put your code in a folder within `server/`, then require that code within your config file.

In the above commented example, the important code for `my-thing` lives within `server/my-thing/index.js`; the config file only needs to require it.

### Write Maintainable Config Code

As you expand your application, your config code should not have to expand at the same rate.

In the above commented example, the line `router.get('/some-prefix', require('../my-thing/index.js'))` should be all you need to do with your config file. As your number of routes grow, those routes are added to `server/my-thing/index.js`, and NOT the config file itself.
