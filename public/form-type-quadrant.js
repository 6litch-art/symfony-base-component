$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.quadrant", function () {

        document.querySelectorAll("[data-quadrant-field]").forEach((function (e) {
 
            var quadrant = $("#"+$(e).data("quadrant-field"));
            console.log(quadrant);
        }))
    });

    $(document).trigger("load.form_type.quadrant");
});