class WeatherCard extends HTMLElement {
    set weather(data) {
        this.data = data;
        this.render();
    }

    render() {
        const { name, startTime, endTime, temperature, unit, shortForecast, longForecast } = this.data;

        this.innerHTML = `
      <article class="weather-card">
        <h2>${name}</h2>
        <p>${startTime} to ${endTime}</p>
        <div class="expandable">
            <div class="trigger">
                ${shortForecast}
            </div>
            <div class="trigger-content">
                ${longForecast}
            </div>
        <span class="temperature"><strong>${temperature}°${unit}</strong></span>
        </div>
      </article>
    `;
    }
}

customElements.define('weather-card', WeatherCard);