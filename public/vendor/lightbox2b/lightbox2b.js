$(document).on("DOMContentLoaded.lightbox", function () {

    var original = {};

    function args(_arguments) { return Array.prototype.slice.apply(_arguments); }
    lightbox.trigger = function() { $(original).trigger.apply($(lightbox.lightbox), args(arguments)); };
    lightbox.on = function() { $(original).on.apply($(lightbox.lightbox), args(arguments)); };

    original['init'] = lightbox.init;
    lightbox.init = function() {

        var result = original['init'].apply(this, arguments);
        var _args = args(arguments);
            _args.unshift(result);
            _args.unshift(this);

        lightbox.$container.trigger('onInit', _args);
    };
    
    original['start'] = lightbox.start;
    lightbox.start = function() {

        var result = original['start'].apply(this, arguments);
        var _args = args(arguments);
            _args.unshift(result);
            _args.unshift(this);

        lightbox.$container.trigger('onStart', _args);
    };

    original['end'] = lightbox.end;
    lightbox.end = function() {

        var result = original['end'].apply(this, arguments);
        var _args = args(arguments);
            _args.unshift(result);
            _args.unshift(this);

        lightbox.$container.trigger('onEnd', _args);
    };

    original['changeImage'] = lightbox.changeImage;
    lightbox.changeImage = function() {

        var _args = args(arguments);
            _args.unshift(this);

        this.trigger('onBeforeChangeImage', _args);
        var result = original['changeImage'].apply(this, arguments);

        _args.unshift(result);
        lightbox.$container.trigger('onChangeImage', _args);
    };

    original['showImage'] = lightbox.showImage;
    lightbox.showImage = function() {

        var result = original['showImage'].apply(this, arguments);
        var _args = args(arguments);
            _args.unshift(result);
            _args.unshift(this);

        lightbox.$container.trigger('onShowImage', _args);
    };

    original['sizeContainer'] = lightbox.sizeContainer;
    lightbox.sizeContainer = function() {

        var result = original['sizeContainer'].apply(this, arguments);
        var _args = args(arguments);
            _args.unshift(result);
            _args.unshift(this);

        lightbox.$container.trigger('onSizeContainer', _args);
    };
});

$(window).on("load.ligthbox", function () {

    if (lightbox.$container) {
        lightbox.$container.on('onStart', (event, result, self) => $('html,body').css('overflow', 'hidden'));
        lightbox.$container.on('onEnd'  , (event, result, self) => $('html,body').css('overflow', ''));
    }
});