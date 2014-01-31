window.LangPie = {

    chart : $('#pie'),
    chartKey : $('#pie-key'),

    trGauge: false,
    spGauge: false,
    zdGauge: false,

    initialize : function() {
        //setup here
        elTrGauge = $('#all .chart-tr')[0];
        elSpGauge = $('#all .chart-sp')[0];
        elZdGauge = $('#all .chart-zd')[0];

        LangPie.trGauge = new EasyPieChart(elTrGauge, {
            // your options goes here
        });

        LangPie.spGauge = new EasyPieChart(elSpGauge, {
            // your options goes here
        });

        LangPie.zdGauge = new EasyPieChart(elZdGauge, {
            // your options goes here
        });

    },

    calcAngle : function(percentage) {
        return (360*percentage.toFixed(0)) / 100;
    },

    drawChart : function(data) {
        chart = LangPie.chart;
        chartKey = LangPie.chartKey;
        chart.empty();
        chartKey.empty();
        pieces = [];
        totalValue = 0;
        pieceCount =  _.size(data);

        //console.log("pieceCount: ",pieceCount);

        if (pieceCount > 1) {

            $.each(data, function(key, value){
                totalValue += value;
            });

            //console.log("totalLangCount: ",totalValue);

            var i =1;

            $.each(data, function(key, value){
                percentage = (value/totalValue) * 100;
                //console.log("piece percentage:", percentage);

                deg = LangPie.calcAngle(percentage);
                //deg = 360 - deg;
                //console.log("Pie deg: ", deg);

                el = '<div class="piece legend-item-' + i +'" style="-webkit-transform: rotate(' + deg +'deg); -moz-transform: rotate(' + deg + 'deg);"></div>';
                chart.append(el);
                //Add chart colors
                el = '<li class="legend-item-' + i +'-lang">' + key + ' - ' + percentage.toFixed(2) + '%</li>';
                chartKey.append(el);
                i++;
            });
        }
    }
}