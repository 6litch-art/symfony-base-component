$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.select2", function () {

        document.querySelectorAll("[data-select2-field]").forEach((function (el) {

            var sortable = el.getAttribute("data-select2-sortable") || false;

            var select2 = JSON.parse(el.getAttribute("data-select2-field")) || {};
            if("template" in select2)
                select2["template"] = Function('return ' + select2["template"])();
            if("templateResult" in select2)
                select2["templateResult"] = Function('return ' + select2["templateResult"])();
            if("templateSelection" in select2)
                select2["templateSelection"] = Function('return ' + select2["templateSelection"])();

            $(el).select2(select2);
           
            if(sortable) {
                var choices = $(el).parent().after(el).find("ul.select2-selection__rendered");
                choices.sortable({containment: 'parent'});
            }
        }));
    });

    $(document).trigger("load.form_type.select2");
});