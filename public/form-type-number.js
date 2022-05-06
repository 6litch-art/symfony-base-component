$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.number", function () {

        document.querySelectorAll("[data-number-field]").forEach((function (e) {

            var id = $(e).data("number-field");
            var input = $("#"+id);

            var min = $(e).data("number-min");
            var max = $(e).data("number-max");
            var stepUp = $(e).data("number-up");
            var stepDown = $(e).data("number-down");
            
            var throttleDown =  $(e).data("number-down-throttle");
            var throttleUp   =  $(e).data("number-up-throttle");
            
            var btnDown = $("#"+id+"-down");
            var btnUp = $("#"+id+"-up");

            var intervalUp, intervalDown;

            var numberValue = $(input).val() || 0;
            if(numberValue === 0) $(input).val(0);
            
            var onClickUp = function() {

                var val = parseFloat($(input).val());
                if (isNaN(val))
                    val = 0;
                if (val < parseFloat(max) || max === undefined)
                    val = val + Math.abs(parseFloat(stepUp ?? 1));
                if (val > parseFloat(max) &&  max !== undefined)
                    val = parseFloat(max);

                $(input).val(val);
                $(input).trigger("input");
            }

            var onClickDown = function() {

                var val = parseFloat($(input).val());
                if (isNaN(val))
                    val = 0;

                if (val > parseFloat(min) || min === undefined)
                    val = val - Math.abs(parseFloat(stepDown ?? 1));

                if (val < parseFloat(min) &&  min !== undefined)
                    val = parseFloat(min);

                $(input).val(val);
                $(input).trigger("input");
            };

            $(btnUp).off("mousedown.number mouseup.number mouseleave.number touchstart.number touchend.number touchcancel.number");
            $(btnUp).on("mousedown.number touchstart.number", function() {
                onClickUp();
                if(throttleUp) intervalUp = setInterval(onClickUp, throttleUp); 

            }).on('mouseup.number mouseleave.number touchend.number touchcancel.number', function() {
                 if(intervalUp) clearInterval(intervalUp); 
            });
            
            $(btnDown).off("mousedown.number mouseup.number mouseleave.number touchstart.number touchend.number touchcancel.number");
            $(btnDown).on("mousedown.number touchstart.number", function() {
                onClickDown();
                if(throttleDown) intervalDown = setInterval(onClickDown, throttleDown); 

            }).on('mouseup.number mouseleave.number touchend.number touchcancel.number', function() { 
                if(intervalDown) clearInterval(intervalDown);
            });

            $(input).off("input.number");
            $(input).on("input.number", function() {

                if ($(input).val()) numberValue = $(input).val();
                if ($(input).val() == "") setUnlimitedState(input);
            });
        }))
    });

    $(document).trigger("load.form_type.number");
});