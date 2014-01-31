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

        // TODO: Figure out how to load the damn config file...
        var brands = [
            {
                name: 'TechRepublic',
                shortname: 'TR',
                socket: 'tr',
                terms: ['techrepublic', 'tech republic', 'tek.io'],
                accountId: '6486602'
            },
            {
                name: 'SmartPlanet',
                shortname: 'SP',
                socket: 'sp',
                terms: ['smartplanet', 'smart planet', 'smrt.io'],
                accountId: '34731203'
            },
            {
                name: 'ZDNet',
                shortname: 'ZD',
                socket: 'zd',
                terms: ['zdnet', 'zd net', 'z d net', 'zd.net'],
                accountId: '3819701'
            },
            {
                name: 'Tech Pro Research',
                shortname: 'TPR',
                socket: 'tpr',
                terms: ['techproresearch', 'tech pro research'],
                accountId: '1415819869'
            }
        ];

        var allList = $('#all').find('ul.tweet');

        // Grab the HTML out of our template tag and pre-compile it.
        var tplMarkup = $("script.tweet").html(),
            tabTplMarkup = $("script.tabTpl").html(),
            tabBodyTplMarkup = $("script.tabBody").html();

        App.socket.on('all', function(data){
            console.log(data);
            allList.prepend('<li data-id="' + data.id + '">' + data.user.name + " " + data.text +'</li>');
        });

        var index = 1
            tabBodies = $('.tab-body-wrapper'),
            tabsWrapper = $('.tabs-wrapper');

        brands.forEach(function(brand) {
            console.log(brand.name);
            // Put tabs on page
            div = $('<div></div>');
            div.html(_.template(tabTplMarkup, { index: ++index, name: brand.name }));

            lastEl = tabsWrapper.find('label:last-of-type');

            kids = div.children();
            lastEl.after(kids[1]);
            lastEl.after(kids[0]);

            // Put tab body on page
            div = $('<div id="' + brand.socket + '" class="tab-body"></div>');
            div.html(_.template(tabBodyTplMarkup, {}));
            tabBodies.append(div);

            // Set up socket message listeners
            App.socket.on(brand.socket, function(data) {
                console.log(data);

                data.text = App.util.url.replaceURLWithHTMLLinks(data.text);

                tpl = _.template(tplMarkup, { tweet : data });
                li = $('<li data-id="' + data.id + '"></li>');
                li.html(tpl);

                if(allList.find('[data-id="' + data.id + '"]').length == 0){
                    console.log("appending li to all list: ", li);
                    allList.prepend(li.clone().addClass('slideDown'));
                }

                $('#' + brand.socket).find('ul.tweet').prepend(li.addClass('slideDown'));
                console.log("brand UL: ",$('#' + brand.socket).find('ul.tweet'));
            });
        });

        App.socket.on('metrics', function(data){
            console.log("metrics", data);

            // LangPie.drawChart(data.tweetsPerLanguage);
            // LangPie.trGauge.update((data.totalTweets/data.tweetsPerBrand.tr));
            // LangPie.spGauge.update((data.totalTweets/data.tweetsPerBrand.sp));
            // LangPie.zdGauge.update((data.totalTweets/data.tweetsPerBrand.zd));

            Charts.updateLanguages(data.tweetsPerLanguage);

            if(data.totalTweets){
                $('#all .total-tweets-number').text(data.totalTweets);
            }
            brands.forEach(function(brand) {
                if(data.tweetsPerBrand[brand.socket]) {
                    $('#' + brand.socket + ' .total-tweets-number').text(data.tweetsPerBrand[brand.socket]);
                }
            });
        });
    }
}