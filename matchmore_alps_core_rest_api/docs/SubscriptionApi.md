# MatchmoreAlpsCoreRestApi.SubscriptionApi

All URIs are relative to *https://api.matchmore.io/v5*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createSubscription**](SubscriptionApi.md#createSubscription) | **POST** /devices/{deviceId}/subscriptions | Create a subscription for a device
[**deleteSubscription**](SubscriptionApi.md#deleteSubscription) | **DELETE** /devices/{deviceId}/subscriptions/{subscriptionId} | Delete a Subscription
[**getSubscription**](SubscriptionApi.md#getSubscription) | **GET** /devices/{deviceId}/subscriptions/{subscriptionId} | Info about a subscription on a device
[**getSubscriptions**](SubscriptionApi.md#getSubscriptions) | **GET** /devices/{deviceId}/subscriptions | Get all subscriptions for a device


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

var apiInstance = new MatchmoreAlpsCoreRestApi.SubscriptionApi();

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

var apiInstance = new MatchmoreAlpsCoreRestApi.SubscriptionApi();

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

var apiInstance = new MatchmoreAlpsCoreRestApi.SubscriptionApi();

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

var apiInstance = new MatchmoreAlpsCoreRestApi.SubscriptionApi();

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

