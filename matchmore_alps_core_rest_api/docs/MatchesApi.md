# MatchmoreAlpsCoreRestApi.MatchesApi

All URIs are relative to *https://api.matchmore.io/v5*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getMatch**](MatchesApi.md#getMatch) | **GET** /devices/{deviceId}/matches/{matchId} | Get match for the device by its id
[**getMatches**](MatchesApi.md#getMatches) | **GET** /devices/{deviceId}/matches | Get matches for the device


<a name="getMatch"></a>
# **getMatch**
> Match getMatch(deviceId, matchId)

Get match for the device by its id

### Example
```javascript
var MatchmoreAlpsCoreRestApi = require('matchmore_alps_core_rest_api');

var apiInstance = new MatchmoreAlpsCoreRestApi.MatchesApi();

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

No authorization required

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

var apiInstance = new MatchmoreAlpsCoreRestApi.MatchesApi();

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

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

