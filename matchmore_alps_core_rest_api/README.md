# matchmore_alps_core_rest_api

MatchmoreAlpsCoreRestApi - JavaScript client for matchmore_alps_core_rest_api
## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
This SDK is automatically generated by the [Swagger Codegen](https://github.com/swagger-api/swagger-codegen) project:

- API version: 0.5.0
- Package version: 0.5.0
- Build package: io.swagger.codegen.languages.JavascriptClientCodegen
For more information, please visit [https://matchmore.io](https://matchmore.io)

## Installation

### For [Node.js](https://nodejs.org/)

#### npm

To publish the library as a [npm](https://www.npmjs.com/),
please follow the procedure in ["Publishing npm packages"](https://docs.npmjs.com/getting-started/publishing-npm-packages).

Then install it via:

```shell
npm install matchmore_alps_core_rest_api --save
```

##### Local development

To use the library locally without publishing to a remote npm registry, first install the dependencies by changing 
into the directory containing `package.json` (and this README). Let's call this `JAVASCRIPT_CLIENT_DIR`. Then run:

```shell
npm install
```

Next, [link](https://docs.npmjs.com/cli/link) it globally in npm with the following, also from `JAVASCRIPT_CLIENT_DIR`:

```shell
npm link
```

Finally, switch to the directory you want to use your matchmore_alps_core_rest_api from, and run:

```shell
npm link /path/to/<JAVASCRIPT_CLIENT_DIR>
```

You should now be able to `require('matchmore_alps_core_rest_api')` in javascript files from the directory you ran the last 
command above from.

#### git
#
If the library is hosted at a git repository, e.g.
https://github.com/GIT_USER_ID/GIT_REPO_ID
then install it via:

```shell
    npm install GIT_USER_ID/GIT_REPO_ID --save
```

### For browser

The library also works in the browser environment via npm and [browserify](http://browserify.org/). After following
the above steps with Node.js and installing browserify with `npm install -g browserify`,
perform the following (assuming *main.js* is your entry file, that's to say your javascript file where you actually 
use this library):

```shell
browserify main.js > bundle.js
```

Then include *bundle.js* in the HTML pages.

### Webpack Configuration

Using Webpack you may encounter the following error: "Module not found: Error:
Cannot resolve module", most certainly you should disable AMD loader. Add/merge
the following section to your webpack config:

```javascript
module: {
  rules: [
    {
      parser: {
        amd: false
      }
    }
  ]
}
```

## Getting Started

Please follow the [installation](#installation) instruction and execute the following JS code:

```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');

var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = "YOUR API KEY"
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix['api-key'] = "Token"

var api = new MatchmoreAlpsCoreRestApi.DeviceApi()

var device = new MatchmoreAlpsCoreRestApi.Device(); // {Device} The device to be created.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
api.createDevice(device, callback);

```

## Documentation for API Endpoints

All URIs are relative to *https://api.matchmore.io/v5*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**createDevice**](docs/DeviceApi.md#createDevice) | **POST** /devices | Create a device
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**createLocation**](docs/DeviceApi.md#createLocation) | **POST** /devices/{deviceId}/locations | Create a new location for a device
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**createPublication**](docs/DeviceApi.md#createPublication) | **POST** /devices/{deviceId}/publications | Create a publication for a device
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**createSubscription**](docs/DeviceApi.md#createSubscription) | **POST** /devices/{deviceId}/subscriptions | Create a subscription for a device
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**deleteDevice**](docs/DeviceApi.md#deleteDevice) | **DELETE** /devices/{deviceId} | Delete an existing device
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**deletePublication**](docs/DeviceApi.md#deletePublication) | **DELETE** /devices/{deviceId}/publications/{publicationId} | Delete a Publication
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**deleteSubscription**](docs/DeviceApi.md#deleteSubscription) | **DELETE** /devices/{deviceId}/subscriptions/{subscriptionId} | Delete a Subscription
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**getDevice**](docs/DeviceApi.md#getDevice) | **GET** /devices/{deviceId} | Info about a device
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**getIBeaconTriples**](docs/DeviceApi.md#getIBeaconTriples) | **GET** /devices/IBeaconTriples | Get IBeacons triples for all registered devices
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**getMatch**](docs/DeviceApi.md#getMatch) | **GET** /devices/{deviceId}/matches/{matchId} | Get match for the device by its id
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**getMatches**](docs/DeviceApi.md#getMatches) | **GET** /devices/{deviceId}/matches | Get matches for the device
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**getPublication**](docs/DeviceApi.md#getPublication) | **GET** /devices/{deviceId}/publications/{publicationId} | Info about a publication on a device
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**getPublications**](docs/DeviceApi.md#getPublications) | **GET** /devices/{deviceId}/publications | Get all publications for a device
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**getSubscription**](docs/DeviceApi.md#getSubscription) | **GET** /devices/{deviceId}/subscriptions/{subscriptionId} | Info about a subscription on a device
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**getSubscriptions**](docs/DeviceApi.md#getSubscriptions) | **GET** /devices/{deviceId}/subscriptions | Get all subscriptions for a device
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**triggerProximityEvents**](docs/DeviceApi.md#triggerProximityEvents) | **POST** /devices/{deviceId}/proximityEvents | Trigger the proximity event between a device and a ranged BLE iBeacon
*MatchmoreAlpsCoreRestApi.DeviceApi* | [**updateDevice**](docs/DeviceApi.md#updateDevice) | **PATCH** /devices/{deviceId} | Updates name or/and device token for existing device
*MatchmoreAlpsCoreRestApi.LocationApi* | [**createLocation**](docs/LocationApi.md#createLocation) | **POST** /devices/{deviceId}/locations | Create a new location for a device
*MatchmoreAlpsCoreRestApi.MatchesApi* | [**getMatch**](docs/MatchesApi.md#getMatch) | **GET** /devices/{deviceId}/matches/{matchId} | Get match for the device by its id
*MatchmoreAlpsCoreRestApi.MatchesApi* | [**getMatches**](docs/MatchesApi.md#getMatches) | **GET** /devices/{deviceId}/matches | Get matches for the device
*MatchmoreAlpsCoreRestApi.PublicationApi* | [**createPublication**](docs/PublicationApi.md#createPublication) | **POST** /devices/{deviceId}/publications | Create a publication for a device
*MatchmoreAlpsCoreRestApi.PublicationApi* | [**deletePublication**](docs/PublicationApi.md#deletePublication) | **DELETE** /devices/{deviceId}/publications/{publicationId} | Delete a Publication
*MatchmoreAlpsCoreRestApi.PublicationApi* | [**getPublication**](docs/PublicationApi.md#getPublication) | **GET** /devices/{deviceId}/publications/{publicationId} | Info about a publication on a device
*MatchmoreAlpsCoreRestApi.PublicationApi* | [**getPublications**](docs/PublicationApi.md#getPublications) | **GET** /devices/{deviceId}/publications | Get all publications for a device
*MatchmoreAlpsCoreRestApi.SubscriptionApi* | [**createSubscription**](docs/SubscriptionApi.md#createSubscription) | **POST** /devices/{deviceId}/subscriptions | Create a subscription for a device
*MatchmoreAlpsCoreRestApi.SubscriptionApi* | [**deleteSubscription**](docs/SubscriptionApi.md#deleteSubscription) | **DELETE** /devices/{deviceId}/subscriptions/{subscriptionId} | Delete a Subscription
*MatchmoreAlpsCoreRestApi.SubscriptionApi* | [**getSubscription**](docs/SubscriptionApi.md#getSubscription) | **GET** /devices/{deviceId}/subscriptions/{subscriptionId} | Info about a subscription on a device
*MatchmoreAlpsCoreRestApi.SubscriptionApi* | [**getSubscriptions**](docs/SubscriptionApi.md#getSubscriptions) | **GET** /devices/{deviceId}/subscriptions | Get all subscriptions for a device


## Documentation for Models

 - [MatchmoreAlpsCoreRestApi.APIError](docs/APIError.md)
 - [MatchmoreAlpsCoreRestApi.Device](docs/Device.md)
 - [MatchmoreAlpsCoreRestApi.DeviceType](docs/DeviceType.md)
 - [MatchmoreAlpsCoreRestApi.DeviceUpdate](docs/DeviceUpdate.md)
 - [MatchmoreAlpsCoreRestApi.Devices](docs/Devices.md)
 - [MatchmoreAlpsCoreRestApi.IBeaconTriple](docs/IBeaconTriple.md)
 - [MatchmoreAlpsCoreRestApi.IBeaconTriples](docs/IBeaconTriples.md)
 - [MatchmoreAlpsCoreRestApi.Location](docs/Location.md)
 - [MatchmoreAlpsCoreRestApi.Match](docs/Match.md)
 - [MatchmoreAlpsCoreRestApi.Matches](docs/Matches.md)
 - [MatchmoreAlpsCoreRestApi.ProximityEvent](docs/ProximityEvent.md)
 - [MatchmoreAlpsCoreRestApi.Publication](docs/Publication.md)
 - [MatchmoreAlpsCoreRestApi.Publications](docs/Publications.md)
 - [MatchmoreAlpsCoreRestApi.Subscription](docs/Subscription.md)
 - [MatchmoreAlpsCoreRestApi.Subscriptions](docs/Subscriptions.md)
 - [MatchmoreAlpsCoreRestApi.IBeaconDevice](docs/IBeaconDevice.md)
 - [MatchmoreAlpsCoreRestApi.MobileDevice](docs/MobileDevice.md)
 - [MatchmoreAlpsCoreRestApi.PinDevice](docs/PinDevice.md)


## Documentation for Authorization


### api-key

- **Type**: API key
- **API key parameter name**: api-key
- **Location**: HTTP header

