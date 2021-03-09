var tabs = {
	map: d3.select('#mapbutt'),
	vis: d3.select('#visbutt'),
	data: d3.select('#databutt'),
};

var views = {
	map: d3.select('#mapview'),
	vis: d3.select('#visview'),
	data: d3.select('#dataview'),
};

function tabChange(tab) {
	console.log(tab)
	d3.selectAll('.viewer').style('display', 'none');
	d3.select(`#${tab}`).style('display', 'block');
};