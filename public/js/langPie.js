window.LangPie = {

    chart : $('#pie'),
    chartKey : $('#pie-key'),

    initialize : function() {
        //setup here
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

        console.log("pieceCount: ",pieceCount);

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
                //console.log("Pie deg: ", deg);

                el = '<div class="piece legend-item-' + i +'" style="-webkit-transform: rotate(' + deg +'deg); -moz-transform: rotate(' + deg + 'deg);"></div>';
                chart.append(el);
                //Add chart colors
                console.log("language: ", value);
                el = '<li class="legend-item-' + i +'-lang">' + key + ' - ' + percentage.toFixed(2) + '%</li>';
                chartKey.append(el);
                i++;
            });
        }
    }
}