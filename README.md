# Alps Javascript SDK

[![Join the chat at https://gitter.im/matchmore/alps-js-sdk](https://badges.gitter.im/matchmore/alps-js-sdk.svg)](https://gitter.im/matchmore/alps-js-sdk?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

`AlpsSDK` is a contextualized publish/subscribe model which can be used to model any geolocated or proximity based mobile application.

# Usage

## Installation

Clone the repo locally and install the dependencies from the root folder with:

## Compilation

To compile the project:

```
tsc
```

To create a Standalone (using Browserify):

```
browserify lib/src/manager.js --standalone matchmore > build/matchmore.js
```

## Testing

To run the tests:

*IMPORTANT* 
Please edit `test/config.ts` to add a valid API key before to use the tests

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
