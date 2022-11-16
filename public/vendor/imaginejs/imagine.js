$.fn.serializeObject = function () {

    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Imagine = factory();
    }

})(this, function () {

    var Imagine = {};
    Imagine.version = '0.1.0';

    var Settings = Imagine.settings = {

        "debug"       : false,
        "disable"     : false,
        "lazyload"    : true
    };


    var ready = false;

    Imagine.epsilon = function(x1, x0) { return Math.abs(x1-x0) < 1; }
    Imagine.reset = function(el = undefined) {

        var targetData = jQuery.data(el || document.documentElement);
        Object.keys(targetData).forEach((key) => delete targetData[key]);

        return this;
    }

    Imagine.ready = function (options = {}) {

        if("debug" in options)
            Settings.debug = options["debug"];

        Imagine.configure(options);
        ready = true;

        if (Settings.debug) console.log("Imagine is ready.");
        if (Settings.debug) console.log("(padding = ", Imagine.getScrollPadding(), ")");
        dispatchEvent(new Event('imagine:ready'));

        return this;
    };

    Imagine.get = function(key) {

        if(key in Imagine.settings)
            return Imagine.settings[key];

        return null;
    };

    Imagine.set = function(key, value) {

        Imagine.settings[key] = value;
        return this;
    };

    Imagine.add = function(key, value) {

        if(! (key in Imagine.settings))
            Imagine.settings[key] = [];

        if (Imagine.settings[key].indexOf(value) === -1)
            Imagine.settings[key].push(value);

        return this;
    };

    Imagine.remove = function(key, value) {

        if(key in Imagine.settings) {

            Imagine.settings[key] = Imagine.settings[key].filter(function(setting, index, arr){
                return value != setting;
            });

            return Imagine.settings[key];
        }

        return null;
    };

    Imagine.configure = function (options) {

        var key, value;
        for (key in options) {
            value = options[key];
            if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
        }

        if (Settings.debug) console.log("Imagine configuration: ", Settings);

        return this;
    }

    Imagine.onLoad = function (el = window)
    {
        if(Imagine.get("disable") === true) {

            $(".imagine").addClass("imagine-disabled");
            return;
        }

        Imagine.reset(el);
        Imagine.onSplit();
        return this;
    }

    Imagine.findImages = function (container) {

        if($(container).length == 0) return;

        const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i;
        var arr = Array.from($(container)[0].querySelectorAll('*'));
            arr.push($(container)[0]);

        return arr.reduce((collection, node) => {

            let prop = window.getComputedStyle(node, null).getPropertyValue('background-image')
            let match = srcChecker.exec(prop);
            if (match) collection.add(match[1]);

            if (/^img$/i.test(node.tagName)) collection.add(node.src || node.getAttribute("data-src"));
            else if (/^frame$/i.test(node.tagName)) {

                try {
                    searchDOM(node.contentDocument || node.contentWindow.document)
                        .forEach(img => { if (img) collection.add(img); })
                } catch (e) {}
            }

            return collection;

        }, new Set());
    }


    Imagine.lazyLoad = function (lazyloadImages = undefined)
    {
        lazyloadImages = lazyloadImages || document.querySelectorAll("img[data-src]:not(.loaded)");
        if ("IntersectionObserver" in window) {

                var imageObserver = new IntersectionObserver(function (entries, observer) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            var image = entry.target;
                            var lazybox = image.closest(".lazybox");

                                image.onload = function() {
                                    this.classList.add("loaded");
                                    this.classList.remove("loading");
                                    if(lazybox) lazybox.classList.remove("loading");
                                };

                                if(lazybox) lazybox.classList.add("loading");
                                image.classList.add("loading");
                                image.src = image.dataset.src;

                            imageObserver.unobserve(image);
                        }
                });
            });

            lazyloadImages.forEach(function (image) {
                imageObserver.observe(image);
            });

        } else {

                var lazyloadThrottleTimeout;

            function lazyload() {
                if (lazyloadThrottleTimeout) {
                    clearTimeout(lazyloadThrottleTimeout);
                }

                lazyloadThrottleTimeout = setTimeout(function () {
                    var scrollTop = window.pageYOffset;
                    lazyloadImages.forEach(function (img) {
                        if (img.offsetTop < (window.innerHeight + scrollTop)) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                        }
                    });
                    if (lazyloadImages.length == 0) {
                        document.removeEventListener("scroll", lazyload);
                        window.removeEventListener("resize", lazyload);
                        window.removeEventListener("orientationChange", lazyload);
                    }
                }, 20);
            }

            document.addEventListener("scroll", lazyload);
            window.addEventListener("resize", lazyload);
            window.addEventListener("orientationChange", lazyload);
        }
    }


    Imagine.loadMedia = function(container = document.documentElement)
    {
        function loadImg (src) {
            return new Promise((resolve, reject) => {

                let img = new Image()
                    img.onload = () => {
                    resolve({
                        src: src,
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    })
                }

                img.onerror = reject
                img.src = src;
            });
        }

        function loadImgAll (imgList) {

            return new Promise((resolve, reject) => {
                Promise.all(imgList
                    .map(src => loadImg(src))
                    .map(p => p.catch(e => false))
                ).then(results => resolve(results.filter(r => r))
                ).catch(error => { reject(error); })
            })
        }

        return loadImgAll(
            Array.from(Imagine.findImages(container) ?? {})
        );
    }

    Imagine.onSplit = function(images = $("img.imagine")) {

        return Imagine.loadMedia(images).then(function (metadata) {

            $(images).each(function(i)
            {
                // if(!metadata) return;

                gridX = parseInt($(this).data("x")) || 1;
                gridY = parseInt($(this).data("y")) || 1;
                w = metadata[i].width;
                h = metadata[i].height;

                img = $(this).attr("src") || this.getAttribute("data-src");
                delay = 0.0;

                var container = $("<div>").addClass("imagine");
                    container.insertBefore(this);

                container.addClass("active");
                for (x = 0; x < gridX; x++) {

                    for (y = 0; y < gridY; y++) {

                        var id = x+y*gridY+1;

                        var width  = w / gridX * 100 / w + "%" + (gridX-1 != x ? " + 1px" : ""),
                            height = h / gridY * 100 / h + "%" + (gridY-1 != y ? " + 1px" : ""),
                            top    = h / gridY * y * 100 / h + "%",
                            left   = w / gridX * x * 100 / w + "%",
                            bkgY   = gridY > 1 ? h / (gridY-1) * y * 100 / h + "%" : "100%",
                            bkgX   = gridX > 1 ? w / (gridX-1) * x * 100 / w + "%" : "100%";

                        $("<div />")
                            .addClass("imagine-item")
                            .addClass("imagine-item-"+id)
                            .addClass("zoom")
                            .css({
                            top   : "calc("+top+")",
                            left  : "calc("+left+")",
                            width : "calc("+width+")",
                            height: "calc("+height+")",
                            backgroundImage: "url(" + img + ")",
                            backgroundPosition: bkgX + " " + bkgY,
                            backgroundSize: gridX*100+"% "+gridY*100+"%",
                            transitionDelay: x * delay + y * delay + "s"
                        }).appendTo(container);
                    }
                }

                $(this).remove();

                $(this).on("click", function() {
                    $(this).toggleClass("active");
                });

                $(window).trigger("load.imagine");
            });
        });
    };

    $(window).on("onbeforeunload", function() {
        Imagine.reset();
    });

    $(window).on("DOMContentLoaded", function() {
        Imagine.lazyLoad();
    });

    $(window).on("load", function() {
        Imagine.onLoad();
    });

    return Imagine;
});
