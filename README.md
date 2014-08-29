cmv-layer-swapper
=================

v0.1
Google analytics widget for [David Spriggs Configurable Map Viewer](https://github.com/DavidSpriggs/ConfigurableViewerJSAPI) 

Widget designed to send google analytics tracking messages.  This is an early version and the type of standard events is pretty limited.  
Widget developers can publish tracking events to 'googleAnalytics/widgetEvent' as follows:

```
topic.publish( 'googleAnaytics/widgetEvent', {
     category: 'Widget Event',
     action: 'Visible Layer Change',
     label: 'Layer Swapper',
     value: lyr.label
 } );
```


To configure the in your project

1. Copy the GoogleAnalytics.js file into your viewer/js/gis/dijit directory
2. Add the following to your CMV viewer config file

```
googleAnalytics: {
    include: true,
    id: 'googAnalytics',
    type: 'invisible',
    path: 'gis/dijit/GoogleAnalytics',
    options: {
        map: true,  //reguired to track map and layer events
        gaAccount: 'UA-XXX00774-02',
        trackLayerVisibility: true,  //track layer visibility changes
        trackMapZoomChange: true,  //track map extent changes
        trackWidgetEvents: true    //track custom widget events
    }
}
```

Looking for input on what type of standard events would be useful to track from the CMV.