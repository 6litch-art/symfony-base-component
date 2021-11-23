$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.translatable", function () {

        document.querySelectorAll("form .form-translatable").forEach(function (e) {
            
            var form = e.closest("form");
            var button = form.querySelector('button[type="submit"]');

            var navTabs = $(e).find(".nav-tabs");
            var tabContents = $(e).find(".tab-content");
            
            $(button).off("click.translatable.submit");
            $(button).on("click.translatable.submit", function () {

                var invalidRequired = $(':required:invalid', form);
                if (invalidRequired.length) {

                    var tabPane = $(invalidRequired[0].closest(".tab-pane"));
                    var navItem = navTabs.children()[tabPane.index()];
                    
                    $(navItem).find("button")
                        .one('shown.bs.tab', function() { form.reportValidity(); })
                        .tab("show");
                }
            });
        });
    });

    $(document).trigger("load.form_type.translatable");
});