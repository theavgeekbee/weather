function getLocationWeather() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported! Sorry :(");
    }

    fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(data => setWeather({
            "coords": {
                "latitude": data["latitude"],
                "longitude": data["longitude"]
            }
        }))
        .catch(_ => setError())
}

function getAccurateLocation(e) {
    e.preventDefault();

    if (!navigator.geolocation) {
        alert("Geolocation is not supported! Sorry :(");
    }
    
    navigator.geolocation.getCurrentPosition(setWeather, setError, {
        timeout: 5000
    });
}

function setError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("You declined the geolocation request! We can't get your weather without it.")
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Sorry, your location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("Sorry, the request to get your location timed out.")
            break;
        default:
            alert("An unknown error occurred. Spooky...");
            break;
    }
}

function setWeather(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const now = new Date();
    const times = SunCalc.getTimes(now, latitude, longitude);
    if (now > times.dusk || now < times.dawn) {
        document.body.classList.add("night");
    }

    if (!latitude || !longitude) {
        alert("We couldn't get your location!");
        return;
    }

    const time = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });

    const elem = document.getElementById("weather");
    fetch(`https://api.weather.gov/points/${latitude},${longitude}`, {
        method: 'GET',
        headers: {
            'User-Agent': '(weather.itsnat.dev, me@nwlee.tech)'
        }
    })
        .then(res => res.json())
        .then(json => json["properties"])
        .then(properties => {
            const office = properties["gridId"];
            const gridX = properties["gridX"];
            const gridY = properties["gridY"];

            if (!office || !gridX || !gridY) {
                throw new Error("Could not get NWS office data for provided location.");
            }

            return fetch(`https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`, {
                method: 'GET',
                headers: {
                    'User-Agent': '(weather.itsnat.dev, me@nwlee.tech)',
                    'Accept': 'application/geo+json'
                }
            });
        })
        .then(res => res.json())
        .then(json => {
            document.getElementById("move-container").classList.add("moved");
            elem.replaceChildren();
            json["properties"]["periods"].forEach((item, idx) => {
                if (idx > 5) return;
                const card = document.createElement("weather-card")

                card.weather = {
                    name: item["name"],
                    startTime: time.format(new Date(item["startTime"])),
                    endTime: time.format(new Date(item["endTime"])),
                    temperature: item["temperature"],
                    unit: item["temperatureUnit"],
                    shortForecast: item["shortForecast"],
                    longForecast: item["detailedForecast"],
                };

                card.style.animationDelay = `${idx * 0.25}s`;
                elem.appendChild(card);
            })
        })
        .catch(err => alert(err));
}

document.getElementById("request-weather").addEventListener("click", getLocationWeather)
document.getElementById("get-location").addEventListener("click", getAccurateLocation);