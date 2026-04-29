import {FileAttachment} from "observablehq:stdlib"
import * as shapefile from "npm:shapefile"
import * as Plot from "npm:@observablehq/plot";

import {formatDatetime} from './helpers.js';

const roads = await shapefile.read(
	...(await Promise.all([
		FileAttachment("../data/ottawa.ca/Road_Centrelines_simplify_25.shp").stream(),
		// FileAttachment("../data/ottawa.ca/Road_Centrelines_simplify_25.dbf").stream()
	]))
)

const ons_neighbourhoods = await shapefile.read(
	...(await Promise.all([
		FileAttachment("../data/ottawa.ca/ons_boundaries.shp").stream()
	]))
)

const wards = await FileAttachment("../data/ottawa.ca/wards_2022_to_2026-optim.geojson").json()

const voie_publique = await shapefile.read(
	...(await Promise.all([
		FileAttachment("../data/gatineau.ca/VOIE_PUBLIQUE.shp").stream()
	]))
)

const ottawa_residential_parking_zones = await FileAttachment("../data/ottawa.ca/residential_parking_zones.geojson").json()

const ottawa_residential_parking_roads = await FileAttachment("../data/ottawa.ca/residential_parking_roads.geojson").json()

export const basemap_components = [
    Plot.geo(wards, {strokeWidth: 0.3}),
    Plot.geo(ons_neighbourhoods, {strokeWidth: 0.2}),
    Plot.geo(roads, {strokeWidth: 0.15}),
    Plot.geo(voie_publique, {strokeWidth: 0.15}),
]

export const parkingmap_components = [
	Plot.geo(ottawa_residential_parking_zones, {strokeDasharray: "3,5", strokeOpacity: 0.5}),
	Plot.geo(
		ottawa_residential_parking_roads.features.filter(d => d.properties.Parking_Regulations !== 3), // 3 seems to be "no parking for permit holders", 1 and 2 both "parking permit okay"
		{
			strokeOpacity: 0.2,
			stroke: "green"
		}
	)
]

export const observations_to_geojson = (observations_to_convert) => {
	const observations_geojson = {
		type: "FeatureCollection",
		features: []
	}
	
	observations_to_convert.forEach(observation => {
		const feature = {
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: [observation.Longitude, observation.Latitude]
			},
			properties: {
				...observation
			}
		}
		
		observations_geojson.features.push(feature)
	})
	
	return observations_geojson;
}

export const plot_parking_observations = (observations_to_plot, options = {fill: "isCurrent", fillOpacity: 1}) => Plot.geo(observations_to_plot, {
	fill: options.fill,
	fillOpacity: options.fillOpacity,
	channels: {
		car: {
			label: "Car #",
			value: d => `${d.properties.CarNo}`,
		},
		parked_at: {
			label: "Parked at",
			value: d => formatDatetime(d.properties.LastUseDate),
		},
		last_seen: {
			label: "Last seen",
			value: d => formatDatetime(d.properties.timestamp),
		},
		// is_current: { // TODO: if we want "current" data (e.g., in a refreshable page, see issue #9), uncomment this
		// 	label: "Current location (approx)",
		// 	value: d => d.properties.isCurrent ? `✅` : `❌`,
		// },
		hours_parked: {
			label: "Hours parked (approx)",
			value: d => d.properties.LastUse
		}
	},
	tip: {
		format: {
			fill: false,
			x: false,
			y: false,
			symbol: false
		}
	}
})
