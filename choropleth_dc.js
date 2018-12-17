//Initiate map variable
var map = L.map('map').setView([38.912753, -77.032194], 12);

//Add basemap
L.mapboxGL({
  accessToken: 'pk.eyJ1IjoidGJydWtzIiwiYSI6ImNqZDdrcG5ucDJsbG8yem53emR4aHBmMjQifQ.1BRqWpJKeGPKtvwCq5Qqyw',
  style: 'mapbox://styles/tbruks/cjp94zrkq3efi2ssgvjn3nr1m',
}).addTo(map);

//Adds map attribution for OpenStreetMap, Leaflet and Mapbox
map.attributionControl.addAttribution('© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>');

var dataCSV = "cleaned_reviews_dc.csv"

var geojsonURL = "neighbourhoods_dc.geojson"

// Fetch GeoJSON and data to join
d3.json(geojsonURL, function(error, json){
    d3.csv(dataCSV, function(error, data){
      
      // var newArray = []
      for (var i = 0; i < data.length; i++) {
        var dataNeighbourhood = data[i].neighbourhood;
        var dataBookings = data[i]['normalized value (per 1000 reviews)'] 
        // newArray.push(+dataBookings)
        

        for (var j = 0; j < json.features.length; j ++) {
          var jsonNeighbourhood = json.features[j].properties.neighbourhood;

          if (dataNeighbourhood == jsonNeighbourhood) {
            json.features[j].properties.value = +dataBookings;
            break;
      }}}

      // console.log(ss.ckmeans(newArray, 8))

      //Highlight polygon when mouse hovers
      function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }}
      //Reset polygon's style when mouse moves to another area
      function resetHighlight(e) {
        choropleth.resetStyle(e.target);
      }
      //Initiate mouseover and mouseout actions for each feature
      function onEachFeature(feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight
        });
        layer.bindTooltip('<center><b>Neighbourhood:</b> ' + feature.properties.neighbourhood + '<hr/><b>Number Of Bookings (per 1,000):</b> ' + feature.properties.value.toLocaleString() + '</center>');
      }
 //Initiate choropleth plugin  
//  '#edcedf',  '#c994c7',  
 var choropleth = L.choropleth(json, {
  valueProperty: 'value',
  colors: ['#f7f4f9','#d4b9da','#df65b0','#e7298a','#ce1256','#91003f'],
  steps: 6,
  mode: 'k',
  style: {
    color: '#fff',
    opacity: 1,
    dashArray:'1',
    weight: .8,
    fillOpacity: .7
  },
  onEachFeature: onEachFeature

}).addTo(map);

// var legend = L.control({position: 'bottomleft'});

// legend.onAdd = function (map) {

//     var div = L.DomUtil.create('div', 'info legend'),
//         limits = choropleth.options.limits;
//         colors = choropleth.options.colors;
//         labels = [];

//     // loop through our choropleth intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < limits.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + colors[i] + 1 + '"></i> ' +
//             limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
//     }

//     return div;
// };

// legend.addTo(map);

  // Setting up the legend
  var legend = L.control({ position: "bottomleft" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
     limits = choropleth.options.limits,
      colors = choropleth.options.colors,
      labels = [];

    // Add min & max
    var legendInfo = "<h1>Number of Trips <i><div>(per 1,000)</div></i></h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1].toLocaleString() + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(map);
})})