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

                if ((checkbox.checked && onCheck) || (!checkbox.checked && onUncheck)) {

                    $('#'+id+'-modal').modal('show');
                    e.preventDefault();
                    return false;
                }
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