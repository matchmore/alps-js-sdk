# MatchmoreAlpsCoreRestApi.LocationApi

All URIs are relative to *https://api.matchmore.io/v5*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createLocation**](LocationApi.md#createLocation) | **POST** /devices/{deviceId}/locations | Create a new location for a device


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

var apiInstance = new MatchmoreAlpsCoreRestApi.LocationApi();

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

