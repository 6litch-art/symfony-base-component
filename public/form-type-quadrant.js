$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.quadrant", function () {

        document.querySelectorAll("[data-quadrant-field]").forEach((function (e) {
 
            var id    = $(e).data("quadrant-field");
            var value = $(e).data("quadrant-value");

            $("#"+id+"_matrix button").each(function(k) {
            
                if ($(this).data("quadrant") === value)
                    $(this).addClass("maintain");
            });

            $("#"+id+"_matrix button").off("click");
            $("#"+id+"_matrix button").on("click", function() {

                $("#"+id).val($(this).data("quadrant"));

                $("#"+id+"_matrix button").removeClass("maintain");
                $(this).addClass("maintain");
            });
        }))
    });

    $(document).trigger("load.form_type.quadrant");
});