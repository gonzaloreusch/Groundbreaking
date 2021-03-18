// Store our API endpoint inside queryUrl
var queryUrl = "Data/modeled_quakes.geojson"
var queryPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
var queryeruptions= "Data/Eruptions_List.geojson";
// Grap data with d3 from queryURL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data);
  console.log(data.features);
  console.log("depth: "+data.features[1].geometry.coordinates[2])

  d3.json(queryeruptions,function(data){
    var eruptionData = data.features
  });

  d3.json(queryPlatesUrl, function(data){
    var platesData = data.features
  })
  });

/////////////

/////////////

function createFeatures(earthquakeData,platesData,eruptionData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" +"<br>Magnitud:" +  feature.properties.mag
     + "<br>Depth:" +  feature.properties.depth +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function getRadius(magnitude) {
    if (magnitude === 0){
      return 1;
    }
    return magnitude*4;
  }

  //function fill color
  function depthColor(depth) {
    switch (true) {
      case depth > 90: return "#DC143C";
      case depth > 70: return "#FF7F50";
      case depth > 50: return "#D2691E";
      case depth > 30: return "#7FFF00";
      case depth > 10: return "#FFEBCD";
      default: return "rgb(250 200 100)";
    }
  }

  //function styleInfo
  function styleInfo (feature){
    return {
      fillColor: depthColor(feature.geometry.coordinates[2]),
      radius: getRadius(feature.properties.mag),
      color: "#000000",
      fillOpacity: 1,
      opacity: 1,
      weight: 0.5,
      stroke: true
    };
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature,latlng) {
      return L.circleMarker(latlng);
    },

    style: styleInfo,

    onEachFeature: onEachFeature
  });

  

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var outdoor = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite Map": satellitemap,
    "Grayscale": grayscale,
    "Outdoor" : outdoor,
  };

  var tectonicplates = new L.layerGroup();
  var eruptions= new L.layerGroup();

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    TectonicPlates: tectonicplates,
    Eruptions:  eruptions
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      46.199420, -122.188293
    ],
    zoom: 10,
    layers: [ satellitemap,earthquakes,tectonicplates,eruptions]
  });


  var volcanoIcon = L.icon({
    iconUrl: 'icons/volcano.png',
    //shadowUrl: 'leaf-shadow.png',
    iconSize:     [25, 25], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //setup legend

  var legend = L.control({position: 'topleft'});
      legend.onAdd = function (map) {
          var div = L.DomUtil.create('div', 'info legend'),
              grades = ["All earthquakes within 50 km radius from eruption site"];
          for (var i = 0; i < grades.length; i++) {
              div.innerHTML =
                  '<i style="background:' + '"></i> ' +
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '');
          }
          return div;
};

  //add legend to myMap
  legend.addTo(myMap);

  d3.json(queryPlatesUrl, function(platesdata) {
        // Adding  geoJSON data, along with style detail to the tectonicplates layer.
        L.geoJson(platesdata, {
          color: "orange",
          weight: 2
        })
        .addTo(tectonicplates);
  
        // Then add the tectonicplates layer to the map.
        tectonicplates.addTo(myMap);
      });

      d3.json(queryeruptions, function(eruptionData) {
        // Adding  geoJSON data, along with style detail to the tectonicplates layer.
        L.geoJson(eruptionData, {
          pointToLayer: function(feature,latlng){
            var marker = L.marker(latlng,{icon:volcanoIcon})
            marker.bindPopup(feature.properties.Name + '<br/>' +"VEI: " +  feature.properties.VEI);             
            marker.on('mouseover', function(e){
            marker.openPopup();
            
            L.marker([-53.677343, -68.631828], {icon: waldoIcon})
             });
                return marker;
              }
        })

        .addTo(eruptions);
  
        // Then add the tectonicplates layer to the map.
        eruptions.addTo(myMap);
      });
  
}





// var waldoIcon = L.icon({
//   iconUrl: 'icons/waldo.jpg',
//   //shadowUrl: 'leaf-shadow.png',
//   iconSize:     [10, 10], // size of the icon
//   //shadowSize:   [50, 64], // size of the shadow
//   //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
//   //shadowAnchor: [4, 62],  // the same for the shadow
//   popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
// });
// L.marker([-53.677343, -68.631828], {icon: waldoIcon}).addTo(map);