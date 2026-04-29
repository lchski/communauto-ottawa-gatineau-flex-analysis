import {FileAttachment} from "observablehq:stdlib"
import * as d3 from "npm:d3"
import * as aq from "npm:arquero"

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

export const flex_observations_stopovers = aq.from(flex_observations)
  .orderby('timestamp')
  .groupby('CarNo', 'LastUseDate')
  .slice(-1)
  .objects()
  .map(d => ({
    ...d,
    // isCurrent: d.timestamp == observations_last_timestamp // TODO: if we want "current" data (e.g., in a refreshable page, see issue #9), uncomment this
    isCurrent: false
  }))
