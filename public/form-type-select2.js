$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.select2", function () {

        document.querySelectorAll("[data-select2-field]").forEach((function (el) {

            var select2 = JSON.parse(el.getAttribute("data-select2-field")) || {};
            if("template" in select2)
                select2["template"] = Function('return ' + select2["template"])();
            if("templateResult" in select2)
                select2["templateResult"] = Function('return ' + select2["templateResult"])();
            if("templateSelection" in select2)
                select2["templateSelection"] = Function('return ' + select2["templateSelection"])();
            if("initSelection" in select2)
                select2["initSelection"] = Function('return ' + select2["initSelection"])();

            if("data" in select2["ajax"])
                select2["ajax"]["data"] = Function('return ' + select2["ajax"]["data"])();
            if("processResults" in select2["ajax"])
                select2["ajax"]["processResults"] = Function('return ' + select2["ajax"]["processResults"])();
 
            var firstCall = true;
            var typingDelay = select2["ajax"]["delay"] || 0;
            var debounceFn = true;

            select2["ajax"]["delay"] = 0;
            select2["ajax"]["transport"] = function (params, success) {

                params["delay"] = (firstCall ? 0 : typingDelay);

                function debounce(t, fn) {
                    
                    if(typeof(debounceFn) != "undefined")
                        clearTimeout(debounceFn);

                    debounceFn = setTimeout(fn, t);
                }

                return debounce(params["delay"], function() {
                    firstCall = false;
                    return $.ajax(params).done(success);
                });
            }

            var parent = parent || $(el).parent();
            $(el).select2(select2);
            var container = $(parent).after(el).find(".select2.select2-container")[0];

            var openClick = false;
            $(el).on("select2:opening", function() { openClick = true; });
            $(container).on("click", function() {

            });
            $(window).on("click", function(e) {

                if(!openClick) {

                    let results = $(document.body).find(".select2-results")[0];
                    let target = e.target;

                    if(!select2["closeOnSelect"]) {

                        do { if (target == container || target == results) return; } 
                        while ((target = target.parentNode));
                    }

                    $(el).select2("close");
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