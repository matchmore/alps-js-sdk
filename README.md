# Matchmore Javascript SDK

`MatchmoreSDK` is a contextualized publish/subscribe model which can be used to model any geolocated or proximity based mobile application.


## Usage

### In a browser

Include `dist/web/matchmore.js` into your page and start by creating a Manager() instance. The Manager will allow you to create Users, Devices, Publications, Subscriptions, ...

### In your project 

1. Use npm to include MatchMore

```
npm install @matchmore/matchmore --save
```
or
```
yarn add @matchmore/matchmore
```

2. Then import the library

```
import { Manager } from "@matchmore/matchmore";
```

3. And then start your application with minimum config

```
this.manager = new Manager(
  "<Your api key>"
)
```



## Testing

To run the tests:

*IMPORTANT* 
Please edit `test/config.ts` to add a valid API key before to use the tests

``` 
npm test
```


## Compilation

Install dependencies:

```
npm install
```

To compile the project:


```
npm run build
```

To create a Standalone (using Browserify):

```
npm run browserify
```

Create a (greatly) minified version

```
npm run minify
```

### Testing

- Karma (test runner) https://karma-runner.github.io 
- Mocha (framework) http://mochajs.org/
- Mocha-sbt (sbt integration) https://github.com/sbt/sbt-mocha
- Chai http://chaijs.com/

### Coding

- TypeScript JS https://www.typescriptlang.org/
