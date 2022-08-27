$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.quill", function () {

        document.querySelectorAll("[data-quill-field]").forEach((function (el) {

            var id = el.getAttribute("data-quill-field");

            var placeholder = el.getAttribute("data-quill-placeholder");
            var placeholderHTML = el.getAttribute("data-quill-placeholder");

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

                            var quillEditor = $("#"+editorId).find(".ql-editor");
                            var quillToolbar = $("#"+editorId).parent().find(".ql-toolbar");

                            if(disableHTML) {

                                quillContent = quillEditor.text();
                                quillEditor.html(quillContent);
                                quillToolbar.toggleClass("ql-toolbar-html-only");
                                if(placeholder) quillEditor.css("placeholder", placeholder);

                            } else {

                                quillContent = quillEditor.html();
                                if(quillContent == "<p><br></p>") quillContent = "";

                                quillEditor.text(quillContent);
                                quillToolbar.toggleClass("ql-toolbar-html-only");
                                if(placeholderHTML) quillEditor.css("placeholder", placeholderHTML);
                            }

                            disableHTML = !disableHTML;
                        }
                    }
                };

                // var Clipboard = Quill.import('modules/clipboard');
                // var Delta = Quill.import('delta');

                // class PlainClipboard extends Clipboard {
                // convert(html = null) {
                //     if (typeof html === 'string') {
                //     this.container.innerHTML = html;
                //     }
                //     let text = this.container.innerText;
                //     this.container.innerHTML = '';
                //     return new Delta().insert(text);
                // }
                // }

                // Quill.register('modules/clipboard', PlainClipboard, true);

            var quillEditor = new Quill('#'+editorId, quill);
                quillEditor.on('text-change', function() {

                    var html = $('#'+editorId).find(".ql-editor")[0].innerHTML || "";
                    document.getElementById(id).value = html;
                });

            $('#'+editorId).closest("form").on("submit.quill", function(e) {

                var quillEditor = $("#"+editorId).find(".ql-editor");
                var quillToolbar = $("#"+editorId).parent().find(".ql-toolbar");

                if(!disableHTML) {

                    quillContent = quillEditor.text();
                    quillEditor.html(quillContent);
                    quillToolbar.toggleClass("ql-toolbar-html-only");
                    if(placeholder) quillEditor.css("placeholder", placeholder);

                    disableHTML = !disableHTML;
                }
            });

            $('#'+editorId).find(".ql-editor").css("min-height", quill["height"]);
        }));
    });

    $(document).trigger("load.form_type.quill");
});