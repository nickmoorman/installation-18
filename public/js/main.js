head.load([
	{"tire" : "js/tire-1.3.1.js"},
	{"underscore" : "js/underscore.js"},
	{"backbone" : "js/backbone.js"}
]);

head.ready(['tire','backbone'], function () {
    // some callback stuff
    console.log("App Init!!");
    console.log("Tire: ", $);
    console.log("Underscore: ", _);
    console.log("backbone: ", Backbone);

    console.log($('html').attr('class'));
});