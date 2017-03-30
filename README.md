# Usage

## Installation

To install the packages:

```
npm install
```

You need to also install the js-api module, if you have it installed locally, you can do it by passing the local path to it's git repo:

```
npm install /PATH/TO/js-api/
```

## Compilation

To compile the project:

```
tsc
```

To create a Standalone (using Browserify):

```
browserify lib/manager.js --standalone adjago > build/adjago.js
```

## Testing

To run the tests:

*IMPORTANT* 
Please edit `test/config.js` to add a valid API key before to use the tests

``` 
npm test
```

# Technologies

### Testing

- Karma (test runner) https://karma-runner.github.io 
- Mocha (framework) http://mochajs.org/
- Mocha-sbt (sbt integration) https://github.com/sbt/sbt-mocha
- Chai http://chaijs.com/

### Coding

- TypeScript JS https://www.typescriptlang.org/
