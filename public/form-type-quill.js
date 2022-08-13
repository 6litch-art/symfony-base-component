$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.quill", function () {

        document.querySelectorAll("[data-quill-field]").forEach((function (el) {

            var id = el.getAttribute("data-quill-field");

            var editorId = id+"_editor";
            if ($('#'+editorId).hasClass("ql-container")) // Quill editor already loaded (avoid toolbar duplication)
                $('#'+editorId).parent().find(".ql-toolbar").remove();

            var disableHTML = false;

            var quill = JSON.parse(el.getAttribute("data-quill-options")) || {};
                quill.modules.toolbar.push(["html"]);
                quill.modules.toolbar = {
                    container: quill.modules.toolbar,
                    handlers: {
                        'html': function() {

                            disableHTML = !disableHTML;
                            if(disableHTML) {

                                quillContent = $("#"+editorId).find(".ql-editor").html();
                                $("#"+editorId).find(".ql-editor").text(quillContent);
                                $("#"+editorId).parent().find(".ql-toolbar").toggleClass("ql-toolbar-html-only");

                            } else {

                                quillContent = $("#"+editorId).find(".ql-editor").text();
                                $("#"+editorId).find(".ql-editor").html(quillContent);
                                $("#"+editorId).parent().find(".ql-toolbar").toggleClass("ql-toolbar-html-only");
                            }
                        }
                    }
                };

            var quillEditor = new Quill('#'+editorId, quill);
                quillEditor.on('text-change', function() {

                    var html = $('#'+editorId).find(".ql-editor")[0].innerHTML || "";
                    document.getElementById(id).value = html;
                });


            $('#'+editorId).find(".ql-editor").css("min-height", quill["height"]);
        }));
    });

    $(document).trigger("load.form_type.quill");
});