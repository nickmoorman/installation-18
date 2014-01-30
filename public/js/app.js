// head.ready('router', function () {

// 	// App = {

// 	// 	initialize : function(){
// 	// 		// Pass in our Router module and call it's initialize function
// 	// 		console.log("Initializing Router");
// 	// 		Router.initialize();
// 	// 	}

// 	// 	// return {
// 	// 	// 	initialize: initialize
// 	// 	// };

// 	// }
// });


window.App = {
    model:  {},
    view:   {},
    collection: {},
    router: {},
    util: {},
    data: {},
    JST:{},
    brandCollection: null,
    contentHolder : $('[data-role="content"]'),
    container: $('[data-role="page"]'),

    initialize: function() {
        console.log('window.App Initialized')
        new App.router.brands();
        Backbone.history.start();
    }
}
