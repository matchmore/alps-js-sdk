# MatchmoreAlpsCoreRestApi.Device

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | The id (UUID) of the device. | [optional] 
**createdAt** | **Number** | The timestamp of the device&#39;s creation in seconds since Jan 01 1970 (UTC).  | [optional] 
**updatedAt** | **Number** | The timestamp of the device&#39;s creation in seconds since Jan 01 1970 (UTC).  | [optional] 
**group** | **[String]** | Optional device groups, one device can belong to multiple groups, grops are string that can be max 25 characters long and contains letters numbers or underscores | [optional] 
**name** | **String** | The name of the device. | [optional] [default to &#39;&#39;]
**deviceType** | [**DeviceType**](DeviceType.md) |  | 


