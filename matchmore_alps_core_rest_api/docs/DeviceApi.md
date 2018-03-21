# MatchmoreAlpsCoreRestApi.DeviceApi

All URIs are relative to *https://api.matchmore.io/v5*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createDevice**](DeviceApi.md#createDevice) | **POST** /devices | Create a device
[**createLocation**](DeviceApi.md#createLocation) | **POST** /devices/{deviceId}/locations | Create a new location for a device
[**createPublication**](DeviceApi.md#createPublication) | **POST** /devices/{deviceId}/publications | Create a publication for a device
[**createSubscription**](DeviceApi.md#createSubscription) | **POST** /devices/{deviceId}/subscriptions | Create a subscription for a device
[**deleteDevice**](DeviceApi.md#deleteDevice) | **DELETE** /devices/{deviceId} | Delete an existing device
[**deletePublication**](DeviceApi.md#deletePublication) | **DELETE** /devices/{deviceId}/publications/{publicationId} | Delete a Publication
[**deleteSubscription**](DeviceApi.md#deleteSubscription) | **DELETE** /devices/{deviceId}/subscriptions/{subscriptionId} | Delete a Subscription
[**getDevice**](DeviceApi.md#getDevice) | **GET** /devices/{deviceId} | Info about a device
[**getIBeaconTriples**](DeviceApi.md#getIBeaconTriples) | **GET** /devices/IBeaconTriples | Get IBeacons triples for all registered devices
[**getMatch**](DeviceApi.md#getMatch) | **GET** /devices/{deviceId}/matches/{matchId} | Get match for the device by its id
[**getMatches**](DeviceApi.md#getMatches) | **GET** /devices/{deviceId}/matches | Get matches for the device
[**getPublication**](DeviceApi.md#getPublication) | **GET** /devices/{deviceId}/publications/{publicationId} | Info about a publication on a device
[**getPublications**](DeviceApi.md#getPublications) | **GET** /devices/{deviceId}/publications | Get all publications for a device
[**getSubscription**](DeviceApi.md#getSubscription) | **GET** /devices/{deviceId}/subscriptions/{subscriptionId} | Info about a subscription on a device
[**getSubscriptions**](DeviceApi.md#getSubscriptions) | **GET** /devices/{deviceId}/subscriptions | Get all subscriptions for a device
[**triggerProximityEvents**](DeviceApi.md#triggerProximityEvents) | **POST** /devices/{deviceId}/proximityEvents | Trigger the proximity event between a device and a ranged BLE iBeacon
[**updateDevice**](DeviceApi.md#updateDevice) | **PATCH** /devices/{deviceId} | Updates name or/and device token for existing device


<a name="createDevice"></a>
# **createDevice**
> Device createDevice(device)

Create a device

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var device = new MatchmoreAlpsCoreRestApi.Device(); // Device | The device to be created.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.createDevice(device, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **device** | [**Device**](Device.md)| The device to be created. | 

### Return type

[**Device**](Device.md)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createLocation"></a>
# **createLocation**
> Location createLocation(deviceId, location)

Create a new location for a device

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var deviceId = "deviceId_example"; // String | The id (UUID) of the device.

var location = new MatchmoreAlpsCoreRestApi.Location(); // Location | Location to create for a device. 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.createLocation(deviceId, location, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| The id (UUID) of the device. | 
 **location** | [**Location**](Location.md)| Location to create for a device.  | 

### Return type

[**Location**](Location.md)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createPublication"></a>
# **createPublication**
> Publication createPublication(deviceId, publication)

Create a publication for a device

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var deviceId = "deviceId_example"; // String | The id (UUID) of the device.

var publication = new MatchmoreAlpsCoreRestApi.Publication(); // Publication | Publication to create on a device. 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.createPublication(deviceId, publication, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| The id (UUID) of the device. | 
 **publication** | [**Publication**](Publication.md)| Publication to create on a device.  | 

### Return type

[**Publication**](Publication.md)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createSubscription"></a>
# **createSubscription**
> Subscription createSubscription(deviceId, subscription)

Create a subscription for a device

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var deviceId = "deviceId_example"; // String | The id (UUID) of the device. 

var subscription = new MatchmoreAlpsCoreRestApi.Subscription(); // Subscription | Subscription to create on a device. 


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.createSubscription(deviceId, subscription, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| The id (UUID) of the device.  | 
 **subscription** | [**Subscription**](Subscription.md)| Subscription to create on a device.  | 

### Return type

[**Subscription**](Subscription.md)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteDevice"></a>
# **deleteDevice**
> deleteDevice(deviceId)

Delete an existing device

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var deviceId = "deviceId_example"; // String | The id (UUID) of the device.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deleteDevice(deviceId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| The id (UUID) of the device. | 

### Return type

null (empty response body)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deletePublication"></a>
# **deletePublication**
> deletePublication(deviceId, publicationId)

Delete a Publication



### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var deviceId = "deviceId_example"; // String | The id (UUID) of the device.

var publicationId = "publicationId_example"; // String | The id (UUID) of the subscription.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deletePublication(deviceId, publicationId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| The id (UUID) of the device. | 
 **publicationId** | **String**| The id (UUID) of the subscription. | 

### Return type

null (empty response body)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteSubscription"></a>
# **deleteSubscription**
> deleteSubscription(deviceId, subscriptionId)

Delete a Subscription



### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var deviceId = "deviceId_example"; // String | The id (UUID) of the device.

var subscriptionId = "subscriptionId_example"; // String | The id (UUID) of the subscription.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.deleteSubscription(deviceId, subscriptionId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| The id (UUID) of the device. | 
 **subscriptionId** | **String**| The id (UUID) of the subscription. | 

### Return type

null (empty response body)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getDevice"></a>
# **getDevice**
> Device getDevice(deviceId)

Info about a device

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var deviceId = "deviceId_example"; // String | The id (UUID) of the device.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getDevice(deviceId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| The id (UUID) of the device. | 

### Return type

[**Device**](Device.md)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getIBeaconTriples"></a>
# **getIBeaconTriples**
> IBeaconTriples getIBeaconTriples()

Get IBeacons triples for all registered devices

Keys in map are device UUIDs and values are IBeacon triples. In model you can see example values \&quot;property1\&quot; \&quot;property2\&quot; \&quot;property3\&quot; instead of random UUIDs this is generated by OpenApi document browser

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getIBeaconTriples(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**IBeaconTriples**](IBeaconTriples.md)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getMatch"></a>
# **getMatch**
> Match getMatch(deviceId, matchId)

Get match for the device by its id

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var deviceId = "deviceId_example"; // String | The id (UUID) of the user device.

var matchId = "matchId_example"; // String | The id (UUID) of the match.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getMatch(deviceId, matchId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| The id (UUID) of the user device. | 
 **matchId** | **String**| The id (UUID) of the match. | 

### Return type

[**Match**](Match.md)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getMatches"></a>
# **getMatches**
> Matches getMatches(deviceId)

Get matches for the device

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var deviceId = "deviceId_example"; // String | The id (UUID) of the device.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getMatches(deviceId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| The id (UUID) of the device. | 

### Return type

[**Matches**](Matches.md)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getPublication"></a>
# **getPublication**
> Publication getPublication(deviceId, publicationId)

Info about a publication on a device

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var deviceId = "deviceId_example"; // String | The id (UUID) of the device.

var publicationId = "publicationId_example"; // String | The id (UUID) of the publication.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getPublication(deviceId, publicationId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| The id (UUID) of the device. | 
 **publicationId** | **String**| The id (UUID) of the publication. | 

### Return type

[**Publication**](Publication.md)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getPublications"></a>
# **getPublications**
> Publications getPublications(deviceId)

Get all publications for a device

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var deviceId = "deviceId_example"; // String | The id (UUID) of the device.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getPublications(deviceId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| The id (UUID) of the device. | 

### Return type

[**Publications**](Publications.md)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getSubscription"></a>
# **getSubscription**
> Subscription getSubscription(deviceId, subscriptionId)

Info about a subscription on a device

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var deviceId = "deviceId_example"; // String | The id (UUID) of the device.

var subscriptionId = "subscriptionId_example"; // String | The id (UUID) of the subscription.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getSubscription(deviceId, subscriptionId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| The id (UUID) of the device. | 
 **subscriptionId** | **String**| The id (UUID) of the subscription. | 

### Return type

[**Subscription**](Subscription.md)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getSubscriptions"></a>
# **getSubscriptions**
> Subscriptions getSubscriptions(deviceId)

Get all subscriptions for a device

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var deviceId = "deviceId_example"; // String | The id (UUID) of the device.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getSubscriptions(deviceId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| The id (UUID) of the device. | 

### Return type

[**Subscriptions**](Subscriptions.md)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="triggerProximityEvents"></a>
# **triggerProximityEvents**
> ProximityEvent triggerProximityEvents(deviceId, proximityEvent)

Trigger the proximity event between a device and a ranged BLE iBeacon

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var deviceId = "deviceId_example"; // String | The id (UUID) of the device.

var proximityEvent = new MatchmoreAlpsCoreRestApi.ProximityEvent(); // ProximityEvent | The proximity event to be created for the device.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.triggerProximityEvents(deviceId, proximityEvent, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deviceId** | **String**| The id (UUID) of the device. | 
 **proximityEvent** | [**ProximityEvent**](ProximityEvent.md)| The proximity event to be created for the device. | 

### Return type

[**ProximityEvent**](ProximityEvent.md)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="updateDevice"></a>
# **updateDevice**
> Device updateDevice(device)

Updates name or/and device token for existing device

Token can be only updated for mobile devices.

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');
var defaultClient = MatchmoreAlpsCoreRestApi.ApiClient.instance;

// Configure API key authorization: api-key
var api-key = defaultClient.authentications['api-key'];
api-key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api-key.apiKeyPrefix = 'Token';

var apiInstance = new MatchmoreAlpsCoreRestApi.DeviceApi();

var device = new MatchmoreAlpsCoreRestApi.DeviceUpdate(); // DeviceUpdate | The device update description.


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.updateDevice(device, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **device** | [**DeviceUpdate**](DeviceUpdate.md)| The device update description. | 

### Return type

[**Device**](Device.md)

### Authorization

[api-key](../README.md#api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

