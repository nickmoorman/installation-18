head.js([
	{"tire" : "js/libs/tire-1.3.1.js"},
	{"underscore" : "js/libs/underscore.js"},
	{"backbone" : "js/libs/backbone.js"},
	{"app" : "js/app.js"},
	{"router" : "js/router.js"},
    {"socket" : "js/socket.js"},
    {"utils" : "js/utils.js"},
    {"socket.io" : "/socket.io/socket.io.js"},
    {"canvas" : "js/libs/canvas.js"},
    {"chartJs" : "js/libs/Chart.js"},
    {"charts" : "js/charts.js"}
]);

head.ready(function() {
    // some callback stuff
    console.log("Libraries Loaded");
    console.log("Tire: ", $);
    console.log("Underscore: ", _);
    console.log("Backbone: ", Backbone);
    console.log("App: ", App);

    App.socket = io.connect('http://localhost:3000');

    App.initialize();
    Socket.initialize();

    Charts.initialize();

});
