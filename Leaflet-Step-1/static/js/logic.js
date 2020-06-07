url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXdhcmRlaCIsImEiOiJja2FkNGZ0OGgyMGtqMnlwbThnNXR3bWNpIn0.uFK4y-WgrYAmarpTNRzedg", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: 'pk.eyJ1Ijoic2Fjb3NpODkiLCJhIjoiY2thZWo3ejZnMDVncjJybzQxc3BmNXM2byJ9.DfB337nrnIxAd0vYJjEflA'
});


d3.json(url, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    // createFeatures(data.features);
    var array = data['features'];
    console.log(array)

    var earthquakeMarkers = []

    for (var i = 0; i < array.length; i++) {

        var longitude = array[i]['geometry']['coordinates'][0];
        var latitude = array[i]['geometry']['coordinates'][1];
        var mag = parseInt(array[i]['properties']['mag']);
        var title = array[i]['properties']['title'];


        var marker_details = L.circle([latitude, longitude], {
            color: chooseColor(mag),
            fillColor: chooseColor(mag),
            fillOpacity: 0.5,
            radius: mag * 20000
        }).bindPopup("<p>" + title + "</p>");

        earthquakeMarkers.push(marker_details)

    }

    var earth_details = L.layerGroup(earthquakeMarkers);


    var baseMaps = {
        "Light Map": lightmap
    };



    var overlayMaps = {
        "Earthquakes": earth_details,
    };


    var map = L.map("map", {
        center: [39.8283, -40.5795],
        zoom: 3,
        layers: [lightmap, earth_details]
    });

    // Create a layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(map);


    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend'),
            steps = [0, 1, 2, 3, 4,5]

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < steps.length; i++) {
            if(steps[i + 1]>0){
                div.innerHTML +=
                    '<i style="background:' + chooseColor(steps[i]) + '"></i> ' + 
                    steps[i] + ' - ' + steps[i + 1] + '<br>'}
            
            else{
                div.innerHTML +=
                    '<i style="background:' + chooseColor(steps[i]) + '"></i> ' + 
                    steps[i] + '+'}
        }

        return div;
    };

    legend.addTo(map);


});

function chooseColor(magnitude) {

    if (magnitude < 1) {
        return "#ffffb2"
    }
    else if (magnitude < 2) {
        return "#fed976"
    }
    else if (magnitude < 3) {
        return "#feb24c"
    }
    else if (magnitude < 4) {
        return "#fd8d3c"
    }
    else if (magnitude < 5){
        return "#f03b20"
    }
    else {
        return "#bd0026"
    }
}

