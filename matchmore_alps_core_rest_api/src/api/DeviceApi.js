/**
 * MATCHMORE ALPS Core REST API
 * ## ALPS by [MATCHMORE](https://matchmore.io)  The first version of the MATCHMORE API is an exciting step to allow developers use a context-aware pub/sub cloud service.  A lot of mobile applications and their use cases may be modeled using this approach and can therefore profit from using MATCHMORE as their backend service.  **Build something great with [ALPS by MATCHMORE](https://matchmore.io)!**   Once you've [registered your client](https://matchmore.io/account/register/) it's easy start using our awesome cloud based context-aware pub/sub (admitted, a lot of buzzwords).  ## RESTful API We do our best to have all our URLs be [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer). Every endpoint (URL) may support one of four different http verbs. GET requests fetch information about an object, POST requests create objects, PUT requests update objects, and finally DELETE requests will delete objects.  ## Domain Model  This is the current domain model extended by an ontology of devices and separation between the developer portal and the ALPS Core.      +-----------+    +-------------+     | Developer +----+ Application |     +-----------+    +------+------+                             |                        \"Developer Portal\"     ........................+..........................................                             |                        \"ALPS Core\"                         +---+---+                         | World |                         +---+---+                             |                           +-------------+                             |                     +-----+ Publication |                             |                     |     +------+------+                             |                     |            |                             |                     |            |                             |                     |            |                             |                     |        +---+---+                        +----+---+-----------------+        | Match |                        | Device |                          +---+---+                        +----+---+-----------------+            |                             |                     |            |                             |                     |            |                             |                     |     +------+-------+             +---------------+--------------+      +-----+ Subscription |             |               |              |            +--------------+        +----+---+      +----+----+    +----+---+        |   Pin  |      | iBeacon |    | Mobile |        +----+---+      +---------+    +----+---+             |                              |             |         +----------+         |             +---------+ Location +---------+                       +----------+  1.  A **developer** is a mobile application developer registered in the     developer portal and allowed to use the **ALPS Developer Portal**.  A     developer might register one or more **applications** to use the     **ALPS Core cloud service**.  For developer/application pair a new     **world** is created in the **ALPS Core** and assigned an **API key** to     enable access to the ALPS Core cloud service **RESTful API**.  During     the registration, the developer needs to provide additional     configuration information for each application, e.g. its default     **push endpoint** URI for match delivery, etc. 2.  A [**device**](#tag/device) might be either *virtual* like a **pin device** or     *physical* like a **mobile device** or **iBeacon device**.  A [**pin     device**](#tag/device) is one that has geographical [**location**](#tag/location) associated with it     but is not represented by any object in the physical world; usually     it's location doesn't change frequently if at all.  A [**mobile     device**](#tag/device) is one that potentially moves together with its user and     therefore has a geographical location associated with it.  A mobile     device is typically a location-aware smartphone, which knows its     location thanks to GPS or to some other means like cell tower     triangulation, etc.  An [**iBeacon device**](#tag/device) represents an Apple     conform [iBeacon](https://developer.apple.com/ibeacon/) announcing its presence via Bluetooth LE     advertising packets which can be detected by a other mobile device.     It doesn't necessary has any location associated with it but it     serves to detect and announce its proximity to other **mobile     devices**. 3.  The hardware and software stack running on a given device is known     as its **platform**.  This include its hardware-related capabilities,     its operating systems, as well as the set of libraries (APIs)     offered to developers in order to program it. 4.  A devices may issue publications and subscriptions     at **any time**; it may also cancel publications and subscriptions     issued previously.  **Publications** and **subscriptions** do have a     definable, finite duration, after which they are deleted from the     ALPS Core cloud service and don't participate anymore in the     matching process. 5.  A [**publication**](#tag/publication) is similar to a Java Messaging Service (JMS)     publication extended with the notion of a **geographical zone**.  The     zone is defined as **circle** with a center at the given location and     a range around that location. 6.  A [**subscription**](#tag/subscription) is similar to a JMS subscription extended with the     notion of **geographical zone**. Again, the zone being defined as     **circle** with a center at the given location and a range around     that location. 7.  **Publications** and **subscriptions** which are associated with a     **mobile device**, e.g. user's mobile phone, potentially **follow the     movements** of the user carrying the device and therefore change     their associated location. 8.  A [**match**](#tag/match) between a publication and a subscription occurs when both     of the following two conditions hold:     1.  There is a **context match** occurs when for instance the         subscription zone overlaps with the publication zone or a         **proximity event** with an iBeacon device within the defined         range occurred.     2.  There is a **content match**: the publication and the subscription         match with respect to their JMS counterparts, i.e., they were         issued on the same topic and have compatible properties and the         evaluation of the selector against those properties returns true         value. 9.  A **push notification** is an asynchronous mechanism that allows an     application to receive matches for a subscription on his/her device.     Such a mechanism is clearly dependent on the device’s platform and     capabilities.  In order to use push notifications, an application must     first register a device (and possibly an application on that     device) with the ALPS core cloud service. 10. Whenever a **match** between a publication and a subscription     occurs, the device which owns the subscription receives that match     *asynchronously* via a push notification if there exists a     registered **push endpoint**.  A **push endpoint** is an URI which is     able to consume the matches for a particular device and     subscription.  The **push endpoint** doesn't necessary point to a     **mobile device** but is rather a very flexible mechanism to define     where the matches should be delivered. 11. Matches can also be retrieved by issuing a API call for a     particular device.   <a id=\"orgae4fb18\"></a>  ## Device Types                     +----+---+                    | Device |                    +--------+                    | id     |                    | name   |                    | group  |                    +----+---+                         |         +---------------+----------------+         |               |                |     +---+---+   +-------+------+    +----+-----+     |  Pin  |   | iBeacon      |    | Mobile   |     +---+---+   +--------------+    +----------+         |       | proximityUUID|    | platform |         |       | major        |    | token    |         |       | minor        |    +----+-----+         |       +-------+------+         |         |               |                |         |               | <--???         |         |          +----+-----+          |         +----------+ Location +----------+                    +----------+   <a id=\"org68cc0d8\"></a>  ### Generic `Device`  -   id -   name -   group  <a id=\"orgc430925\"></a>  ### `PinDevice`  -   location   <a id=\"orgecaed9f\"></a>  ### `iBeaconDevice`  -   proximityUUID -   major -   minor   <a id=\"org7b09b62\"></a>  ### `MobileDevice`  -   platform -   deviceToken -   location 
 *
 * OpenAPI spec version: 0.5.0
 * Contact: support@matchmore.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.3.1
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/APIError', 'model/Device', 'model/DeviceUpdate', 'model/IBeaconTriples', 'model/Location', 'model/Match', 'model/Matches', 'model/ProximityEvent', 'model/Publication', 'model/Publications', 'model/Subscription', 'model/Subscriptions'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/APIError'), require('../model/Device'), require('../model/DeviceUpdate'), require('../model/IBeaconTriples'), require('../model/Location'), require('../model/Match'), require('../model/Matches'), require('../model/ProximityEvent'), require('../model/Publication'), require('../model/Publications'), require('../model/Subscription'), require('../model/Subscriptions'));
  } else {
    // Browser globals (root is window)
    if (!root.MatchmoreAlpsCoreRestApi) {
      root.MatchmoreAlpsCoreRestApi = {};
    }
    root.MatchmoreAlpsCoreRestApi.DeviceApi = factory(root.MatchmoreAlpsCoreRestApi.ApiClient, root.MatchmoreAlpsCoreRestApi.APIError, root.MatchmoreAlpsCoreRestApi.Device, root.MatchmoreAlpsCoreRestApi.DeviceUpdate, root.MatchmoreAlpsCoreRestApi.IBeaconTriples, root.MatchmoreAlpsCoreRestApi.Location, root.MatchmoreAlpsCoreRestApi.Match, root.MatchmoreAlpsCoreRestApi.Matches, root.MatchmoreAlpsCoreRestApi.ProximityEvent, root.MatchmoreAlpsCoreRestApi.Publication, root.MatchmoreAlpsCoreRestApi.Publications, root.MatchmoreAlpsCoreRestApi.Subscription, root.MatchmoreAlpsCoreRestApi.Subscriptions);
  }
}(this, function(ApiClient, APIError, Device, DeviceUpdate, IBeaconTriples, Location, Match, Matches, ProximityEvent, Publication, Publications, Subscription, Subscriptions) {
  'use strict';

  /**
   * Device service.
   * @module api/DeviceApi
   * @version 0.5.0
   */

  /**
   * Constructs a new DeviceApi. 
   * @alias module:api/DeviceApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the createDevice operation.
     * @callback module:api/DeviceApi~createDeviceCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Device} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a device
     * @param {module:model/Device} device The device to be created.
     * @param {module:api/DeviceApi~createDeviceCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Device}
     */
    this.createDevice = function(device, callback) {
      var postBody = device;

      // verify the required parameter 'device' is set
      if (device === undefined || device === null) {
        throw new Error("Missing the required parameter 'device' when calling createDevice");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Device;

      return this.apiClient.callApi(
        '/devices', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the createLocation operation.
     * @callback module:api/DeviceApi~createLocationCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Location} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a new location for a device
     * @param {String} deviceId The id (UUID) of the device.
     * @param {module:model/Location} location Location to create for a device. 
     * @param {module:api/DeviceApi~createLocationCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Location}
     */
    this.createLocation = function(deviceId, location, callback) {
      var postBody = location;

      // verify the required parameter 'deviceId' is set
      if (deviceId === undefined || deviceId === null) {
        throw new Error("Missing the required parameter 'deviceId' when calling createLocation");
      }

      // verify the required parameter 'location' is set
      if (location === undefined || location === null) {
        throw new Error("Missing the required parameter 'location' when calling createLocation");
      }


      var pathParams = {
        'deviceId': deviceId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Location;

      return this.apiClient.callApi(
        '/devices/{deviceId}/locations', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the createPublication operation.
     * @callback module:api/DeviceApi~createPublicationCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Publication} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a publication for a device
     * @param {String} deviceId The id (UUID) of the device.
     * @param {module:model/Publication} publication Publication to create on a device. 
     * @param {module:api/DeviceApi~createPublicationCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Publication}
     */
    this.createPublication = function(deviceId, publication, callback) {
      var postBody = publication;

      // verify the required parameter 'deviceId' is set
      if (deviceId === undefined || deviceId === null) {
        throw new Error("Missing the required parameter 'deviceId' when calling createPublication");
      }

      // verify the required parameter 'publication' is set
      if (publication === undefined || publication === null) {
        throw new Error("Missing the required parameter 'publication' when calling createPublication");
      }


      var pathParams = {
        'deviceId': deviceId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Publication;

      return this.apiClient.callApi(
        '/devices/{deviceId}/publications', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the createSubscription operation.
     * @callback module:api/DeviceApi~createSubscriptionCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Subscription} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a subscription for a device
     * @param {String} deviceId The id (UUID) of the device. 
     * @param {module:model/Subscription} subscription Subscription to create on a device. 
     * @param {module:api/DeviceApi~createSubscriptionCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Subscription}
     */
    this.createSubscription = function(deviceId, subscription, callback) {
      var postBody = subscription;

      // verify the required parameter 'deviceId' is set
      if (deviceId === undefined || deviceId === null) {
        throw new Error("Missing the required parameter 'deviceId' when calling createSubscription");
      }

      // verify the required parameter 'subscription' is set
      if (subscription === undefined || subscription === null) {
        throw new Error("Missing the required parameter 'subscription' when calling createSubscription");
      }


      var pathParams = {
        'deviceId': deviceId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Subscription;

      return this.apiClient.callApi(
        '/devices/{deviceId}/subscriptions', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteDevice operation.
     * @callback module:api/DeviceApi~deleteDeviceCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete an existing device
     * @param {String} deviceId The id (UUID) of the device.
     * @param {module:api/DeviceApi~deleteDeviceCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deleteDevice = function(deviceId, callback) {
      var postBody = null;

      // verify the required parameter 'deviceId' is set
      if (deviceId === undefined || deviceId === null) {
        throw new Error("Missing the required parameter 'deviceId' when calling deleteDevice");
      }


      var pathParams = {
        'deviceId': deviceId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/devices/{deviceId}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deletePublication operation.
     * @callback module:api/DeviceApi~deletePublicationCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete a Publication
     * 
     * @param {String} deviceId The id (UUID) of the device.
     * @param {String} publicationId The id (UUID) of the subscription.
     * @param {module:api/DeviceApi~deletePublicationCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deletePublication = function(deviceId, publicationId, callback) {
      var postBody = null;

      // verify the required parameter 'deviceId' is set
      if (deviceId === undefined || deviceId === null) {
        throw new Error("Missing the required parameter 'deviceId' when calling deletePublication");
      }

      // verify the required parameter 'publicationId' is set
      if (publicationId === undefined || publicationId === null) {
        throw new Error("Missing the required parameter 'publicationId' when calling deletePublication");
      }


      var pathParams = {
        'deviceId': deviceId,
        'publicationId': publicationId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/devices/{deviceId}/publications/{publicationId}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteSubscription operation.
     * @callback module:api/DeviceApi~deleteSubscriptionCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete a Subscription
     * 
     * @param {String} deviceId The id (UUID) of the device.
     * @param {String} subscriptionId The id (UUID) of the subscription.
     * @param {module:api/DeviceApi~deleteSubscriptionCallback} callback The callback function, accepting three arguments: error, data, response
     */
    this.deleteSubscription = function(deviceId, subscriptionId, callback) {
      var postBody = null;

      // verify the required parameter 'deviceId' is set
      if (deviceId === undefined || deviceId === null) {
        throw new Error("Missing the required parameter 'deviceId' when calling deleteSubscription");
      }

      // verify the required parameter 'subscriptionId' is set
      if (subscriptionId === undefined || subscriptionId === null) {
        throw new Error("Missing the required parameter 'subscriptionId' when calling deleteSubscription");
      }


      var pathParams = {
        'deviceId': deviceId,
        'subscriptionId': subscriptionId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      return this.apiClient.callApi(
        '/devices/{deviceId}/subscriptions/{subscriptionId}', 'DELETE',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getDevice operation.
     * @callback module:api/DeviceApi~getDeviceCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Device} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Info about a device
     * @param {String} deviceId The id (UUID) of the device.
     * @param {module:api/DeviceApi~getDeviceCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Device}
     */
    this.getDevice = function(deviceId, callback) {
      var postBody = null;

      // verify the required parameter 'deviceId' is set
      if (deviceId === undefined || deviceId === null) {
        throw new Error("Missing the required parameter 'deviceId' when calling getDevice");
      }


      var pathParams = {
        'deviceId': deviceId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Device;

      return this.apiClient.callApi(
        '/devices/{deviceId}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getIBeaconTriples operation.
     * @callback module:api/DeviceApi~getIBeaconTriplesCallback
     * @param {String} error Error message, if any.
     * @param {module:model/IBeaconTriples} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get IBeacons triples for all registered devices
     * Keys in map are device UUIDs and values are IBeacon triples. In model you can see example values \&quot;property1\&quot; \&quot;property2\&quot; \&quot;property3\&quot; instead of random UUIDs this is generated by OpenApi document browser
     * @param {module:api/DeviceApi~getIBeaconTriplesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/IBeaconTriples}
     */
    this.getIBeaconTriples = function(callback) {
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = IBeaconTriples;

      return this.apiClient.callApi(
        '/devices/IBeaconTriples', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getMatch operation.
     * @callback module:api/DeviceApi~getMatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Match} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get match for the device by its id
     * @param {String} deviceId The id (UUID) of the user device.
     * @param {String} matchId The id (UUID) of the match.
     * @param {module:api/DeviceApi~getMatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Match}
     */
    this.getMatch = function(deviceId, matchId, callback) {
      var postBody = null;

      // verify the required parameter 'deviceId' is set
      if (deviceId === undefined || deviceId === null) {
        throw new Error("Missing the required parameter 'deviceId' when calling getMatch");
      }

      // verify the required parameter 'matchId' is set
      if (matchId === undefined || matchId === null) {
        throw new Error("Missing the required parameter 'matchId' when calling getMatch");
      }


      var pathParams = {
        'deviceId': deviceId,
        'matchId': matchId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Match;

      return this.apiClient.callApi(
        '/devices/{deviceId}/matches/{matchId}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getMatches operation.
     * @callback module:api/DeviceApi~getMatchesCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Matches} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get matches for the device
     * @param {String} deviceId The id (UUID) of the device.
     * @param {module:api/DeviceApi~getMatchesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Matches}
     */
    this.getMatches = function(deviceId, callback) {
      var postBody = null;

      // verify the required parameter 'deviceId' is set
      if (deviceId === undefined || deviceId === null) {
        throw new Error("Missing the required parameter 'deviceId' when calling getMatches");
      }


      var pathParams = {
        'deviceId': deviceId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Matches;

      return this.apiClient.callApi(
        '/devices/{deviceId}/matches', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getPublication operation.
     * @callback module:api/DeviceApi~getPublicationCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Publication} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Info about a publication on a device
     * @param {String} deviceId The id (UUID) of the device.
     * @param {String} publicationId The id (UUID) of the publication.
     * @param {module:api/DeviceApi~getPublicationCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Publication}
     */
    this.getPublication = function(deviceId, publicationId, callback) {
      var postBody = null;

      // verify the required parameter 'deviceId' is set
      if (deviceId === undefined || deviceId === null) {
        throw new Error("Missing the required parameter 'deviceId' when calling getPublication");
      }

      // verify the required parameter 'publicationId' is set
      if (publicationId === undefined || publicationId === null) {
        throw new Error("Missing the required parameter 'publicationId' when calling getPublication");
      }


      var pathParams = {
        'deviceId': deviceId,
        'publicationId': publicationId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Publication;

      return this.apiClient.callApi(
        '/devices/{deviceId}/publications/{publicationId}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getPublications operation.
     * @callback module:api/DeviceApi~getPublicationsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Publications} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all publications for a device
     * @param {String} deviceId The id (UUID) of the device.
     * @param {module:api/DeviceApi~getPublicationsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Publications}
     */
    this.getPublications = function(deviceId, callback) {
      var postBody = null;

      // verify the required parameter 'deviceId' is set
      if (deviceId === undefined || deviceId === null) {
        throw new Error("Missing the required parameter 'deviceId' when calling getPublications");
      }


      var pathParams = {
        'deviceId': deviceId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Publications;

      return this.apiClient.callApi(
        '/devices/{deviceId}/publications', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getSubscription operation.
     * @callback module:api/DeviceApi~getSubscriptionCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Subscription} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Info about a subscription on a device
     * @param {String} deviceId The id (UUID) of the device.
     * @param {String} subscriptionId The id (UUID) of the subscription.
     * @param {module:api/DeviceApi~getSubscriptionCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Subscription}
     */
    this.getSubscription = function(deviceId, subscriptionId, callback) {
      var postBody = null;

      // verify the required parameter 'deviceId' is set
      if (deviceId === undefined || deviceId === null) {
        throw new Error("Missing the required parameter 'deviceId' when calling getSubscription");
      }

      // verify the required parameter 'subscriptionId' is set
      if (subscriptionId === undefined || subscriptionId === null) {
        throw new Error("Missing the required parameter 'subscriptionId' when calling getSubscription");
      }


      var pathParams = {
        'deviceId': deviceId,
        'subscriptionId': subscriptionId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Subscription;

      return this.apiClient.callApi(
        '/devices/{deviceId}/subscriptions/{subscriptionId}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getSubscriptions operation.
     * @callback module:api/DeviceApi~getSubscriptionsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Subscriptions} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get all subscriptions for a device
     * @param {String} deviceId The id (UUID) of the device.
     * @param {module:api/DeviceApi~getSubscriptionsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Subscriptions}
     */
    this.getSubscriptions = function(deviceId, callback) {
      var postBody = null;

      // verify the required parameter 'deviceId' is set
      if (deviceId === undefined || deviceId === null) {
        throw new Error("Missing the required parameter 'deviceId' when calling getSubscriptions");
      }


      var pathParams = {
        'deviceId': deviceId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Subscriptions;

      return this.apiClient.callApi(
        '/devices/{deviceId}/subscriptions', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the triggerProximityEvents operation.
     * @callback module:api/DeviceApi~triggerProximityEventsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ProximityEvent} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Trigger the proximity event between a device and a ranged BLE iBeacon
     * @param {String} deviceId The id (UUID) of the device.
     * @param {module:model/ProximityEvent} proximityEvent The proximity event to be created for the device.
     * @param {module:api/DeviceApi~triggerProximityEventsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ProximityEvent}
     */
    this.triggerProximityEvents = function(deviceId, proximityEvent, callback) {
      var postBody = proximityEvent;

      // verify the required parameter 'deviceId' is set
      if (deviceId === undefined || deviceId === null) {
        throw new Error("Missing the required parameter 'deviceId' when calling triggerProximityEvents");
      }

      // verify the required parameter 'proximityEvent' is set
      if (proximityEvent === undefined || proximityEvent === null) {
        throw new Error("Missing the required parameter 'proximityEvent' when calling triggerProximityEvents");
      }


      var pathParams = {
        'deviceId': deviceId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = ProximityEvent;

      return this.apiClient.callApi(
        '/devices/{deviceId}/proximityEvents', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the updateDevice operation.
     * @callback module:api/DeviceApi~updateDeviceCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Device} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Updates name or/and device token for existing device
     * Token can be only updated for mobile devices.
     * @param {module:model/DeviceUpdate} device The device update description.
     * @param {module:api/DeviceApi~updateDeviceCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Device}
     */
    this.updateDevice = function(device, callback) {
      var postBody = device;

      // verify the required parameter 'device' is set
      if (device === undefined || device === null) {
        throw new Error("Missing the required parameter 'device' when calling updateDevice");
      }


      var pathParams = {
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api-key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Device;

      return this.apiClient.callApi(
        '/devices/{deviceId}', 'PATCH',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
