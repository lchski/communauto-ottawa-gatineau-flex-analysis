import {timeFormat} from "npm:d3";
import {html} from "npm:htl"

export const formatDate = timeFormat("%B %d, %Y")

export const formatDatetime = timeFormat("%b %d, %Y, %I:%M %p")

// rounds, no decimal
export const formatPercent = (frac) => Number.isNaN(frac) ? 0 : Math.round(frac * 100) / 1

export function sparkbar(max) {
    return (x) => html`<div style="
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
