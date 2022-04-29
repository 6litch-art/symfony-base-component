$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.number", function () {

        document.querySelectorAll("[data-number-field]").forEach((function (e) {

            var id = $(e).data("number-field");
            var input = $("#"+id);

            var btn   = $("#"+id+"-btn");
            var btnDown = $("#"+id+"-down");
            var btnUp = $("#"+id+"-up");

            var numberValue = $(input).val() || 0;
            if(numberValue === 0) $(input).val(0);

            $(btnUp).off("click");
            $(btnUp).on("click", function() 
            { 
                var val = parseFloat($(input).val());
                if (isNaN(val))
                    val = 0;
                if (val < parseFloat($(input).attr("data-number-max")) || !$(input).attr("data-number-max"))
                    val = val + Math.abs(parseFloat($(input).attr("data-number-up") ?? 1));
                if (val > parseFloat($(input).attr("data-number-max")) &&  $(input).attr("data-number-max"))
                    val = parseFloat($(input).attr("data-number-max"));

                $(input).val(val);
                $(input).trigger("input");
            });
            
            $(btnDown).off("click");
            $(btnDown).on("click", function() 
            {
                var val = parseFloat($(input).val());
                if (isNaN(val))
                    val = 0;

                if (val > parseFloat($(input).attr("data-number-min")) || !$(input).attr("data-number-min"))
                    val = val - Math.abs(parseFloat($(input).attr("data-number-down") ?? 1));

                if (val < parseFloat($(input).attr("data-number-min")) &&  $(input).attr("data-number-min"))
                    val = parseFloat($(input).attr("data-number-min"));

                $(input).val(val);
                $(input).trigger("input");
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