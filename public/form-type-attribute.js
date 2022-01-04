$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.attribute", function () {

        document.querySelectorAll("form .form-attribute").forEach(function (e) {

        });
    });

    $(document).trigger("load.form_type.attribute");
});