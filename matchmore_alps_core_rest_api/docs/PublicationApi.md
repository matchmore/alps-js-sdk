# MatchmoreAlpsCoreRestApi.PublicationApi

All URIs are relative to *https://api.matchmore.io/v5*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createPublication**](PublicationApi.md#createPublication) | **POST** /devices/{deviceId}/publications | Create a publication for a device
[**deletePublication**](PublicationApi.md#deletePublication) | **DELETE** /devices/{deviceId}/publications/{publicationId} | Delete a Publication
[**getPublication**](PublicationApi.md#getPublication) | **GET** /devices/{deviceId}/publications/{publicationId} | Info about a publication on a device
[**getPublications**](PublicationApi.md#getPublications) | **GET** /devices/{deviceId}/publications | Get all publications for a device


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

var apiInstance = new MatchmoreAlpsCoreRestApi.PublicationApi();

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

var apiInstance = new MatchmoreAlpsCoreRestApi.PublicationApi();

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

var apiInstance = new MatchmoreAlpsCoreRestApi.PublicationApi();

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

var apiInstance = new MatchmoreAlpsCoreRestApi.PublicationApi();

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

