head.js([
	{"tire" : "js/libs/tire-1.3.1.js"},
	{"underscore" : "js/libs/underscore.js"},
	{"backbone" : "js/libs/backbone.js"},
	{"app" : "js/app.js"},
	{"router" : "js/router.js"},
	{"foundation" : "js/libs/foundation/foundation.js"},
	{"foundation-tabs" : "js/libs/foundation/foundation.tab.js"}
]);

head.ready(function() {
    // some callback stuff
    console.log("Libraries Loaded");
    console.log("Tire: ", $);
    console.log("Underscore: ", _);
    console.log("Backbone: ", Backbone);
    console.log("App: ", App);

    App.initialize();

    console.log($(document));

    head.ready(['tire', 'foundation'], function(){
    	$(document).foundation({
    	  tab: {
    	    callback : function (tab) {
    	      console.log(tab);
    	    }
    	  }
    	});
    });


});