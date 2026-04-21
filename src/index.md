---
toc: false
---

<div class="hero">
  <h1>Communauto FLEX in Ottawa: The first six months</h1>
</div>

Communauto expanded its FLEX offering to Ottawa/Gatineau on October 16th, 2025. It was [framed as a pilot project](https://ontario.communauto.com/ottawa/the-cities-of-ottawa-and-gatineau-approve-the-launch-of-communautos-flex-carsharing-service/)—how’s it gone?

Unlike Communauto’s conventional round-trip offering, where each car must be picked up and dropped off at a specific station (with off-street parking), FLEX cars are dropped off using on-street parking. This enables one-way trips, which are super useful. The only limitation is that cars may only be parked in certain residential parking zones, and only on streets that allow parking for permit holders. (Communauto has parking guides for both [Ottawa](https://ontario.communauto.com/ottawa/parking-guide/) and [Gatineau](https://gatineau.communauto.com/parking-guide/?lang=en).)

This project visualizes usage of the FLEX service, using data on where FLEX cars are parked within the region. It offers a few reflections on the first six months of Communauto FLEX service in Ottawa/Gatineau.

The data was collected about once an hour, starting at 11 AM on Saturday, October 18th. (The first two and a half days of usage are thus not reflected—my eternal regret!) **Data was last updated at: ${formatTime(observations_last_timestamp)}** [TODO: decide if we want to make this a fixed report, or auto-updating]


<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>
