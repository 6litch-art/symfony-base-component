$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.collection", function () {

        var handleAddButton = function (e, o) {

            $(e).off("click.add-entry");
            $(e).on("click.add-entry", function () {
                
                var l = parseInt(o.dataset.numItems),
                    c = this.parentElement.querySelector(".collection-empty");
                null !== c && (c.outerHTML = '<div class="form-collection-items"><div class="form-widget-compound"></div></div>');
                
                var i = o.dataset.formTypeNamePlaceholder,
                    n = new RegExp(i + "__label__", "g"),
                    a = new RegExp(i, "g"),
                    s = o.dataset.prototype.replace(n, ++l).replace(a, l);
                o.dataset.numItems = l;

                var d = ".form-collection-items";
                var r = o.querySelector(d);

                if (r.insertAdjacentHTML("beforeend", s), !e) {
                    updateCollectionItemCssClasses(o);
                    var m = r.querySelectorAll(".form-collection-item"),
                        u = m[m.length - 1];
                    u.querySelector(".accordion-button").classList.remove("collapsed"), u.querySelector(".accordion-collapse").classList.add("show")
                }

                $(document).trigger("collection.item-added");
            });
            
            o.classList.add("processed");
        };

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
        
        document.querySelectorAll("button.form-collection-add-button").forEach(function (e) {
            
            var o = e.closest("[data-collection-field]");
                o && (handleAddButton(e, o), updateCollectionItemCssClasses(o));
        });
        
        document.querySelectorAll("button.form-collection-delete-button").forEach((function (e) {
            
            $(e).off("click.remove-entry");
            $(e).on("click.remove-entry", (function () {

                var o = e.closest("[data-collection-field]");
                e.closest(".form-collection-item").remove();

                $(document).trigger("collection.item-removed");
                updateCollectionItemCssClasses(o)
            }));
        }));

        $(document).on("collection.item-added collection.item-removed", function() {
            $(document).trigger("load.form_type");
        });
    });

    $(document).trigger("load.form_type.collection");
});