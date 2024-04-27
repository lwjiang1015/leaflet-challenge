//Creating the map object
let myMap = L.map("map").setView([4.11,109.69],3);

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
            if (feature.geometry.coordinates[2]<10){color = "#f6ddcc"}
            else if (feature.geometry.coordinates[2]<30){color = "#f5b7b1"}
            else if (feature.geometry.coordinates[2]<50){color = "#f19481"}
            else if (feature.geometry.coordinates[2]<70){color = "#ec7063"}
            else if (feature.geometry.coordinates[2]<90){color = "#a569bd"}
            else {color = "#5b2c6f"};

            //Access longitude and latitude
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 4,
                fillColor:color,
                color: "black",
                weight: 1,
                opacity: 0.8,
                fillOpacity: 3,
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
        let div = L.DomUtil.create("div", "info legend");
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = ["#f6ddcc", "#f5b7b1", "#f19481", "#ec7063", "#a569bd", "#5b2c6f"];
        let labels = [];

        //Loop through the depth ranges and add color labels
        for (var i=0; i < grades.length; i++){
            div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    // Add the legend to the map
    legend.addTo(myMap);
});
