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
		allTabs.classed('navActive', false);

		// re-enable appropriate controls
		activeTab.classed('navActive', true);
		activeView.style('display', 'block');
	});
};


function init() {
	tabChange('map');
	tabChange('vis');
	tabChange('data');
};

init();