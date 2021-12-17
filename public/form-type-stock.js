$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.stock", function () {

        document.querySelectorAll("[data-stock-field]").forEach((function (e) {

            var id = $(e).data("stock-field");
            var unlimitedStr = $(e).data("stock-unlimited");

            var input = $("#"+id);

            var btn   = $("#"+id+"-btn");
            var btnDown = $("#"+id+"-down");
            var btnUp = $("#"+id+"-up");

            var icon  = $(btn).find("i");

            $(input).prop("placeholder", unlimitedStr);
            function isUnlimited(input) { return $(input).prop("disabled") && $(input).val() == ""; }
            function setLimitedState(input, stockValue)
            {
                $(input).val(stockValue);

                $(btnUp  ).prop("disabled", false);
                $(btnDown).prop("disabled", false);
                $(input  ).prop("disabled", false);
                $(icon).addClass("fa-box-open").removeClass("fa-infinity");
                return $(input).val();
            }

            function setUnlimitedState(input)
            {
                var stockValue = $(input).val() || null;
                $(input).val(null);

                $(btnUp  ).prop("disabled", true);
                $(btnDown).prop("disabled", true);
                $(input  ).prop("disabled", true);
                $(icon).removeClass("fa-box-open").addClass("fa-infinity");
                return stockValue;
            }

            var stockValue = $(input).val() || null;
            if ($(input).val() == "") stockValue = setUnlimitedState(input);
            else stockValue = setLimitedState(input, stockValue);

            $(btn).off("click");
            $(btn).on("click", function() {

                if (isUnlimited(input)) stockValue = setLimitedState(input, stockValue);
                else stockValue = setUnlimitedState(input);

            });

            $(btnUp).off("click");
            $(btnUp).on("click", function() 
            { 
                var val = parseInt($(input).val());
                if (isNaN(val))
                    val = 0;

                if (val < parseInt($(input).attr("max")) || !$(input).attr("max"))
                    val++;

                $(input).val(val);
            });
            
            $(btnDown).off("click");
            $(btnDown).on("click", function() 
            {
                var val = parseInt($(input).val());
                if (isNaN(val))
                    val = 0;
                if (val > parseInt($(input).attr("min")) || !$(input).attr("min"))
                    val--;

                $(input).val(val);
            });
            
            $(input).off("change");
            $(input).on("change", function() {

                if ($(input).val()) stockValue = $(input).val();
                if ($(input).val() == "") setUnlimitedState(input);
            });

            // var label = $('label[for="' + stockify.target.id + '"]');

            // var targetCurrentState = o($(stockify.target).val(), {
            //     remove: /[^A-Za-z0-9\s-]/g,
            //     lower: !0,
            //     strict: !0
            // });

            // if(targetCurrentState != stockify.currentState) stockify.unlock();

            // stockify.target.setAttribute("data-required", stockify.target.getAttribute("required") || "");
            // var isTargetRequired = (stockify.locked ? stockify.field.getAttribute("required") : stockify.target.getAttribute("data-required")) == "required";
            // if (isTargetRequired) {
            //     label.addClass("required");
            //     stockify.target.setAttribute("required", true);
            // } else {
            //     label.removeClass("required");
            //     stockify.target.removeAttribute("required");
            // }

            // stockify.lockButton.addEventListener("click", function () {

            //     if(stockify.locked) stockify.updateValue();

            //     var label = $('label[for="' + stockify.target.id + '"]');
            //     var isTargetRequired = (stockify.locked ? stockify.field.getAttribute("required") : stockify.target.getAttribute("data-required")) == "required";
            //     if (isTargetRequired) {
            //         label.addClass("required");
            //         stockify.target.setAttribute("required", true);
            //     } else {
            //         label.removeClass("required");
            //         stockify.target.removeAttribute("required");
            //     }

            // });

            // $(stockify.target).on('input', function() {

            //     if(!stockify.locked) return;
            //     stockify.updateValue();
            // });
        }))
    });

    $(document).trigger("load.form_type.stock");
});