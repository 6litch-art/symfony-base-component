$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.translatable", function () {

        var submitButtons = document.querySelectorAll('button[type="submit"]');
        document.querySelectorAll("form .form-translatable").forEach(function (e) {

            var form = e.closest("form");
            var formButtons = form.querySelectorAll('button[type="submit"]');
            var navTabs = $(e).find(".nav-tabs");
            var tabContents = $(e).find(".tab-content");

            var buttons = new Set();
            $(formButtons).each(function() { buttons.add(this); });
            $(submitButtons).each(function() { if(this.form == form) buttons.add(this); });
            buttons = Array.from(buttons);

            $(buttons).off("click.translatable.submit");
            $(buttons).on("click.translatable.submit", function () {

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