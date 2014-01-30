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

        App.socket.on('tweet', function(data){
            console.log(data);
            allList.append('<li>' + data.user.name + " " + data.text +'</li>');
        });

    },

    brand:function (brand) {
        console.log('Brand requested: ' + brand);
        //alert('All brands requested ' + brand);
    },


    list:function () {
        // this.changePage(new App.view.user.list({model: App.userCollection.findAll()}));

    },

    show:function (id) {
        // var user = App.userCollection.localStorage.find(new App.model.user({id: id}));
        // if (user)
        // {
        //     this.changePage(new App.view.user.show({model:user}));
        // }
        // else
        // {
        //     var model = {error_message: 'User not found'};
        //     this.changePage(new App.view.message.error({model:model}));

        // }
    },

    about:function () {
        // var model = {about_message: 'About this app'};
        // this.changePage(new App.view.message.about({model:model}));

    },

    changePage: function (page){
        // page.render();
        // if (App.container.page() ) {
        //     App.container.page('destroy').page();
        // }
    }
});