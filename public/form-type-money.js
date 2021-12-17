$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.money", function () {

        document.querySelectorAll("[data-currency-field]").forEach((function (e) {
 
            var currency = $("#"+$(e).data("currency-field"));
            var input    = $(e);
            
            var id       = $(input).attr("id");
            var btn      = $("#"+id+"-btn");
            var selected = $("#"+id+"-selected");
            var list     = $("#"+id+"-list").find("li.item");

            var amount       = $("#"+id).val();
            var scale        = $(e).data("scale-field") || 0;
            var target       = $("#"+$(e).data("target-field"));
            var baseExchange = 1;
            
            var decimal   = amount[amount.length - (scale+1)] || ".";
            
            function num2str(amount, scale, decimal = ",") {

                var separator = (decimal == ".") ? "," : "";                
                [a,b] = amount.toString().split(".");
                
                a = a || "";
                b = b || "";

                var scale2 = b.length - scale;
                    scale2 = scale < 0 ? 0 : scale; 

                var factor = 10**(scale2);
                b = Math.round(b/factor);
                b = b.toString();
                while(b.length < scale) 
                    b = "0" + b;

                if(separator != "") {

                    function addCommas(x) { return x.replace(/\B(?=(\d{3})+(?!\d))/g, separator); }
                    return addCommas(a)+decimal+addCommas(b);
                }

                return a+decimal+b;
            }

            function str2num(amount, scale) {
            
                var decimal   = amount[amount.length - (scale+1)] || ".";
                if (!isNaN(parseInt(decimal))) decimal = ".";
                
                [a, b] = amount.split(decimal);
    
                var factor = 10**scale;
                return (factor*parseInt(a) + parseInt(b))/factor;
            }

            var num = str2num(amount, scale);

            list.off("click");
            list.on("click", function() {

                var label    = $(this).data("label");
                var code     = $(this).data("code");
                var exchange = $(this).data("exchange");

                $(selected).html(this.innerHTML);
                $(btn).html(label);

                num = num*exchange/baseExchange;
                baseExchange = exchange;
                
                $(input).val(num2str(num, scale));
                if(currency) $(currency).val(code);
            });
            
            input.val(num2str(num, scale, decimal));
        }))
    });

    $(document).trigger("load.form_type.money");
});