# MatchmoreAlpsCoreRestApi.Location

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**createdAt** | **Number** | The timestamp of the location creation in seconds since Jan 01 1970 (UTC).  | [optional] 
**latitude** | **Number** | The latitude of the device in degrees, for instance &#39;46.5333&#39; (Lausanne, Switzerland).  | [default to 0.0]
**longitude** | **Number** | The longitude of the device in degrees, for instance &#39;6.6667&#39; (Lausanne, Switzerland).  | [default to 0.0]
**altitude** | **Number** | The altitude of the device in meters, for instance &#39;495.0&#39; (Lausanne, Switzerland).  | [default to 0.0]
**horizontalAccuracy** | **Number** | The horizontal accuracy of the location, measured on a scale from &#39;0.0&#39; to &#39;1.0&#39;, &#39;1.0&#39; being the most accurate. If this value is not specified then the default value of &#39;1.0&#39; is used.  | [optional] [default to 1.0]
**verticalAccuracy** | **Number** | The vertical accuracy of the location, measured on a scale from &#39;0.0&#39; to &#39;1.0&#39;, &#39;1.0&#39; being the most accurate. If this value is not specified then the default value of &#39;1.0&#39; is used.  | [optional] [default to 1.0]


