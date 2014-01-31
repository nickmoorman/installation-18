window.Charts = {

	langChart : false,
	langKey : false,

	initialize : function(){

		Charts.langChart = $("#languageChart").get(0).getContext("2d");
		Charts.langKey = $('#languageKey');
	},

	colors : ['#16A085', '#27AE60', '#2980B9', '#8E44AD', '#2C3E50', '#F39C12', '#D35400', '#C0392B', '#34495E', '#BDC3C7', '#7F8C8D', '#9B59B6', '#E74C3C', '#E67E22', '#1ABC9C'],

	updateLanguages : function (tweetsPerLanguage) {
		elLanguages = Charts.langChart;
		elKey = Charts.langKey.empty();
		var pieData = [],
			i = 0;

		$.each(tweetsPerLanguage, function(key, val) {
			color = Charts.colors[i];
		    pieData.push({value: val,color: color});
		    if (key != '_data') {
			    el = '<li style="background-color:' + color + '">' + key + ' - ' + val + '</li>';
			    elKey.append(el);
			}
			i++;
		});

		new Chart(elLanguages).Pie(pieData,{});
	}
}