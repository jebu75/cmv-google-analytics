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

                        if ( this.trackMapZoomChange && this.map ) {
                            this.map.on( 'extent-change', lang.hitch( this, 'onMapExtentChange' ) );
                        }

                        if ( this.trackLayerVisibility && this.map ) {

                            array.forEach( this.map.layerIds, function ( layerId ) {
                                var lyr = this.map.getLayer( layerId );
                                lyr.on( 'visibility-change', lang.hitch( this, 'onLayerVisibilityChange' ) );
                            }, this );

                        }

                        this.own( topic.subscribe( 'googleAnaytics/widgetEvent', lang.hitch( this, 'onWidgetEvent' ) ) );

                    },

                    onMapExtentChange: function( event ) {
                        /* jshint ignore:start */
                        ga('send', 'event', 'Map', 'Extent Change');
                        /* jshint ignore:end */
                    },

                    onLayerVisibilityChange: function ( event ) {

                        /* jshint ignore:start */
                        ga( 'send', 'event', 'Layers', 'Visibility Change', event.target.url, event.visible.toString() );
                        /* jshint ignore:end */

                    },

                    onWidgetEvent: function ( event ) {

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
