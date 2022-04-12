$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.boolean", function () {

        document.querySelectorAll("[data-boolean-field]").forEach((function (el) {
            
            var id = el.getAttribute("data-boolean-field");

            var onCheck        = el.getAttribute("data-boolean-confirmation-check") ?? false;
            var onUncheck      = el.getAttribute("data-boolean-confirmation-uncheck") ?? false;
            var onConfirmation = false;

            $("#"+id).on("click", function (e) {

                var checkbox = $(this);
                if (onConfirmation) {
                    onConfirmation = false;

                    return true;
                }

                if ((checkbox.prop("checked") && onCheck) || (!checkbox.prop("checked") && onUncheck)) {

                    $('#'+id+'-modal').modal('show');
                    e.preventDefault();
                    return false;
                }
                
                var checkboxBak = !checkbox.prop("checked");
                fetch(checkbox.data("toggle-url") + "&newValue=" + checkbox.prop("checked").toString(), {
                    method: "PATCH",
                    headers: { "X-Requested-With": "XMLHttpRequest" }
                }).then((function (t) {
                    checkbox.removeClass("invalid-feedback d-block");
                })).then((function () {})).catch((function () {
                    console.log("ARG", checkboxBak);
                    checkbox.prop("checked", checkboxBak).addClass("invalid-feedback d-block");
                    console.log(checkbox.prop("checked"));
                }));
            });

            $("#"+id+"-confirm").on("click", function (e) {

                $('#'+id+'-modal').modal('hide');
                onConfirmation = true;

                var checkbox = $("#"+id)[0];
                    checkbox.click();
            });
        }));
    });

    $(document).trigger("load.form_type.boolean");
});