$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.select2", function () {

        document.querySelectorAll("[data-select2-field]").forEach((function (el) {

            console.log(el);
            var select2 = $(el).data('select2-field');
            
            $(el).select2(select2);
        }));

    });

    $(document).trigger("load.form_type.select2");
});