$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.quill", function () {

        document.querySelectorAll("[data-quill-field]").forEach((function (el) {

            var id = el.getAttribute("data-quill-field");

            var editorId = id+"_editor";
            if ($('#'+editorId).hasClass("ql-container")) // Quill editor already loaded (avoid toolbar duplication)
                $('#'+editorId).parent().find(".ql-toolbar").remove();

            var quill = JSON.parse(el.getAttribute("data-quill-options")) || {};

            var quill_editor = new Quill('#'+editorId, quill);
                quill_editor.on('text-change', function() {

                    var html = $('#'+editorId).find(".ql-editor")[0].innerHTML || "";
                    document.getElementById(id).value = html;
                });

            $('#'+editorId).find(".ql-editor").css("min-height", quill["height"]);
        }));
    });

    $(document).trigger("load.form_type.quill");
});