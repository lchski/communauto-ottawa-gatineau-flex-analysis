---
title: Car availability [TODO]
---

```js
import {formatDate, formatPercent, sparkbar} from './lib/helpers.js'
import {flex_observations} from './data/communauto.js'
```

# Car availability

The [pilot project announcement](https://ontario.communauto.com/ottawa/the-cities-of-ottawa-and-gatineau-approve-the-launch-of-communautos-flex-carsharing-service/) indicated that 30 cars would be in service. Communauto lived up to this promise! There were ${availability_by_car.length} unique cars in service during this period.

```js
const availability_by_car = aq.from(flex_observations)
        .groupby('CarNo')
        .rollup({
            first_seen: d => aq.op.min(d.timestamp),
            last_seen: d => aq.op.max(d.timestamp),
            n_days_seen: d => aq.op.distinct(d.datestamp),
            n_observations: d => aq.op.distinct(d.timestamp_normalized),
        })
        .orderby('first_seen', 'CarNo')
        .objects()
        .map(d => ({
            ...d,
            n_days_first_last_seen: d3.timeDay.count(d.first_seen, d.last_seen)
        }))
        .map(d => ({
            ...d,
            pct_days_seen_vs_service: d.n_days_seen / d.n_days_first_last_seen
        }))

const selected_car = view(Inputs.table(
    availability_by_car,
    {
        columns: [
            'CarNo',
            'first_seen',
            'last_seen',
            'n_days_seen',
            'pct_days_seen_vs_service'
        ],
        header: {
            CarNo: 'Car #',
            first_seen: 'First seen',
            last_seen: 'Last seen',
            n_days_seen: 'Days observed',
            n_observations: 'Hours observed',
            pct_days_seen_vs_service: '% days observed versus in service'
        },
        format: {
            CarNo: x => x,
            n_days_seen: sparkbar(d3.max(availability_by_car, d => d.n_days_seen)),
            n_observations: sparkbar(d3.max(availability_by_car, d => d.n_observations)),
            first_seen: formatDate,
            last_seen: formatDate,
            pct_days_seen_vs_service: formatPercent
        },
        select: false
    }
))
```

The table shows that it took a few weeks for all the cars to come into service: most were active in the first days, but the remainder came online toward the end of October and beginning of November. (Except one, #12013, which only showed up at the end of November!)

How consistently were these cars available? (Note that “available” is a combination of both Communauto member behaviour—i.e., people renting the cars—and Communauto service needs, like taking cars offline for maintenance.)

```js
Plot.plot({
    width,
    marks: [
        Plot.lineY(
            aq.from(flex_observations.map(d => ({
                ...d,
                weekstamp: d3.timeWeek.floor(d.timestamp)
            })))
                .groupby('weekstamp', 'CarNo')
                .count()
                .groupby('weekstamp')
                .count()
                .objects(),
            {
                x: "weekstamp",
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

```js
const least_available_car = d3.sort(availability_by_car, (a, b) => d3.ascending(a.n_days_seen, b.n_days_seen))[0]
```

This chart tells us that there was never a week where all 30 cars were observed to be in service at once. This isn’t a huge surprise, given the combination of expected usage and maintenance. (The chart also tells us that something odd happened in early December—we’ll come back to that shortly.)

We can see, looking back at the table of cars, that one wasn’t like the others: #${least_available_car.CarNo} was only in service between ${formatDate(least_available_car.first_seen)} and ${formatDate(least_available_car.last_seen)} (${d3.timeDay.count(least_available_car.first_seen, least_available_car.last_seen)} days total). Of this time, it was only actually observed (i.e., available to rent at some point that day) on ${least_available_car.n_days_seen} days (${formatPercent(least_available_car.pct_days_seen_vs_service)}% of the total days in service).

These questions are most fun at scale: when did cars enter service (cross), for how long were they in service (dot), and when did they go out of service (triangle)?

```js
Plot.plot({
    marginLeft: 60,
    fy: {
        label: "Car",
        tickFormat: d => String(d)
    },
    x: {
        label: "Date"
    },
    width,
    marks: [
        Plot.dot(
            aq.from(flex_observations)
                .groupby('datestamp', 'CarNo')
                .count()
                .orderby('CarNo', 'datestamp')
                .groupby('CarNo')
                .derive({
                    _row: () => aq.op.row_number(),
                    _n:   () => aq.op.count(),
                })
                .filter(d => d._row > 1 && d._row < d._n) // drop first (1) and last (_n)
                .select(aq.not('_row', '_n')) // remove temp columns
                .objects(),
            {
                x: "datestamp",
                fy: "CarNo",
                fill: "currentColor",
                fillOpacity: 0.5
            }
        ),
        Plot.dot(
            aq.from(flex_observations)
                .groupby('datestamp', 'CarNo')
                .count()
                .groupby('CarNo')
                .slice(0, 1)
                .objects(),
            {
                x: "datestamp",
                fy: "CarNo",
                symbol: "cross",
                fill: "currentColor",
                r: 4
            }
        ),
        Plot.dot(
            aq.from(flex_observations)
                .groupby('datestamp', 'CarNo')
                .count()
                .groupby('CarNo')
                .slice(-1)
                .objects(),
            {
                x: "datestamp",
                fy: "CarNo",
                symbol: "triangle",
                fill: "currentColor",
                r: 4
            }
        )
    ]
})
```

Ah #10694, we hardly knew ya. May you live a similar fate to #11018, and come back into service soon. (As of the time of writing, mid-May 2026, #10694 remains lost to the ether.)


## What happened in December!?

We saw earlier that late November / early December showed a sudden one-week plunge in availability. Let’s redraw that plot, but show availability by _day_ instead of by week.

```js
Plot.plot({
    width,
    marks: [
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

Fascinating. We now see the plunge in more detail: around November 29, availability went from the mid-20s to the low-10s. (A loss of ~15 cars!) On December 10, it spiked back up briefly, was down again on the 11th, then returned to normal (and continued upward) by the 12th.

What caused this?

On December 10, Communauto announced a “Free FLEX Use” period due to weather conditions, from 4pm that day until 11am December 12. [TKTK: Communauto seems to have temporarily blocked cars in anticipation of this event, to see how quickly they were taken off the road]

[TODO: zoom into this period, see the _minimum_ and _maximum_ car availability per day, maybe show it by hour or so—I imagine it went to 0 during the snow event]]

...TKTK...
