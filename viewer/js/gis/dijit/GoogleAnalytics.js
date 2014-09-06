define ( [
             'dojo/_base/declare',
             'dijit/_WidgetBase',
             'dojo/_base/array',
             'dojo/_base/lang',
             'dojo/_base/kernel',
             'dojo/on',
             'dojo/topic',
             'esri/lang',
             'esri/InfoTemplate',
             'esri/dijit/PopupTemplate',
             'esri/layers/FeatureLayer'
         ], function ( declare, _WidgetBase, array, lang, kernel, on, topic  ) {

             return declare( [ _WidgetBase ], {


                 postCreate: function () {

                     this.initGaFunction();

                     /* jshint ignore:start */
                     ga('create', this.gaAccount, 'auto');
                     ga('send', 'pageview');
                     /* jshint ignore:end */

                     this.initEventHandlers();

                 },

                 constructor: function( options ) {

                     options = options || {};
                     if ( !options.gaAccount ) {
                         //console.log( 'gaAccount required!' );
                         return;
                     }
                     declare.safeMixin( this, {
                         map: null,
                         gaAccount: null,
                         events: { map: [], layer: [], widget: [] },
                         trackLayerVisibility: false,
                         trackMapZoomChange: false,
                         trackWidgetEvents: false
                     }, options );

                 },

                 initGaFunction: function () {

                     /* jshint ignore:start */
                     (function(i, s, o, g, r, a, m){
                         i.GoogleAnalyticsObject = r; // Acts as a pointer to support renaming.

                         // Creates an initial ga() function.  The queued commands will be executed once analytics.js loads.
                         i[r] = i[r] || function() {
                             (i[r].q = i[r].q || []).push(arguments);
                         },

                             // Sets the time (as an integer) this tag was executed.  Used for timing hits.
                             i[r].l = 1 * new Date();

                         // Insert the script tag asynchronously.  Inserts above current tag to prevent blocking in
                         // addition to using the async attribute.
                         a = s.createElement(o),
                             m = s.getElementsByTagName(o)[0];
                         a.async = 1;
                         a.src = g;
                         m.parentNode.insertBefore(a, m);
                     })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
                     /* jshint ignore:end */

                 },

                 initEventHandlers: function () {

                     this.initMapEvents ();
                     this.initLayerEvents ();
                     this.initTitlePaneEvents ();
                     this.own( topic.subscribe( 'googleAnalytics/events', lang.hitch( this, 'onTopicEvent' ) ) );

                 },

                 initMapEvents: function () {

                     if ( !this.map ) {
                         return;
                     }

                     var mapEvents = this.events.map;
                     array.forEach ( mapEvents, function ( mapEvent ) {

                                         this.map.on ( mapEvent, lang.hitch ( this, 'onMapEventFired', mapEvent ) );

                                     }, this
                     );

                 },

                 initLayerEvents: function () {

                     if ( !this.map ) {
                         return;
                     }

                     var layerEvents = this.events.layer;
                     array.forEach ( layerEvents, function ( layerEvent ) {

                                         array.forEach ( this.map.layerIds, function ( layerId ) {
                                                             var lyr = this.map.getLayer ( layerId );
                                                             lyr.on ( layerEvent, lang.hitch ( this, 'onLayerEventFired', layerEvent ) );
                                                         }, this
                                         );

                                     }, this
                     );

                 },

                 initTitlePaneEvents: function () {

                     if ( this.events.titlePane.length > 0 ) {
                         this.own( topic.subscribe( 'widgetState/events', lang.hitch( this, 'onTitlePaneEventFired' ) ) );
                     }

                 },

                 onMapEventFired: function( eventType ) {

                     /* jshint ignore:start */
                     ga('send', 'event', 'Map', eventType, eventType );
                     /* jshint ignore:end */

                 },

                 onLayerEventFired: function( eventType, event ) {

                     /* jshint ignore:start */
                     ga('send', 'event', 'Layer', eventType, event.target.id, event.target.url );
                     /* jshint ignore:end */

                 },

                 onTitlePaneEventFired: function ( event ) {

                     if ( event.action && this.events.titlePane.indexOf( event.action ) > -1 ) {
                         this.onTopicEvent( event );
                     }

                 },

                 onTopicEvent: function ( event ) {
                     /* jshint ignore:start */
                     var msg = lang.mixin(
                         {
                             category: null,
                             action: null,
                             label: null,
                             value: null
                         },
                         event
                     );

                     ga( 'send', 'event', msg.category, msg.action, msg.label, msg.value );
                     /* jshint ignore:end */


                 }

             } );


         }

);
