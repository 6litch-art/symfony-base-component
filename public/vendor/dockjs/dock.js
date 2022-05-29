(function (window) {

    window.fn.resizeOnApproach = function (event) {

        // Default options
        var defaultOptions = {y:false, split:1, zoom:1, jump:0, trigger: 1};
        event && window.extend(defaultOptions, event);

        var icon = this;
        if( ! $(icon).length ) return;

        // Initial parameters
        var fontSize0 = parseInt($(icon).css("font-size").replace("px", ""));
        var width0 = parseInt($(icon).css("width").replace("px", ""));
        var height0 = parseInt($(icon).css("height").replace("px", ""));
        var borderRadius0 = [
            parseInt($(icon).css("borderTopLeftRadius").replace("px", "")),
            parseInt($(icon).css("borderTopRightRadius").replace("px", "")),
            parseInt($(icon).css("borderBottomRightRadius").replace("px", "")),
            parseInt($(icon).css("borderBottomLeftRadius").replace("px", "")),
        ];

        var margin0 = [
            parseInt($(icon).css("margin-top").replace("px", "")),
            parseInt($(icon).css("margin-right").replace("px", "")),
            parseInt($(icon).css("margin-bottom").replace("px", "")),
            parseInt($(icon).css("margin-left").replace("px", ""))
        ]

        var trigger0 = 3 * ((defaultOptions.y == false) ? width0:height0)
                         * defaultOptions.zoom * defaultOptions.trigger;

        // Main variables
        var i = ((defaultOptions.y == false) ? width0:height0)*defaultOptions.zoom - ((defaultOptions.y == false) ? width0:height0),
            k = i / trigger0;

        // Initialization force some properties to fix values
        window(document).ready(function () {

            icon.each(function () {

                if(defaultOptions.y == false) { // X axis

                    this.style.top      = 0 + "px";
                    this.style.fontSize = (fontSize0) + "px";
                    this.style.width    =     width0  + "px";
                    this.style.height   =     height0 + "px";
                    this.style.marginRight = margin0[1] + "px";
                    this.style.marginLeft  = margin0[3] + "px";

                    this.style.borderTopLeftRadius     = borderRadius0[0] + "px";
                    this.style.borderTopRightRadius    = borderRadius0[1] + "px";
                    this.style.borderBottomRightRadius = borderRadius0[2] + "px";
                    this.style.borderBottomLeftRadius  = borderRadius0[3] + "px";

                } else { //Y axis

                    this.style.top          = 0 + "px";
                    this.style.fontSize     = (fontSize0) + "px";
                    this.style.width        = width0  + "px";
                    this.style.height       = height0 + "px";
                    this.style.marginTop    = margin0[0] + "px";
                    this.style.marginBottom = margin0[2] + "px";

                    this.style.borderTopLeftRadius     = borderRadius0[0] + "px";
                    this.style.borderTopRightRadius    = borderRadius0[1] + "px";
                    this.style.borderBottomRightRadius = borderRadius0[2] + "px";
                    this.style.borderBottomLeftRadius  = borderRadius0[3] + "px";
                }
            })
        });

        // Dynamic dock
        window(document).mousemove(function (mouse) {

            var x0 = mouse.pageX,
                y0 = mouse.pageY;

            // Process each icon
            icon.each(function() {

                // Main parameters
                var offset = window(this).offset();
                var x = offset.left, y = offset.top;
                var w  = $(this).width(), h = $(this).height();

                var magnification = 1;
                var height = height0, width = width0;
                if(defaultOptions.y == false) {

                    // Compute distance & magnification
                    width = distToSqEdge(w, x+w/2, y+h/2, x0, y0);
                    if (width >= trigger0) width = width0;
                    else {
                        if (width < 0) width = 0;
                        width = width0 + (i - width * k);
                    }

                    magnification = width/width0;
                    height      = parseInt(height0 * magnification);

                } else {

                    height = distToSqEdge(h, x+w/2, y+h/2, x0, y0);
                    if (height >= trigger0) height = height0;
                    else {
                        if (height < 0) height = 0;
                        height = height0 + (i - height * k);
                    }

                    magnification = height/height0;
                    width      = parseInt(width0 * magnification);
                }

                // Compute magnified parameters
                var fontSize    = parseInt(fontSize0 * magnification);
                var split       = parseInt(((defaultOptions.y == false) ? width0:height0) * defaultOptions.split);
                var jump        = parseInt(height0*defaultOptions.jump * (1-magnification));

                this.style.borderTopLeftRadius     = borderRadius0[0]*(magnification) + "px";
                this.style.borderTopRightRadius    = borderRadius0[1]*(magnification) + "px";
                this.style.borderBottomRightRadius = borderRadius0[2]*(magnification) + "px";
                this.style.borderBottomLeftRadius  = borderRadius0[3]*(magnification) + "px";

                // Apply settings
                if(defaultOptions.y == false) {

                    var marginRight = -split/2*(1 - magnification) + margin0[1]*(magnification);
                    var marginLeft  = -split/2*(1 - magnification) + margin0[3]*(magnification);
                    var marginTop   = -fontSize0 * (1-magnification);

                    this.style.fontSize  = fontSize + "px";
                    this.style.top       = jump     + "px";
                    this.style.width     = width    + "px";
                    this.style.height    = height   + "px";
                    this.style.marginRight = marginRight + "px";
                    this.style.marginLeft  = marginLeft  + "px";
                    this.style.marginTop = marginTop + "px";

                } else {

                    var marginTop = -split/2*(1 - magnification) + margin0[0]*(magnification);
                    var marginBottom  = -split/2*(1 - magnification) + margin0[2]*(magnification);

                    this.style.fontSize  = fontSize + "px";
                    this.style.left       = jump     + "px";
                    this.style.width     = width    + "px";
                    this.style.height    = height   + "px";
                    this.style.marginTop = marginTop + "px";
                    this.style.marginBottom  = marginBottom  + "px";
                }
            })
        })
    }

})(jQuery);


function distToSqEdge(d, c, a, f, g) {
    vx = f - c;
    vy = g - a;
    a = c = 0;
    if (vx > vy)
        if (vx > -vy) c = 1;
        else a = 1;
    else if (vx > -vy) a = -1;
    else c = -1;
    vlength = Math.sqrt(vx * vx + vy * vy);
    vux = vx / vlength;
    vuy = vy / vlength;
    cosA = vux * c + vuy * a;
    centreToSqEdge = Math.abs(0.5 * d / cosA);
    return mouseToSquareEdge = vlength - centreToSqEdge
};
