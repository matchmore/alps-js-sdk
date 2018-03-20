# MatchmoreAlpsCoreRestApi.Publication

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | The id (UUID) of the publication. | [optional] 
**createdAt** | **Number** | The timestamp of the publication creation in seconds since Jan 01 1970 (UTC).  | [optional] 
**worldId** | **String** | The id (UUID) of the world that contains device to attach a publication to. | 
**deviceId** | **String** | The id (UUID) of the device to attach a publication to. | 
**topic** | **String** | The topic of the publication. This will act as a first match filter. For a subscription to be able to match a publication they must have the exact same topic.  | 
**range** | **Number** | The range of the publication in meters. This is the range around the device holding the publication in which matches with subscriptions can be triggered.  | 
**duration** | **Number** | The duration of the publication in seconds. If set to &#39;0&#39; it will be instant at the time of publication. Negative values are not allowed.  | 
**properties** | **Object** | The dictionary of key, value pairs. Allowed values are number, boolean, string and array of afformentioned types | 


