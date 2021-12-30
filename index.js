console.log("Welcome to Covid19 Dashboard");
let globalContent = document.getElementById("globalContent");
//create a clock to display date and time.
let clock = () => {
    let date = new Date();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dayName = days[date.getDay()];
    let hrs = date.getHours();
    let mins = date.getMinutes();
    let secs = date.getSeconds();
    let period = "AM";
    if (hrs == 0) {
        hrs = 12;
    } else if (hrs >= 12) {
        hrs = hrs - 12;
        period = "PM";
    }
    hrs = hrs < 10 ? "0" + hrs : hrs;
    mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;
    document.getElementById("clock").innerHTML = `
    <div id="time">${hrs}:${mins}:${secs}</div>
    <div id="day">${dayName}</div>
    `
    setTimeout(clock, 1000);
};
clock();



//Set fly function to zoom out on click
let worldDataBtn = document.getElementById("worldData");

function UpdateMap() {
    url_Global = 'https://corona.lmao.ninja/v2/all?yesterday';
    url_Countries = 'https://corona.lmao.ninja/v2/countries?yesterday&sort';
    fetch(url_Global).then(response => response.json()).then((glob_data) => {
        globalContent.innerHTML = `
                <div id="globalData" style="background:linear-gradient(to  top,rgba(0, 0, 0, 0.901),rgba(0, 0, 0, 0.901),rgba(216, 104, 104, 0.927));color: white;font-weight: 600;">
                    <ul class="globalDataList" style="padding: 10px;text-shadow: 1px 1px 2px black;list-style: none;display: flex; justify-content:space-evenly;align-items: center; width: 100%;color: #ffffffa6;font-size:28px">
                        <li><strong>Active:</strong> ${glob_data.active}</li>
                        <li><strong>New Confirmed:</strong> ${glob_data.todayCases}</li>
                        <li><strong>New Deaths:</strong> ${glob_data.todayDeaths}</li>
                        <li><strong>New Recovered:</strong>  ${glob_data.todayRecovered}</li>
                    </ul>
                    <ul class="globalDataList" style="padding: 10px;text-shadow: 1px 1px 2px black;list-style: none;display: flex; justify-content:space-evenly;align-items: center; width: 100%;color: #ffffffa6;font-size:28px">
                        <li><strong>Total Confirmed:</strong>  ${glob_data.cases}</li>
                        <li><strong>Total Deaths:</strong>  ${glob_data.deaths}</li>
                        <li><strong>Total Recovered:</strong> ${glob_data.recovered} </li>
                    </ul>
                </div>
    `

    }).catch(error => {
        console.log(error.message);
        alert(`${error.message}\nPlease reload the page!`);
    })

    fetch(url_Countries).then(response => response.json()).then((Cont_data) => {
        Cont_data.forEach((element, index) => {
            let longtitude = element.countryInfo.long;
            let latitude = element.countryInfo.lat;
            let size = 0;
            if (Math.sqrt(element.active) > 2000)
                size = 125;
            else if (Math.sqrt(element.active) > 1000)
                size = 90;
            else if (Math.sqrt(element.active) > 700)
                size = 60;
            else if (Math.sqrt(element.active) > 500)
                size = 50 - Math.sqrt(element.active) / 40;
            else if (Math.sqrt(element.active) > 100)
                size = 30 - Math.sqrt(element.active) / 40;
            else if (Math.sqrt(element.active) > 50)
                size = 15 - Math.sqrt(element.active) / 40;
            else if (Math.sqrt(element.active) > 10)
                size = 10 - Math.sqrt(element.active) / 40;
            else
                size = 5;
            //map-box
            const el = document.createElement('div');
            el.className = 'marker';
            el.style = `width:${size}px ;height:${size}px ;`

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el).setLngLat([longtitude, latitude]).addTo(map);

            // adding on hower functionality by creating hover class and adding it to the element.
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            });
            el.onmouseenter = function () {
                let description = `<ul id=Popup>
                                    <li>Continent: <strong>${element.continent}</strong></li>
                                    <li style="font-weight:bolder;font-size:18px">${element.country}</li>
                                    <li>Population: <strong>${element.population}</strong></li>
                                    <li>Active Cases: <strong>${element.active}</strong></li>
                                    <li>Today's Cases: <strong>${element.todayCases}</strong></li>
                                    <li>Today's Recovered: <strong>${element.todayRecovered}</strong></li>
                                    <li>Today's Deaths: <strong>${element.todayDeaths}</strong></li>
                                    <li>Total Cases:<strong> ${element.cases}</strong></li>
                                    <li>Total Recovered: <strong>${element.recovered}</strong></li>
                                    <li>Total Deaths: <strong>${element.deaths}</strong></li>
                                </ul>`
                popup.setLngLat([longtitude, latitude]).setHTML(description).addTo(map);
            }
            el.onmouseleave = function () {
                popup.remove();
            }
        });
    }).catch(error => {
        console.log(error.message);
        alert(`${error.message}\nPlease reload the page!`);
    })
}
UpdateMap();
// Indian Data

let States = document.getElementById("States");
let IndianDataBtn = document.getElementById("IndianData");
IndianDataBtn.addEventListener("click", () => {
    let url_india = 'https://data.covid19india.org/data.json';
    fetch(url_india).then(response => response.json())
        .then(data => {
            fetch('./IndianStates.json').then(response => response.json())
                .then(LongLatdata => {
                    data.statewise.forEach((element, index) => {
                        element.longitude = LongLatdata[index].longitude;
                        element.latitude = LongLatdata[index].latitude;

                        let longitude = LongLatdata[index].longitude;
                        let latitude = LongLatdata[index].latitude;
                        //add to mapbox
                        let size = 0;
                        if (element.active > 100000) {
                            size = 50;
                        }
                        else if (element.active > 15000) {
                            size = 30;
                        }
                        else if (element.active > 5000) {
                            size = 25;
                        }
                        else if (element.active > 5000) {
                            size = 18;
                        }
                        else if (element.active > 500) {
                            size = 15;
                        }
                        else if (element.active > 100) {
                            size = 8;
                        }
                        else {
                            size = 5;
                        }
                        const state_el = document.createElement('div');
                        state_el.className = 'marker';
                        state_el.style = `width:${size}px ;height:${size}px ;`
                        new mapboxgl.Marker(state_el).setLngLat([longitude, latitude]).addTo(map);
                        map.flyTo({
                            // These options control the ending camera position: centered at
                            // the target, at zoom level 9, and north up.
                            center: [78.9629, 20.5937],
                            zoom: 3.5,
                            bearing: 0,

                            // These options control the flight curve, making it move
                            // slowly and zoom out almost completely before starting
                            // to pan.
                            speed: 0.8, // make the flying slow
                            curve: 1, // change the speed at which it zooms out

                            // This can be any easing function: it takes a number between
                            // 0 and 1 and returns another number between 0 and 1.
                            easing: (t) => t,

                            // this animation is considered essential with respect to prefers-reduced-motion
                            essential: true
                        });

                        // Add Popup functionality on hover

                        const popup = new mapboxgl.Popup({
                            closeButton: false,
                            closeOnClick: false,
                        });
                        state_el.onmouseenter = () => {
                            let description = `<ul id=Popup>
                                    <li style="font-weight:bolder;font-size:18px">${element.state}</li>
                                    <li>Last updated at: <strong>${element.lastupdatedtime}</strong></li>
                                    <li>Active Cases: <strong>${element.active}</strong></li>
                                    <li>Delta Confirmed: <strong>${element.deltaconfirmed}</strong></li>
                                    <li>Delta Recovered: <strong>${element.deltarecovered}</strong></li>
                                    <li>Delta Deaths: <strong>${element.deltadeaths}</strong></li>
                                    <li>Total Cases:<strong> ${element.confirmed}</strong></li>
                                    <li>Total Recovered: <strong>${element.recovered}</strong></li>
                                    <li>Total Deaths: <strong>${element.deaths}</strong></li>
                                </ul>`
                            popup.setLngLat([longitude, latitude]).setHTML(description).addTo(map);
                        }
                        state_el.onmouseleave = function () {
                            popup.remove();
                        }
                        worldDataBtn.addEventListener("click", () => {
                            fetch('https://corona.lmao.ninja/v2/all?yesterday').then(response => response.json()).then((glob_data) => {
                                globalContent.innerHTML = `
                                        <div id="globalData" style="background:linear-gradient(to  top,rgba(0, 0, 0, 0.901),rgba(0, 0, 0, 0.901),rgba(216, 104, 104, 0.927));color: white;font-weight: 600;">
                                            <ul class="globalDataList" style="padding: 10px;text-shadow: 1px 1px 2px black;list-style: none;display: flex; justify-content:space-evenly;align-items: center; width: 100%;color: #ffffffa6;font-size:28px">
                                                <li><strong>Active:</strong> ${glob_data.active}</li>
                                                <li><strong>New Confirmed:</strong> ${glob_data.todayCases}</li>
                                                <li><strong>New Deaths:</strong> ${glob_data.todayDeaths}</li>
                                                <li><strong>New Recovered:</strong>  ${glob_data.todayRecovered}</li>
                                            </ul>
                                            <ul class="globalDataList" style="padding: 10px;text-shadow: 1px 1px 2px black;list-style: none;display: flex; justify-content:space-evenly;align-items: center; width: 100%;color: #ffffffa6;font-size:28px">
                                                <li><strong>Total Confirmed:</strong>  ${glob_data.cases}</li>
                                                <li><strong>Total Deaths:</strong>  ${glob_data.deaths}</li>
                                                <li><strong>Total Recovered:</strong> ${glob_data.recovered} </li>
                                            </ul>
                                        </div>
                            `

                            }).catch(error => {
                                console.log(error.message);
                                alert(`${error.message}\nPlease reload the page!`);
                            })
                            map.flyTo({
                                // These options control the ending camera position: centered at
                                // the target, at zoom level 9, and north up.
                                center: [40, 20],
                                zoom: 1.3,
                                bearing: 0,

                                // These options control the flight curve, making it move
                                // slowly and zoom out almost completely before starting
                                // to pan.
                                speed: 0.8, // make the flying slow
                                curve: 1, // change the speed at which it zooms out

                                // This can be any easing function: it takes a number between
                                // 0 and 1 and returns another number between 0 and 1.
                                easing: (t) => t,

                                // this animation is considered essential with respect to prefers-reduced-motion
                                essential: true
                            });
                            new mapboxgl.Marker(state_el).remove();
                        });
                        if (index == 0 || index == 31)
                            state_el.style.display = "none";
                    });
                })
            // update to the globalContent bar
            globalContent.innerHTML = `
                            <div id="globalData" style="background:linear-gradient(to  top,rgba(0, 0, 0, 0.901),rgba(0, 0, 0, 0.901),rgba(216, 104, 104, 0.927));color: white;font-weight: 600;">
                                <ul class="globalDataList" style="padding: 10px;text-shadow: 1px 1px 2px black;list-style: none;display: flex; justify-content:space-evenly;align-items: center; width: 100%;color: #ffffffa6;font-size:28px">
                                <li><strong>Active Cases: </strong>${data.statewise[0].active}</li>
                                <li><strong>Delta Confirmed: </strong>${data.statewise[0].deltaconfirmed}</li>
                                <li><strong>Delta Recovered: </strong>${data.statewise[0].deltarecovered}</li>
                                <li><strong>Delta Deaths: </strong>${data.statewise[0].deltadeaths}</li>
                                </ul>
                                <ul class="globalDataList" style="padding: 10px;text-shadow: 1px 1px 2px black;list-style: none;display: flex; justify-content:space-evenly;align-items: center; width: 100%;color: #ffffffa6;font-size:28px">
                                <li><strong>Total Cases: </strong>${data.statewise[0].confirmed}</li>
                                <li><strong>Total Recovered: </strong>${data.statewise[0].recovered}</li>
                                <li><strong>Total Deaths: </strong>${data.statewise[0].deaths}</li>
                                </ul>
                            </div>
                `
                console.log(data.statewise);
        })


})