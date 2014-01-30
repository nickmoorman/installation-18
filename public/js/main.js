head.load([
	{"tire" : "js/libs/tire-1.3.1.js"},
	{"underscore" : "js/libs/underscore.js"},
	{"backbone" : "js/libs/backbone.js"}
]);

head.ready(['tire','underscore','backbone'], function () {
    // some callback stuff
    console.log("App Init!!");
    console.log("Tire: ", $);
    console.log("Underscore: ", _);
    console.log("backbone: ", Backbone);

});