// Store the earthquakes weekly endpoint as link.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the link
d3.json(link).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });
  
function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
  
// Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
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
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);

}

function createMap(earthquakes) {
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a variable for tectonic plates outside the d3.json().then() function
  let tectonicPlates = new L.layerGroup();

  // Load the GeoJSON data.
  let geoData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
  d3.json(geoData).then(function(data){

      // Create a new GeoJSON layer with the tectonic plates data
    L.geoJSON(data, {
      style: {color: "orange",
              weight: 2
              }
          }).addTo(tectonicPlates);
    //add tectonic plates layer to map
    tectonicPlates.addTo(myMap)
  });

// Create a baseMaps object.
let baseMaps = {
  "Street Map": street,
  "Topographic Map": topo
};

// Create an overlay object to hold our overlay.
let overlayMaps = {
"Tectonic Plates": tectonicPlates,
Earthquakes: earthquakes
};
    
// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
    center: [
        4.11,109.69
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

    //Create a legend control
    let legend = L.control({position:"bottomright"});
    //Define the legend content and styling
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = ["#fee5d9", "#fcae91", "#fb6a4a", "#ee9e92", "#800080", "#00008B"];
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
  }