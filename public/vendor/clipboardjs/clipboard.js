(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Clipboard = factory();
    }

})(this, function () {

    var Clipboard = {};
        Clipboard.version = '0.1.0';

    var Settings = Clipboard.settings = {
        "containers": "[data-clipboard],[data-clipboard-copy], [data-clipboard-cut]",
        "targets": "[data-clipboard-paste]"
    };

    var debug = false;
    var ready = false;

    Clipboard.reset = function(el = undefined) {

        return this;
    }

    Clipboard.ready = function (options = {})
    {
        if("debug" in options)
            debug = options["debug"];

        Clipboard.configure(options);
        ready = true;

        if (debug) console.log("Clipboard is ready.");
        dispatchEvent(new Event('clipboard:ready'));

        Clipboard.onLoad();
        return this;
    };

    Clipboard.get = function(key) {
    
        if(key in Clipboard.settings) 
            return Clipboard.settings[key];

        return null;
    };

    Clipboard.set = function(key, value) {
    
        Clipboard.settings[key] = value;
        return this;
    };

    Clipboard.add = function(key, value) {
    
        if(! (key in Clipboard.settings))
            Clipboard.settings[key] = [];

        if (Clipboard.settings[key].indexOf(value) === -1)
            Clipboard.settings[key].push(value);

        return this;
    };

    Clipboard.remove = function(key, value) {

        if(key in Clipboard.settings) {

            Clipboard.settings[key] = Clipboard.settings[key].filter(function(setting, index, arr){ 
                return value != setting;
            });

            return Clipboard.settings[key];
        }

        return null;
    };

    Clipboard.configure = function (options) {

        var key, value;
        for (key in options) {
            value = options[key];
            if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
        }

        if (debug) console.log("Clipboard configuration: ", Settings);

        return this;
    }

    Clipboard.onLoad = function (el = window)
    {
        Clipboard.reset(el);
        $(Clipboard.get("containers")).off("click.clipboard");
        $(Clipboard.get("containers")).on("click.clipboard", function(e) {

            e.preventDefault();
            var container = e.currentTarget;
            
            switch(container.tagName) {

                case "A":
                    navigator.clipboard.writeText(window.location.origin + $(container).attr("href"));
                    break;

                default:
                    navigator.clipboard.writeText(container.val());
                    console.log(container.val());
                    break
            }
        });

        // $(Clipboard.get("targets"));

        return this;
    }
    
    return Clipboard;
});
