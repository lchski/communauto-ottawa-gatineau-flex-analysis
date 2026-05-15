---
title: Parking locations [TODO]
---

```js
import {flex_observations_stopovers, flex_observations_stopovers_geo} from './data/communauto.js'
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
    plot_parking_observations(flex_observations_stopovers_geo, {fill: "currentColor", fillOpacity: 0.25}),
	]
})
```

That’s a lot of dots! (${flex_observations_stopovers_geo.features.length.toLocaleString()}, to be precise.) Let’s make it a heatmap.

```js
Plot.plot({
  title: "Heatmap: Parking locations of Communauto FLEX cars in Ottawa/Gatineau",
  subtitle: `October 2025–April 2026`, // TODO: make this dynamic or at least consolidated
  projection: {
    type: "mercator",
    domain: flex_observations_stopovers_geo,
    inset: 50
  },
  color: {
    scheme: "Greens"
  },
  marks: [
		...basemap_components,
    Plot.density(flex_observations_stopovers, {
      x: "Longitude",
      y: "Latitude",
      fill: "density",
      fillOpacity: 0.5,
      bandwidth: 20,
    }),
    plot_observations_in_heatmap ? plot_parking_observations(flex_observations_stopovers_geo, {fill: "currentColor", fillOpacity: 0.05}) : null
	]
})
```

The darker an area in the heatmap, the more often cars were parked there. To see it with all the dots, use this toggle:

```js
const plot_observations_in_heatmap = view(Inputs.toggle({label: "Show all parking locations in heatmap"}))
```

Where cars are parked is a function of two things: people’s trips (wherever they’re going to and from); where it’s possible to find in-zone, permit parking. From experience, I can confirm that the latter sometimes leaves you a distance from the former!

With this in mind, some observations:

- Three hotspots in Ottawa feel like they cluster at or near the edge of the parking zone:
  - The north edge of Sandy Hill, especially near Byward, but along the entire length. I wonder how many people going to or from the blocks north of Rideau are using cars and parking them along Besserer or Daly, the first available streets in Sandy Hill.
  - Centretown near Bay and Nepean. A good jumping off point for both downtown offices and the retail and dining along Somerset.
  - Little Italy near City Centre. City Centre itself feels like a destination (along with nearby attractions like the climbing gym), but I also wonder how many are parking here to go further into Hintonburg.
- In Gatineau, there’s a clear “preferred” spot to park (or a couple power users) in the two streets paralleling Boulevard Maisonneuve. There are also a few minor hotspots, though the intensity is diminished because of how much more usage occurs in Ottawa.

The Sandy Hill and City Centre hotspots feel like strong candidates for pushing the parking zones (north or west as the case may be), though this may be complicated by [Ottawa’s parking bylaws](/bylaw-confusion). Pushing the Centretown zone further north is likely impractical, given the nature of on-street parking in the downtown core.

The situation in Gatineau is a bit more complicated—since the zone only included Hull, which is an island, the area attractions are actually closest to the _centre_ of the parking zone, instead of being at its edges. I’m also less familiar with Gatineau in general, so have less a sense of where else there may be demand.

