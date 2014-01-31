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