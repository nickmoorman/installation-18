window.Socket = {
    // model:  {},
    // view:   {},
    // collection: {},
    // router: {},
    // util: {},
    // data: {},
    // JST:{},
    // brandCollection: null,
    // contentHolder : $('[data-role="content"]'),
    // container: $('[data-role="page"]'),

    initialize: function() {
        console.log('window.Socket Initialized');

        var allList = $('#all').find('ul.tweet'),
            trList = $('#tr').find('ul.tweet'),
            spList = $('#sp').find('ul.tweet'),
            zdList = $('#zd').find('ul.tweet');

        // Grab the HTML out of our template tag and pre-compile it.
        var tplMarkup = $("script.tweet").html();

        App.socket.on('all', function(data){
            console.log(data);
            allList.prepend('<li data-id="' + data.id + '">' + data.user.name + " " + data.text +'</li>');
        });

        App.socket.on('tr', function(data){
            console.log(data);

            data.text = App.util.url.replaceURLWithHTMLLinks(data.text);

            tpl = _.template(tplMarkup, { tweet : data });
            li = $('<li data-id="' + data.id + '"></li>');
            li.html(tpl);

            if(allList.find('[data-id="' + data.id + '"]').length == 0){
                allList.prepend(li.clone().addClass('slideDown'));
            }

            trList.prepend(li.addClass('slideDown'));
        });

        App.socket.on('sp', function(data){
            console.log(data);

            data.text = App.util.url.replaceURLWithHTMLLinks(data.text);

            tpl = _.template(tplMarkup, { tweet : data });
            li = $('<li data-id="' + data.id + '"></li>');
            li.html(tpl);

            if(allList.find('[data-id="' + data.id + '"]').length == 0){
                allList.prepend(li.clone().addClass('slideDown'));
            }

            spList.prepend(li.addClass('slideDown'));
        });

        App.socket.on('zd', function(data){
            console.log(data);

            data.text = App.util.url.replaceURLWithHTMLLinks(data.text);

            tpl = _.template(tplMarkup, { tweet : data });
            li = $('<li data-id="' + data.id + '"></li>');
            li.html(tpl);

            if(allList.find('[data-id="' + data.id + '"]').length == 0){
                allList.prepend(li.clone().addClass('slideDown'));
            }

            zdList.prepend(li.addClass('slideDown'));
        });

        App.socket.on('metrics', function(data){
            console.log("metrics", data);
            LangPie.drawChart(data.tweetsPerLanguage);

            LangPie.trGauge.update((data.totalTweets/data.tweetsPerBrand.tr));
            LangPie.spGauge.update((data.totalTweets/data.tweetsPerBrand.sp));
            LangPie.zdGauge.update((data.totalTweets/data.tweetsPerBrand.zd));

            $('#all .total-tweets-number').text(data.totalTweets);
            $('#tr .total-tweets-number').text(data.tweetsPerBrand.tr);
            $('#sp .total-tweets-number').text(data.tweetsPerBrand.sp);
            $('#zd .total-tweets-number').text(data.tweetsPerBrand.zd);
        });
    }
}