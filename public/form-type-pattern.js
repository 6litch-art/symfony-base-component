$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.pattern", function () {

        document.querySelectorAll("[data-pattern-field]").forEach((function (el) {

            var id = JSON.parse(el.getAttribute("data-pattern-field")) || {};
            var pattern = JSON.parse(el.getAttribute("data-pattern")) || {};
            
            console.log(id, pattern);
        }));
    });

    $(document).trigger("load.form_type.pattern");
});