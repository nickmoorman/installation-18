App.util = App.util || {}

App.util.templates = {

    // Hash of preloaded templates for the app
    templatesHash:{},

    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. All the template files should be
    // concatenated in a single file.
    loadTemplates:function (names, callback) {

        var that = this;

        var loadTemplate = function (index) {
            var name = names[index];
            console.log('Loading template: ' + name);
            $.get('/jmb/app/tpl/' + name + '.html', function (data) {
                that.templatesHash[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        }

        loadTemplate(0);
    },

    // Get template by name from hash of preloaded templates
    get:function (name) {
        return App.util.templates.templatesHash[name];
    }

};

App.util.url = {

    //http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
    replaceURLWithHTMLLinks: function(text) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(exp,'<a href="$1" target="_blank">$1</a>');
    }

};

App.util.color = {
    //http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
    getRandom : function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }
};