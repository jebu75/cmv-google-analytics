cmv-google-analytics
====================

v1.0.1
Google analytics widget for [David Spriggs Configurable Map Viewer](https://github.com/DavidSpriggs/ConfigurableViewerJSAPI) 

Widget designed to send google analytics tracking messages.  This is an early version and the type of standard events is pretty limited.  
Widget developers can publish tracking events to 'googleAnalytics/events' as follows:

```
topic.publish( 'googleAnalytics/events', {
     category: 'Widget Event',
     action: 'Visible Layer Change',
     label: 'Layer Swapper',
     value: true
 } );
```


To configure the in your project

1. Copy the GoogleAnalytics.js file into your viewer/js/gis/dijit directory
2. Add the following to your CMV viewer config file

```javascript
googleAnalytics: {
    include: true,
    id: 'googAnalytics',
    type: 'invisible',
    path: 'gis/dijit/GoogleAnalytics',
    options: {
        map: true,  //reguired to track map and layer events
        gaAccount: 'UA-XXX00774-02',
        events: {
            map: ['extent-change','basemap-change' ], //array of map events, see api docs for event you can listen for
            layer: [ 'visibility-change', 'update-end' ], //array of layer events, see api docs for event you can listen for
            titlePane: [ 'open', 'close', 'dock', 'undock' ] //array of widget events  [ 'open', 'close', 'dock', 'undock' ]
        }
    }
}
```

Looking for input on what type of standard events would be useful to track from the CMV.

* Special note - this version requires the changes to FloatingPaneTitlePane.js to work fully.  Not incorporating these additions into your will not break anything but widget events will not be sent.

2 event listeners added in the postCreate method:
```javascript
on(this, 'show', lang.hitch(this, '_onOpenClose', true));
on(this, 'hide', lang.hitch(this, '_onOpenClose', false));
```

And two additional methods:
```javascript
_updateTopic: function ( msg ) {
    topic.publish( 'widgetState/events', {
        category: 'Widget Event',
        action: msg,
        label: this.title,
        value: msg
    } );

},
_onOpenClose: function( isOpen ) {
    var evt = isOpen ? 'open' : 'close';
    this._updateTopic( evt );
}
```
also, dojo/topic added to list of module dependencies

