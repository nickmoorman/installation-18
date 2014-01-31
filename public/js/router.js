//App.router.brands = App.router.brands || {}

App.router.brands = Backbone.Router.extend({

    routes:{
        ':brand':  'brand',
    },

    initialize:function () {
        console.log('App.router.brands Initialized');
        // App.userCollection = new App.collection.users();
        // localStorage.clear();
        // App.userCollection.create(new App.model.user({uid: 1, name:'Cliff', lastName: 'Burton'}));
        // App.userCollection.create(new App.model.user({uid: 2, name:'Steve', lastName: 'Harris'}));
        // App.userCollection.create(new App.model.user({uid: 3, name:'Alejandro', lastName: 'Blanco'}));

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
                allList.prepend(li.clone());
            }

            trList.prepend(li);
        });

        App.socket.on('sp', function(data){
            console.log(data);

            data.text = App.util.url.replaceURLWithHTMLLinks(data.text);

            tpl = _.template(tplMarkup, { tweet : data });
            li = $('<li data-id="' + data.id + '"></li>');
            li.html(tpl);

            if(allList.find('[data-id="' + data.id + '"]').length == 0){
                console.log("appending li to all list: ", li);
                allList.prepend(li.clone());
            }

            spList.prepend(li);
        });

        App.socket.on('zd', function(data){
            console.log(data);

            data.text = App.util.url.replaceURLWithHTMLLinks(data.text);

            tpl = _.template(tplMarkup, { tweet : data });
            li = $('<li data-id="' + data.id + '"></li>');
            li.html(tpl);

            if(allList.find('[data-id="' + data.id + '"]').length == 0){
                console.log("appending li to all list: ", li);
                allList.prepend(li.clone());
            }

            zdList.prepend(li);

        });

        App.socket.on('metrics', function(data){
            console.log("metrics", data);
        });

    },

    brand:function (brand) {
        console.log('Brand requested: ' + brand);
        //alert('All brands requested ' + brand);
    },

    changePage: function (page){
        // page.render();
        // if (App.container.page() ) {
        //     App.container.page('destroy').page();
        // }
    }
});