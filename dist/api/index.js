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

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/APIError', 'model/Device', 'model/DeviceType', 'model/DeviceUpdate', 'model/Devices', 'model/IBeaconTriple', 'model/IBeaconTriples', 'model/Location', 'model/Match', 'model/Matches', 'model/ProximityEvent', 'model/Publication', 'model/Publications', 'model/Subscription', 'model/Subscriptions', 'model/IBeaconDevice', 'model/MobileDevice', 'model/PinDevice', 'api/DeviceApi', 'api/LocationApi', 'api/MatchesApi', 'api/PublicationApi', 'api/SubscriptionApi'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('./ApiClient'), require('./model/APIError'), require('./model/Device'), require('./model/DeviceType'), require('./model/DeviceUpdate'), require('./model/Devices'), require('./model/IBeaconTriple'), require('./model/IBeaconTriples'), require('./model/Location'), require('./model/Match'), require('./model/Matches'), require('./model/ProximityEvent'), require('./model/Publication'), require('./model/Publications'), require('./model/Subscription'), require('./model/Subscriptions'), require('./model/IBeaconDevice'), require('./model/MobileDevice'), require('./model/PinDevice'), require('./api/DeviceApi'), require('./api/LocationApi'), require('./api/MatchesApi'), require('./api/PublicationApi'), require('./api/SubscriptionApi'));
  }
}(function(ApiClient, APIError, Device, DeviceType, DeviceUpdate, Devices, IBeaconTriple, IBeaconTriples, Location, Match, Matches, ProximityEvent, Publication, Publications, Subscription, Subscriptions, IBeaconDevice, MobileDevice, PinDevice, DeviceApi, LocationApi, MatchesApi, PublicationApi, SubscriptionApi) {
  'use strict';

  /**
   * _ALPS_by__MATCHMORE_httpsmatchmore_ioThe_first_version_of_the_MATCHMORE_API_is_an_exciting_step_toallow_developers_use_a_context_aware_pubsub_cloud_service___A_lotof_mobile_applications_and_their_use_cases_may_be_modeled_usingthis_approach_and_can_therefore_profit_from_using_MATCHMORE_astheir_backend_service_Build_something_great_with__ALPS_by_MATCHMORE_httpsmatchmore_ioOnce_youve__registered_yourclient_httpsmatchmore_ioaccountregister_its_easystart_using_our_awesome_cloud_based_context_aware_pubsub_admitted_a_lot_of_buzzwords__RESTful_APIWe_do_our_best_to_have_all_our_URLs_be_RESTful_httpsen_wikipedia_orgwikiRepresentational_state_transfer_Every_endpoint__URL_may_support_one_of_four_different_http_verbs__GETrequests_fetch_information_about_an_object_POST_requests_create_objectsPUT_requests_update_objects_and_finally_DELETE_requests_will_deleteobjects__Domain_ModelThis_is_the_current_domain_model_extended_by_an_ontology_of_devicesand_separation_between_the_developer_portal_and_the_ALPS_Core______________________________________Developer______Application____________________________________________________________________________________Developer_Portal__________________________________________________________________________________________________________________________ALPS_Core_______________________________________________________World__________________________________________________________________________________________________________________________________________________________Publication_________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________Match_________________________Device______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________Subscription_____________________________________________________________________________________________________________________Pin_________iBeacon______Mobile_________________________________________________________________________________________________________________________________________________Location__________________________________________1___A_developer_is_a_mobile_application_developer_registered_in_the____developer_portal_and_allowed_to_use_the_ALPS_Developer_Portal___A____developer_might_register_one_or_more_applications_to_use_the____ALPS_Core_cloud_service___For_developerapplication_pair_a_new____world_is_created_in_the_ALPS_Core_and_assigned_an_API_key_to____enable_access_to_the_ALPS_Core_cloud_service_RESTful_API___During____the_registration_the_developer_needs_to_provide_additional____configuration_information_for_each_application_e_g__its_default____push_endpoint_URI_for_match_delivery_etc_2___A__device_tagdevice_might_be_either_virtual_like_a_pin_device_or____physical_like_a_mobile_device_or_iBeacon_device___A__pin____device_tagdevice_is_one_that_has_geographical__location_taglocation_associated_with_it____but_is_not_represented_by_any_object_in_the_physical_world_usually____its_location_doesnt_change_frequently_if_at_all___A__mobile____device_tagdevice_is_one_that_potentially_moves_together_with_its_user_and____therefore_has_a_geographical_location_associated_with_it___A_mobile____device_is_typically_a_location_aware_smartphone_which_knows_its____location_thanks_to_GPS_or_to_some_other_means_like_cell_tower____triangulation_etc___An__iBeacon_device_tagdevice_represents_an_Apple____conform__iBeacon_httpsdeveloper_apple_comibeacon_announcing_its_presence_via_Bluetooth_LE____advertising_packets_which_can_be_detected_by_a_other_mobile_device_____It_doesnt_necessary_has_any_location_associated_with_it_but_it____serves_to_detect_and_announce_its_proximity_to_other_mobile____devices_3___The_hardware_and_software_stack_running_on_a_given_device_is_known____as_its_platform___This_include_its_hardware_related_capabilities____its_operating_systems_as_well_as_the_set_of_libraries__APIs____offered_to_developers_in_order_to_program_it_4___A_devices_may_issue_publications_and_subscriptions____at_any_time_it_may_also_cancel_publications_and_subscriptions____issued_previously___Publications_and_subscriptions_do_have_a____definable_finite_duration_after_which_they_are_deleted_from_the____ALPS_Core_cloud_service_and_dont_participate_anymore_in_the____matching_process_5___A__publication_tagpublication_is_similar_to_a_Java_Messaging_Service__JMS____publication_extended_with_the_notion_of_a_geographical_zone___The____zone_is_defined_as_circle_with_a_center_at_the_given_location_and____a_range_around_that_location_6___A__subscription_tagsubscription_is_similar_to_a_JMS_subscription_extended_with_the____notion_of_geographical_zone__Again_the_zone_being_defined_as____circle_with_a_center_at_the_given_location_and_a_range_around____that_location_7___Publications_and_subscriptions_which_are_associated_with_a____mobile_device_e_g__users_mobile_phone_potentially_follow_the____movements_of_the_user_carrying_the_device_and_therefore_change____their_associated_location_8___A__match_tagmatch_between_a_publication_and_a_subscription_occurs_when_both____of_the_following_two_conditions_hold____1___There_is_a_context_match_occurs_when_for_instance_the________subscription_zone_overlaps_with_the_publication_zone_or_a________proximity_event_with_an_iBeacon_device_within_the_defined________range_occurred_____2___There_is_a_content_match_the_publication_and_the_subscription________match_with_respect_to_their_JMS_counterparts_i_e__they_were________issued_on_the_same_topic_and_have_compatible_properties_and_the________evaluation_of_the_selector_against_those_properties_returns_true________value_9___A_push_notification_is_an_asynchronous_mechanism_that_allows_an____application_to_receive_matches_for_a_subscription_on_hisher_device_____Such_a_mechanism_is_clearly_dependent_on_the_devices_platform_and____capabilities___In_order_to_use_push_notifications_an_application_must____first_register_a_device__and_possibly_an_application_on_that____device_with_the_ALPS_core_cloud_service_10__Whenever_a_match_between_a_publication_and_a_subscription____occurs_the_device_which_owns_the_subscription_receives_that_match____asynchronously_via_a_push_notification_if_there_exists_a____registered_push_endpoint___A_push_endpoint_is_an_URI_which_is____able_to_consume_the_matches_for_a_particular_device_and____subscription___The_push_endpoint_doesnt_necessary_point_to_a____mobile_device_but_is_rather_a_very_flexible_mechanism_to_define____where_the_matches_should_be_delivered_11__Matches_can_also_be_retrieved_by_issuing_a_API_call_for_a____particular_device_a_idorgae4fb18a_Device_Types______________________________________________Device________________________________________________id_________________________name_______________________group_______________________________________________________________________________________________________________________________________________________________________________Pin______iBeacon___________Mobile____________________________________________________________proximityUUID_____platform_________________major_____________token____________________minor____________________________________________________________________________________________________________________________________________________________________________________________Location________________________________________a_idorg68cc0d8a_Generic_Device____id____name____groupa_idorgc430925a_PinDevice____locationa_idorgecaed9fa_iBeaconDevice____proximityUUID____major____minora_idorg7b09b62a_MobileDevice____platform____deviceToken____location.<br>
   * The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
   * <p>
   * An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
   * <pre>
   * var MatchmoreAlpsCoreRestApi = require('index'); // See note below*.
   * var xxxSvc = new MatchmoreAlpsCoreRestApi.XxxApi(); // Allocate the API class we're going to use.
   * var yyyModel = new MatchmoreAlpsCoreRestApi.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
   * and put the application logic within the callback function.</em>
   * </p>
   * <p>
   * A non-AMD browser application (discouraged) might do something like this:
   * <pre>
   * var xxxSvc = new MatchmoreAlpsCoreRestApi.XxxApi(); // Allocate the API class we're going to use.
   * var yyy = new MatchmoreAlpsCoreRestApi.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * </p>
   * @module index
   * @version 0.5.0
   */
  var exports = {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient: ApiClient,
    /**
     * The APIError model constructor.
     * @property {module:model/APIError}
     */
    APIError: APIError,
    /**
     * The Device model constructor.
     * @property {module:model/Device}
     */
    Device: Device,
    /**
     * The DeviceType model constructor.
     * @property {module:model/DeviceType}
     */
    DeviceType: DeviceType,
    /**
     * The DeviceUpdate model constructor.
     * @property {module:model/DeviceUpdate}
     */
    DeviceUpdate: DeviceUpdate,
    /**
     * The Devices model constructor.
     * @property {module:model/Devices}
     */
    Devices: Devices,
    /**
     * The IBeaconTriple model constructor.
     * @property {module:model/IBeaconTriple}
     */
    IBeaconTriple: IBeaconTriple,
    /**
     * The IBeaconTriples model constructor.
     * @property {module:model/IBeaconTriples}
     */
    IBeaconTriples: IBeaconTriples,
    /**
     * The Location model constructor.
     * @property {module:model/Location}
     */
    Location: Location,
    /**
     * The Match model constructor.
     * @property {module:model/Match}
     */
    Match: Match,
    /**
     * The Matches model constructor.
     * @property {module:model/Matches}
     */
    Matches: Matches,
    /**
     * The ProximityEvent model constructor.
     * @property {module:model/ProximityEvent}
     */
    ProximityEvent: ProximityEvent,
    /**
     * The Publication model constructor.
     * @property {module:model/Publication}
     */
    Publication: Publication,
    /**
     * The Publications model constructor.
     * @property {module:model/Publications}
     */
    Publications: Publications,
    /**
     * The Subscription model constructor.
     * @property {module:model/Subscription}
     */
    Subscription: Subscription,
    /**
     * The Subscriptions model constructor.
     * @property {module:model/Subscriptions}
     */
    Subscriptions: Subscriptions,
    /**
     * The IBeaconDevice model constructor.
     * @property {module:model/IBeaconDevice}
     */
    IBeaconDevice: IBeaconDevice,
    /**
     * The MobileDevice model constructor.
     * @property {module:model/MobileDevice}
     */
    MobileDevice: MobileDevice,
    /**
     * The PinDevice model constructor.
     * @property {module:model/PinDevice}
     */
    PinDevice: PinDevice,
    /**
     * The DeviceApi service constructor.
     * @property {module:api/DeviceApi}
     */
    DeviceApi: DeviceApi,
    /**
     * The LocationApi service constructor.
     * @property {module:api/LocationApi}
     */
    LocationApi: LocationApi,
    /**
     * The MatchesApi service constructor.
     * @property {module:api/MatchesApi}
     */
    MatchesApi: MatchesApi,
    /**
     * The PublicationApi service constructor.
     * @property {module:api/PublicationApi}
     */
    PublicationApi: PublicationApi,
    /**
     * The SubscriptionApi service constructor.
     * @property {module:api/SubscriptionApi}
     */
    SubscriptionApi: SubscriptionApi
  };

  return exports;
}));
