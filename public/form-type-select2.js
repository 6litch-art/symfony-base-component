$(document).on("DOMContentLoaded", function () {

    var localCache = {};

    $(document).on("load.form_type.select2", function () {

        document.querySelectorAll("[data-select2-field]").forEach((function (el) {

            var field = $("#"+el.getAttribute("data-select2-field"));
            var defaultTemplate = function(option, that) { 

                dataAttribute = "";
                $(option["data"]).each(function(key, value) {

                    var value = option["data"][key];
                    if (value !== undefined)
                        value = value.replace(/"/g, '\\"');
                    
                    dataAttribute = key + "=\"" + value+"\" ";
                });

                var tab   = field.data("tabulation") || "1.75em";
                var depth = option["depth"] || 0;

                var href  = field.data("select2-href") || undefined;
                    href = option.id && href !== undefined ? href.replace("{0}", option.id) : undefined;

                return $('<span style="margin-left:calc('+tab+' * '+depth+')" class=\"select2-selection__entry\" '+dataAttribute+'><span>' + 
                            (option.html ? option.html : (option.icon ? '<i style="text-align: center; width: 1.25em;" class=\"'+option.icon+'\"></i> ' : '') + 
                            (option.text) + "</span>" +
                            (href ? '<span style="margin-left:1em"><a href="'+href+'"><i style="text-align: center; width: 1.25em;" class=\"fas fa-external-link-square-alt\"></i></span>' : '') +
                        '</span>')); 
            };

            var select2 = JSON.parse(el.getAttribute("data-select2-options")) || {};
                select2["template"]          = "template"          in select2 ? Function('return ' + select2["template"]         )() : defaultTemplate;
                select2["templateResult"]    = "templateResult"    in select2 ? Function('return ' + select2["templateResult"]   )() : defaultTemplate;
                select2["templateSelection"] = "templateSelection" in select2 ? Function('return ' + select2["templateSelection"])() : defaultTemplate;

            var dropdown = [];
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
                select2["ajax"]["transport"] = function (options, success) {

                    //
                    // Compute debouncing (to avoid frequent requests)
                    options["delay"] = (firstCall ? 0 : typingDelay);

                    function debounce(t, fn) {
                        
                        if(typeof(debounceFn) != "undefined") clearTimeout(debounceFn);
                        debounceFn = setTimeout(fn, t);
                    }

                    return debounce(options["delay"], function() {
                        
                        //
                        // Retrieve cache if exists
                        var term = options.data.term || '';
                        var page = options.data.page || '';
                        var index = field.attr("id")+":"+term+":"+page;
                        
                        if(options.cache && index in localCache) response = localCache[index];
                        else response = localCache[index] = $.ajax(options);
                        
                        //
                        // Default call with ajax request
                        dropdown = [];
                        firstCall = false;

                        response.done(success).done(function(e) {

                            $(e.results).each(() => dropdown.push(this.id));
                        });
                    });
                }
            }

            // Multiplicity option !
            // query: function(query) {
            //     var data = { results: []};
            //     for (var i = 0; i < fruits.length; i++) {
            //         data.results.push({"id": fruits[i] + "/" + counter, "text": fuits[i]});
            //     }
            //     counter += 1;
            //     query.callback(data);
            // },
            // formatSelection: function(item) {
            //     return item.text; // display apple, pear, ...
            // },
            // formatResult: function(item) {
            //     return item.id; // display apple/1, pear/2, ... Return item.text to see apple, pear, ...
            // },

            //
            // Pre-populated data
            if(select2["data"].length != 0) $(field).empty();
            $(field).val(select2["selected"] || []).trigger("change");
            
            var parent = parent || $(field).parent();
            $(field).select2(select2).on("select2:unselecting", function(e) {
            
                $(this).data('state', 'unselected');
            
            }).on("select2:open", function(e) {

                if ($(this).data('state') === 'unselected') {
                    $(this).removeData('state'); 
                    $(this).select2('close');
                }

                // Select all not working .....
                // $(document).on("keyup.select2", ".select2-search__field", function (e) {
                //     if (e.keyCode === 65 && e.ctrlKey ) selectAllSelect2($(this));
                // }.bind(this));

                // function selectAllSelect2(that) {
              
                //     select2.val(dropdown || []).trigger("change");
                // }
    
            }).on("select2:close", function(e) {
                
                $(this).focusout();
                $(document).off("select2:keyup");
            });

            dropdown = $(field).select2("data");
            
            var openClick = false;
            $(field).on("select2:opening", function() { openClick = true; });
            $(window).on("click", function(e) {

                if(!openClick) {

                    let container = $(field.nextElementSibling).find(".select2.select2-container")[0];
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
            if(sortable) {

                var choices = $(el.nextElementSibling).find("ul.select2-selection__rendered");
                    choices.sortable({
                        containment: 'parent',
                        swapThreshold: 0.50,
                        animation: 150,
                        update: function() {

                            var selectElement = $("#"+el.getAttribute("data-select2-field"));
                            var orderBy = selectElement.parent().find("ul.select2-selection__rendered").children("li[title]").map(function(i, obj){
                                return this.getAttribute("title");
                            });

                            orderBy.each(i => {
                                const item = Array.from(selectElement.find("option")).find(x => x.innerText === orderBy[i]);
                                if (item) item.parentElement.appendChild(item);
                            });
                        },
                    });
            }
        }));
    });

    $(document).trigger("load.form_type.select2");
});