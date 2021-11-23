$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.collection", function () {

        var updateCollectionItemCssClasses = function (e) {

            if (null !== e) {

                var t = e.querySelectorAll(".form-collection-item");
                    t.forEach(function (e) {
                        return e.classList.remove("form-collection-item-first", "form-collection-item-last")
                    });

                var o = t[0];
                if (void 0 !== o) {
                    o.classList.add("form-collection-item-first");
                    var l = t[t.length - 1];
                    void 0 !== l && l.classList.add("form-collection-item-last")
                }
            }
        }

        document.querySelectorAll("form .form-collection").forEach(function (e) {

            var form = e.closest("form");
            var button = form.querySelector('button[type="submit"]');  

            $(button).off("click.collection.submit");
            $(button).on("click.collection.submit", function () {

                var invalidRequired = $(':required:invalid', form);
                if (invalidRequired.length)
                    $(invalidRequired[0].closest(".accordion-collapse")).collapse("show");
             });
        });

        document.querySelectorAll("button.form-collection-add-button").forEach(function (e) {
            
            $(e).off("click.collection.add-entry");
            $(e).on("click.collection.add-entry", function () {
                    
                var o = e.closest("[data-collection-field]");
                
                var l = parseInt(o.dataset.numItems),
                    c = e.parentElement.querySelector(".collection-empty");
                
                null !== c && (c.outerHTML = '<div class="form-collection-items"></div>');
                
                var i = o.dataset.formTypeNamePlaceholder,
                    n = new RegExp(i + "__label__", "g"),
                    a = new RegExp(i, "g"),
                    s = o.dataset.prototype.replace(n, ++l).replace(a, l);
                
                o.dataset.numItems = l;

                var d = ".form-collection-items";
                var r = o.querySelector(d);

                r.insertAdjacentHTML("beforeend", s);
                updateCollectionItemCssClasses(o);
                var m = r.querySelectorAll(".form-collection-item"),
                    u = m[m.length - 1];

                u.querySelector(".accordion-button").classList.remove("collapsed");
                u.querySelector(".accordion-collapse").classList.add("show")
                o.classList.add("processed");

                $(u).collapse("show");

                $(document).trigger("collection.item-added");
            });
        });
        
        document.querySelectorAll("button.form-collection-delete-button").forEach((function (e) {
            
            $(e).off("click.collection.remove-entry");
            $(e).on("click.collection.remove-entry", (function () {

                var o = e.closest("[data-collection-field]");
                var f = e.closest(".form-collection-item");

                $(o).find(f).on('hidden.bs.collapse', function() {
                
                    $(this).parent().remove();
                    var l = o.dataset.numItems = $(o).find(".form-collection-item").length;
                    if (l == 0) {
    
                        var collectionItems = $(o).find(".form-collection-items")[0] || undefined;
                        if (collectionItems)
                            collectionItems.insertAdjacentHTML("beforebegin", o.dataset.emptyCollection)
                        
                        $(collectionItems).remove();
                    }
    
                    $(document).trigger("collection.item-removed");
                    updateCollectionItemCssClasses(o);
                });

                $(o).find(f).collapse("hide");
            }));
        }));

        $(document).off("collection.item-added collection.item-removed");
        $(document).on ("collection.item-added collection.item-removed", function() {
            $(document).trigger("load.form_type");
        });
    });

    $(document).trigger("load.form_type.collection");
});