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

// Tab Change
function tabChange(view) {
	tabs[view].on('click', function () {
		var allTabs = d3.selectAll('.navbutt');
		var viewers = d3.selectAll('.viewer');
		var activeTab = tabs[view];
		var activeView = views[view];
		
		// disable everything
		viewers.style('display', 'none');
		allTabs.style('background-color', 'rgb(222, 184, 135)');

		// re-enable appropriate controls
		activeTab.style('background-color', 'rgba(222, 184, 135, .5)');
		activeView.style('display', 'block');
})};


function init() {
	tabChange('map');
	tabChange('vis');
	tabChange('data');
};

init();