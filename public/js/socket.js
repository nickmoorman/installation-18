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

        var allList = $('#all').find('ul'),
            trList = $('#tr').find('ul'),
            spList = $('#sp').find('ul'),
            zdList = $('#zd').find('ul');

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
                console.log("appending li to all list: ", li);
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
                console.log("appending li to all list: ", li);
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
                console.log("appending li to all list: ", li);
                allList.prepend(li.clone().addClass('slideDown'));
            }

            zdList.prepend(li.addClass('slideDown'));
        });

        App.socket.on('metrics', function(data){
            console.log("metrics", data);
        });
    }
}