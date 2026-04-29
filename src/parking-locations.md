---
title: Parking locations [TODO]
---

```js
import {flex_observations_stopovers_geo} from './data/communauto.js'
import {basemap_components, parkingmap_components, observations_to_geojson, plot_parking_observations} from './lib/maps.js'
```

# Parking locations
## Where’d all those cars park?

Because we can, here’s the most literal answer to the question: a map of every location where a FLEX car parked during the first six months of the pilot.

```js
Plot.plot({
  title: "Parking locations of Communauto FLEX cars in Ottawa/Gatineau",
  subtitle: `October 2025–April 2026`, // TODO: make this dynamic or at least consolidated
  projection: {
    type: "mercator",
    domain: flex_observations_stopovers_geo,
    inset: 50
  },
  marks: [
		...basemap_components,
    ...parkingmap_components,
    plot_parking_observations(flex_observations_stopovers_geo),
	]
})
```
