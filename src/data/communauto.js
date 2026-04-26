import {FileAttachment} from "observablehq:stdlib"
import * as d3 from "npm:d3"

const flex_observations_raw = await FileAttachment('../data/communauto/flex-location-observations.tsv').tsv({typed: true})

export const flex_observations = flex_observations_raw
    .map(d => ({
        ...d,
        datestamp: d3.timeDay.floor(new Date(d.timestamp)),
        timestamp_normalized: d3.timeHour.floor(new Date(d.timestamp))
    }))
    .filter(d => {
        if (d.LastUseDate === "") {
            return false
        }

        if (new Date(d.LastUseDate) < new Date("2025-10-16")) {// TODO: fix magic number date
            return false
        }

        return true
    })

export const observations_last_timestamp = d3.max(flex_observations_raw, d => d.timestamp)


