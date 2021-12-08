$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.select2", function () {

        document.querySelectorAll("[data-select2-field]").forEach((function (el) {

            var field = $("#"+el.getAttribute("data-select2-field"));

            var select2 = JSON.parse(el.getAttribute("data-select2-options")) || {};
            if("template" in select2)
                select2["template"] = Function('return ' + select2["template"])();
            if("templateResult" in select2)
                select2["templateResult"] = Function('return ' + select2["templateResult"])();
            if("templateSelection" in select2)
                select2["templateSelection"] = Function('return ' + select2["templateSelection"])();

            if("ajax" in select2) {

                if("data" in select2["ajax"])
                    select2["ajax"]["data"] = Function('return ' + select2["ajax"]["data"])();
                if("processResults" in select2["ajax"])
                    select2["ajax"]["processResults"] = Function('return ' + select2["ajax"]["processResults"])();

                //
                // Debounce option (instead of delay..)
                var firstCall = true;
                var typingDelay = select2["ajax"]["delay"] || 0;
                var debounceFn = true;

                select2["ajax"]["delay"] = 0;
                select2["ajax"]["transport"] = function (params, success) {

                    params["delay"] = (firstCall ? 0 : typingDelay);

                    function debounce(t, fn) {
                        
                        if(typeof(debounceFn) != "undefined") clearTimeout(debounceFn);
                        debounceFn = setTimeout(fn, t);
                    }

                    return debounce(params["delay"], function() {
                        firstCall = false;
                        return $.ajax(params).done(success);
                    });
                }
            }

            var parent = parent || $(field).parent();
            $(field).select2(select2).on("select2:unselecting", function(e) {
            
                $(this).data('state', 'unselected');
            
            }).on("select2:open", function(e) {
                
                if ($(this).data('state') === 'unselected') {
                    $(this).removeData('state'); 
                    $(this).select2('close');
                }

            }).on("select2:close", function(e) {
                
                $(this).focusout();

            });

            var container = $(parent).after(field).find(".select2.select2-container")[0];

            var openClick = false;
            $(field).on("select2:opening", function() { openClick = true; });
            $(window).on("click", function(e) {

                if(!openClick) {

                    let results = $(document.body).find(".select2-results")[0];
                    let target = e.target;

                    if(!select2["closeOnSelect"]) {

                        do { if (target == container || target == results) return; } 
                        while ((target = target.parentNode));
                    }

                    $(field).select2("close");
                }

                openClick = false;
            });

            var sortable = el.getAttribute("data-select2-sortable") || false;
            if(sortable) {
                var choices = $(parent).after(el).find("ul.select2-selection__rendered");
                choices.sortable({containment: 'parent'});
            }
        }));
    });

    $(document).trigger("load.form_type.select2");
});