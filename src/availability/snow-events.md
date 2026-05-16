---
title: "Availability: What was the impact of snow events?"
---

```js
import {formatDate, formatPercent, sparkbar} from '../lib/helpers.js'
import {flex_observations} from '../data/communauto.js'
```

# Availability: What was the impact of snow events?

The [general availability analysis](/availability/) showed that late November / early December had a sudden one-week plunge in availability. Let’s redraw that plot, but show availability by _day_ instead of by week.

```js
const snow_events = [
    {x1: new Date("2025-12-10"), x2: new Date("2025-12-12")},
    {x1: new Date("2026-01-15"), x2: new Date("2026-01-16")},
    {x1: new Date("2026-01-25"), x2: new Date("2026-01-27")},
    {x1: new Date("2026-03-13"), x2: new Date("2026-03-14")},
]
```

```js
Plot.plot({
    width,
    marks: [
        Plot.rect(
            [{ x1: new Date("2025-11-25"), x2: new Date("2025-12-10") }],
            {
                x1: "x1",
                x2: "x2",
                fill: "currentColor",
                fillOpacity: 0.1
            }
        ),
        Plot.rect(
            snow_events.slice(0,1),
            {
                x1: "x1",
                x2: "x2",
                fill: "currentColor",
                fillOpacity: 0.2
            }
        ),
        Plot.lineY(
            aq.from(flex_observations)
                .groupby('datestamp', 'CarNo')
                .count()
                .groupby('datestamp')
                .count()
                .objects(),
            {
                x: "datestamp",
                y: "count",
                tip: true
            }
        ),
        Plot.ruleY([30], {
            stroke: "currentColor",
            strokeDasharray: "1, 2",
            strokeDashoffset: 1
        })
    ]
})
```

Fascinating. We now see the plunge in more detail: around November 25, availability went from the mid-20s to the low-10s. (A loss of ~15 cars!) On December 10, it spiked back up briefly, was down again on the 11th, then returned to normal (and continued upward) by the 12th.

What caused this?

On December 10, Communauto announced a “Free FLEX Use” period due to weather conditions, from 4pm that day until 11am December 12. During this period, you could borrow a FLEX car with no hourly billing.

Since FLEX cars are parked on city streets, this promo serves the dual purpose of being good citizens and satisfying the requirements of residential parking norms—when there’s a major snowstorm and the city declares a weather event, it’s good behaviour (and sometimes required) to clear your car from the road. But it only works if people take Communauto up on the offer.

The downward spike on December 11 suggests that it did, since there were only ten cars observed as available in total that day. The week leading up to the event is interesting. My hunch is that, with bad weather in the forecast, Communauto artificially took cars offline to test how quickly people would take them up on the free car promo. (The data suggest this, but my hunch is also informed from observing at least one car near me that had been parked for a week, but unavailable in the app!)

The first snow event was the longest, so it shows up most clearly in the data, but we also see subsequent events, to varying extents (the downward spike will only show if the event was longer than a day, because of how this chart aggregates data):

<!-- [TODO: zoom into this period, see the _minimum_ and _maximum_ car availability per day, maybe show it by hour or so—I imagine it went to 0 during the snow event]] -->

```js
Plot.plot({
    width,
    marks: [
        Plot.rect(
            [{ x1: new Date("2025-11-25"), x2: new Date("2025-12-10") }],
            {
                x1: "x1",
                x2: "x2",
                fill: "currentColor",
                fillOpacity: 0.1
            }
        ),
        Plot.rect(
            snow_events,
            {
                x1: "x1",
                x2: "x2",
                fill: "currentColor",
                fillOpacity: 0.2
            }
        ),
        Plot.lineY(
            aq.from(flex_observations)
                .groupby('datestamp', 'CarNo')
                .count()
                .groupby('datestamp')
                .count()
                .objects(),
            {
                x: "datestamp",
                y: "count",
                tip: true
            }
        ),
        Plot.ruleY([30], {
            stroke: "currentColor",
            strokeDasharray: "1, 2",
            strokeDashoffset: 1
        })
    ]
})
```
