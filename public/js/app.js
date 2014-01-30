window.App = {
    model:  {},
    view:   {},
    collection: {},
    router: {},
    socket: {},
    util: {},
    data: {},
    JST:{},
    brandCollection: null,
    contentHolder : $('[data-role="content"]'),
    container: $('[data-role="page"]'),

    initialize: function() {
        console.log('window.App Initialized');
        new App.router.brands();
        Backbone.history.start();
    }
}
