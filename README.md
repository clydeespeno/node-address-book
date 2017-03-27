# node-address-book
An example address book written in node, using Koa, and dependency injection

## How to run

### Node Environment
You will need a version of node stated in `.nvmrc` file of this repository to run the application.
To install it, you may use [nvm](https://github.com/creationix/nvm)

on mac:
```
brew install nvm
cd <project directory>
nvm use
```

### Run the application on dev mode

```
npm install
npm run watch
```

### Create a dist file

```
npm run dist
```

The dist file can be deployed with:
```
node dist/app.js
```

or with a process manager such as [pm2](https://github.com/Unitech/pm2)
