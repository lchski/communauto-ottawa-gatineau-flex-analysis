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
        )
    ]
})
```

```js
const least_available_car = d3.sort(availability_by_car, (a, b) => d3.ascending(a.n_days_seen, b.n_days_seen))[0]
```

This chart tells us that there was never a week where all 30 cars were observed to be in service at once. This isn’t a huge surprise, given the combination of expected usage and maintenance. 

But we can also see, looking back at the table of cars, that one wasn’t like the others: #${least_available_car.CarNo} was only in service between ${formatDate(least_available_car.first_seen)} and ${formatDate(least_available_car.last_seen)} (${d3.timeDay.count(least_available_car.first_seen, least_available_car.last_seen)} days total). Of this time, it was only actually observed (i.e., available to rent at some point that day) on ${least_available_car.n_days_seen} days (${formatPercent(least_available_car.pct_days_seen_vs_service)}% of the total days in service).

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
        
    ]
})
```

```js
Plot.plot({
    width,
    marks: [
        Plot.dot(
            aq.from(flex_observations)
                .groupby('datestamp', 'CarNo')
                .count()
                .objects(),
            {
                x: "datestamp",
                fy: "CarNo",
                strokeOpacity: 0.5
            }
        )
    ]
})
```

