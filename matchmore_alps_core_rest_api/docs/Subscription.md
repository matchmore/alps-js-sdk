# MatchmoreAlpsCoreRestApi.Subscription

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | The id (UUID) of the subscription. | [optional] 
**createdAt** | **Number** | The timestamp of the subscription creation in seconds since Jan 01 1970 (UTC).  | [optional] 
**worldId** | **String** | The id (UUID) of the world that contains device to attach a subscription to. | 
**deviceId** | **String** | The id (UUID) of the device to attach a subscription to. | 
**topic** | **String** | The topic of the subscription. This will act as a first match filter. For a subscription to be able to match a publication they must have the exact same topic.  | 
**selector** | **String** | This is an expression to filter the publications. For instance &#39;job&#x3D;&#39;developer&#39;&#39; will allow matching only with publications containing a &#39;job&#39; key with a value of &#39;developer&#39;.  | 
**range** | **Number** | The range of the subscription in meters. This is the range around the device holding the subscription in which matches with publications can be triggered.  | 
**duration** | **Number** | The duration of the subscription in seconds. If set to &#39;0&#39; it will be instant at the time of subscription. Negative values are not allowed.  | 
**matchTTL** | **Number** | The duration of the match in seconds, this describes how often you will get matches when publication and subscription are moving in each other range. If set to &#39;0&#39; you will get matches every time publication or subscription in range will move. Negative values are not allowed.  | [optional] 
**pushers** | **[String]** | When match will occurs, they will be notified on these provided URI(s) address(es) in the pushers array.  | [optional] 


