# Usage

## Installation

To install the packages:

```
npm install
```

You need to also install the alps-js-api module, if you have it installed locally, you can do it by passing the local path to it's git repo:

```
npm install /PATH/TO/alps-js-api/
```

or by using the version on GitHub:

```
npm https://github.com/MatchMore/alps-js-api
```

## Compilation

To compile the project:

```
tsc
```

To create a Standalone (using Browserify):

```
browserify lib/manager.js --standalone matchmore > build/matchmore.js
```

## Testing

To run the tests:

*IMPORTANT* 
Please edit `test/config.js` to add a valid API key before to use the tests

``` 
npm test
```

## Usage

### In a browser

Include `build/matchmore.js` into your page and start by creating a Manager() instance. The Manager will allow you to create Users, Devices, Publications, Subscriptions, ...

### In your project 

Use npm to include MatchMore


# Technologies

### Testing

- Karma (test runner) https://karma-runner.github.io 
- Mocha (framework) http://mochajs.org/
- Mocha-sbt (sbt integration) https://github.com/sbt/sbt-mocha
- Chai http://chaijs.com/

### Coding

- TypeScript JS https://www.typescriptlang.org/
