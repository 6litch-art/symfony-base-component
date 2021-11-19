$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.avatar", function () {

        document.querySelectorAll("[data-avatar-field]").forEach(function (el) {

            var id = el.getAttribute("data-avatar-field");

            var cropper = el.getAttribute("data-avatar-cropper") || null;
            if (cropper) {

                document.getElementById(id+"_file").addEventListener("change", function() {

                    var display = (document.getElementById(id+"_file").value !== "") ? "flex" : "none";
                    document.getElementById(id+"_deleteBtn2").style.display = display;
                });

            } else {

                document.getElementById(id+"_raw").addEventListener("change", function() {

                    var display = (document.getElementById(id+"_raw").value !== "") ? "flex" : "none";
                    document.getElementById(id+"_deleteBtn2").style.display = display;
                });
            }

            document.getElementById(id+"_deleteBtn2").addEventListener("click", function() {

                document.getElementById(id+"_raw").value = '';
                document.getElementById(id+"_deleteBtn").click();
            });

            document.getElementById(id+"_deleteBtn").addEventListener("click", function() {

                document.getElementById(id+"_raw").value = '';
                document.getElementById(id+"_deleteBtn2").style.display = 'none';
            });
        
        });

    });

    $(document).trigger("load.form_type.avatar");
});

