(() => {
    var e = function (e) {
        document.querySelectorAll("button.field-collection-add-button").forEach((function (e) {
            var o = e.closest("[data-collection-field]");
            o && !o.classList.contains("processed") && (t.handleAddButton(e, o), t.updateCollectionItemCssClasses(o))
        })), document.querySelectorAll("button.field-collection-delete-button").forEach((function (e) {
            e.addEventListener("click", (function () {
                var o = e.closest("[data-collection-field]");
                e.closest(".form-group").remove(), document.dispatchEvent(new Event("collection.item-removed")), t.updateCollectionItemCssClasses(o)
            }))
        }))
    };
    window.addEventListener("DOMContentLoaded", e), document.addEventListener("collection.item-added", e);
    var t = {
        handleAddButton: function (e, o) {
            e.addEventListener("click", (function () {
                var e = o.classList.contains("field-array"),
                    l = parseInt(o.dataset.numItems),
                    c = this.parentElement.querySelector(".collection-empty");
                null !== c && (c.outerHTML = e ? '<div class="form-collection-items"></div>' : '<div class="form-collection-items"><div class="accordion"><div class="form-widget-compound"></div></div></div>');
                var i = o.dataset.formTypeNamePlaceholder,
                    n = new RegExp(i + "label__", "g"),
                    a = new RegExp(i, "g"),
                    s = o.dataset.prototype.replace(n, ++l).replace(a, l);
                o.dataset.numItems = l;
                var d = e ? ".form-collection-items" : ".form-collection-items .accordion > .form-widget-compound > .field-collection";
                var r = o.querySelector(d);

                if (r.insertAdjacentHTML("beforeend", s), !e) {
                    t.updateCollectionItemCssClasses(o);
                    var m = r.querySelectorAll(".field-collection-item"),
                        u = m[m.length - 1];
                    u.querySelector(".accordion-button").classList.remove("collapsed"), u.querySelector(".accordion-collapse").classList.add("show")
                }
                document.dispatchEvent(new Event("collection.item-added"))
            })), o.classList.add("processed")
        },
        updateCollectionItemCssClasses: function (e) {
            if (null !== e) {
                var t = e.querySelectorAll(".field-collection-item");
                t.forEach((function (e) {
                    return e.classList.remove("field-collection-item-first", "field-collection-item-last")
                }));
                var o = t[0];
                if (void 0 !== o) {
                    o.classList.add("field-collection-item-first");
                    var l = t[t.length - 1];
                    void 0 !== l && l.classList.add("field-collection-item-last")
                }
            }
        }
    }
})();