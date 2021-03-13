
// Map
var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
var osmURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib = '&copy; ' + osmLink;
var osmMap = L.tileLayer(osmURL, {attribution: osmAttrib});

var map = L.map('map',{
	layers: [osmMap]
}).setView([33.12263277479126, -13.219673178958523], 2);

