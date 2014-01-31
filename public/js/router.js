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

        allList = $('#all').find('ul');
        trList = $('#tr').find('ul');
        spList = $('#sp').find('ul');
        zdList = $('#zd').find('ul');

        App.socket.on('all', function(data){
            console.log(data);
            allList.append('<li data-id="' + data.id + '">' + data.user.name + " " + data.text +'</li>');
        });

        App.socket.on('tr', function(data){
            console.log(data);
            if(allList.find('[data-id="' + data.id + '"]').length == 0){
                allList.append('<li data-id="' + data.id + '">' + data.user.name + " " + data.text +'</li>');
            }
            trList.append('<li data-id="' + data.id + '">' + data.user.name + " " + data.text +'</li>');
        });

        App.socket.on('sp', function(data){
            console.log(data);
            if(allList.find('[data-id="' + data.id + '"]').length == 0){
                allList.append('<li data-id="' + data.id + '">' + data.user.name + " " + data.text +'</li>');
            }
            spList.append('<li data-id="' + data.id + '">' + data.user.name + " " + data.text +'</li>');
        });

        App.socket.on('zd', function(data){
            console.log(data);
            if(allList.find('[data-id="' + data.id + '"]').length == 0){
                allList.append('<li data-id="' + data.id + '">' + data.user.name + " " + data.text +'</li>');
            }
            zdList.append('<li data-id="' + data.id + '">' + data.user.name + " " + data.text +'</li>');
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