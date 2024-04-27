//Creating the map object
let myMap = L.map("map").setView([4.11,109.69],2);

//Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use the link below to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Getting the GeoJSON data
d3. json(link).then (data=>{
    //Creating a GeoJSON layer with the retrieved data
    L.geoJson(data,{
        //Styling each feature (here earthquake and location)
        pointToLayer: function (feature, latlng){
            //Determine color based on earthquake depth
            var color;
            if (feature.geometry.coordinates[2]<10){color = "#fcae91"}
            else if (feature.geometry.coordinates[2]<30){color = "#ee9e92"}
            else if (feature.geometry.coordinates[2]<50){color = "#fb6a4a"}
            else if (feature.geometry.coordinates[2]<70){color = "#900c3f"}
            else if (feature.geometry.coordinates[2]<90){color = "#800080"}
            else {color = "#00008B"};

            //Access longitude and latitude
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 3,
                fillColor:color,
                color: "white",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
            });
        },

    //Called on each feature and add a popup with relevant earthquake information 
    onEachFeature: function(feature, layer){
        //Bind a popup with information about the earthquake

        layer.bindPopup('<b>Magnitude:</b>' + feature.properties.mag 
        + '<br><b>Depth:</b>' + feature.geometry.coordinates[2] 
        + '<br><b>Location:</b> ' + feature.properties.place
        + '<br><b>Time:</b> ' + Date(feature.properties.time));
    }
    }).addTo(myMap);

    //Create a legend control
    var legend = L.control({position:"bottomright"});
    //Define the legend content and styling
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10, 10, 30, 50, 70, 90];
        var colors = ["#fee5d9", "#fcae91", "#fb6a4a", "#ee9e92", "#800080", "#00008B"];
        var labels = [];

        //Loop through the depth ranges and add color labels
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' 
            + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

        return div;
    };
    // Add the legend to the map
    legend.addTo(myMap);
});
