---
title: Car availability 
---

# Car availability

The [pilot project announcement](https://ontario.communauto.com/ottawa/the-cities-of-ottawa-and-gatineau-approve-the-launch-of-communautos-flex-carsharing-service/) indicated that 30 cars would be in service. Communauto lived up to this promise! There were 30 unique cars in service during this period.

```js
const formatDate = d3.timeFormat("%B %d, %Y");

function sparkbar(max) {
    return (x) => htl.html`<div style="
        background: var(--theme-green);
        color: black;
        font: 10px/1.6 var(--sans-serif);
        width: ${100 * x / max}%;
        float: right;
        padding-right: 3px;
        box-sizing: border-box;
        overflow: visible;
        display: flex;
        justify-content: end;">${x.toLocaleString("en-US")}`
}

const availability_by_car = aq.from(flex_observations)
        .groupby('CarNo')
        .rollup({
            first_seen: d => aq.op.min(d.timestamp),
            last_seen: d => aq.op.max(d.timestamp),
            n_days: d => aq.op.distinct(d.datestamp),
            n_observations: d => aq.op.distinct(d.timestamp_normalized),
        })
        .orderby('first_seen', 'CarNo')
        .objects()

display(Inputs.table(
    availability_by_car,
    {
        header: {
            CarNo: 'Car #',
            first_seen: 'First seen',
            last_seen: 'Last seen',
            n_days: 'Days observed',
            n_observations: 'Hours observed',
        },
        format: {
            CarNo: x => x,
            n_days: sparkbar(d3.max(availability_by_car, d => d.n_days)),
            n_observations: sparkbar(d3.max(availability_by_car, d => d.n_observations)),
            first_seen: formatDate,
            last_seen: formatDate
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

This chart tells us that there was never a week where all 30 cars were observed to be in service at once. This isn’t a huge surprise: presumably 

```js
const flex_observations_raw = FileAttachment('data/communauto/flex-location-observations.tsv').tsv({typed: true})
```

```js
flex_observations_raw
```

```js
const flex_observations = flex_observations_raw
    .map(d => ({
        ...d,
        datestamp: d3.timeDay.floor(new Date(d.timestamp)),
        timestamp_normalized: d3.timeHour.floor(new Date(d.timestamp))
    }))
    .filter(d => {
        if (d.LastUseDate === "") {
            return false
        }

        if (new Date(d.LastUseDate) < new Date("2025-10-16")) {
            return false
        }

        return true
    })

display(flex_observations)
```

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


