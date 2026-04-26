---
title: Parking locations [TODO]
---

```js
import {flex_observations} from './data/communauto.js'
import {basemap_components, observations_to_geojson} from './lib/maps.js'
```

# Parking locations
## Where’d all those cars park?


```js
Plot.plot({
  title: "Current / historic: Parking locations of Communauto FLEX cars in Ottawa/Gatineau",
//   subtitle: `Data last pulled at: ${formatTime(observations_last_timestamp)}`,
  projection: {
    type: "mercator",
    domain: observations_to_geojson(flex_observations),
    inset: 50
  },
  marks: [
		...basemap_components,
        // plot_parking_observations(),
	]
})
```