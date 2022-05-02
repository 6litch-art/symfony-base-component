
$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.cropper", function () {

        document.querySelectorAll("[data-cropper-field]").forEach((function (el) {

            var cropper;
            var cropperOptions = JSON.parse(el.getAttribute("data-cropper") || "");

            var id      = el.getAttribute("data-cropper-field");
            var image = document.querySelector("#"+id+"_image");

            $("#"+id+"_image").off("load.number");
            $("#"+id+"_image").on("load.number", () => $("#"+id+"_loader").remove());

            var defaultCrop = function(event) {

                $("#"+id+"_x").val(Math.round(event.detail.x));
                $("#"+id+"_y").val(Math.round(event.detail.y));
                $("#"+id+"_width").val(Math.round(event.detail.width));
                $("#"+id+"_height").val(Math.round(event.detail.height));
                $("#"+id+"_rotate").val(Math.round(event.detail.rotate));
                $("#"+id+"_scaleX").val(Math.round(event.detail.scaleX));
                $("#"+id+"_scaleY").val(Math.round(event.detail.scaleY));
            };

            var updateCropper = function()
            {
                var x   = Math.round($("#"+id+"_x").val());
                var y    = Math.round($("#"+id+"_y").val());
                var width  = Math.round($("#"+id+"_width").val());
                var height = Math.round($("#"+id+"_height").val());
                var rotate = Math.round($("#"+id+"_rotate").val());
                var scaleY = Math.round($("#"+id+"_scaleY").val());
                var scaleX = Math.round($("#"+id+"_scaleX").val());

                data = cropper.getData();
                x0 = Math.round(data["x"]);
                y0 = Math.round(data["y"]);

                if(x < 0) width = width + Math.abs(x-x0);
                if(y < 0) height = height + Math.abs(y-y0);

                data["x"]      = x;
                data["y"]      = y;
                data["width"]  = width;
                data["height"] = height;
                data["rotate"] = rotate;
                data["scaleY"] = scaleY;
                data["scaleX"] = scaleX;
                
                cropper.setData(data);

                if(Math.round(cropper.getData()["x"]) !== x) data["width"] = data["width"] - Math.abs(x-x0);
                if(Math.round(cropper.getData()["y"]) !== y) data["height"] = data["height"] - Math.abs(y-x0);
                cropper.setData(data);
            }

            cropperOptions["crop"] = "crop" in cropperOptions ? Function('return ' + cropperOptions["crop"])() : defaultCrop;
            cropperOptions["build"] = "build" in cropperOptions ? Function('return ' + cropperOptions["build"])() : updateCropper;
            
            cropper = new Cropper(image, cropperOptions);

            $("#"+id+"_x"     ).off("input.cropper").on("input.cropper", updateCropper);
            $("#"+id+"_y"     ).off("input.cropper").on("input.cropper", updateCropper);
            $("#"+id+"_width" ).off("input.cropper").on("input.cropper", updateCropper);
            $("#"+id+"_height").off("input.cropper").on("input.cropper", updateCropper);
            $("#"+id+"_scaleX").off("input.cropper").on("input.cropper", updateCropper);
            $("#"+id+"_scaleY").off("input.cropper").on("input.cropper", updateCropper);
            $("#"+id+"_rotate").off("input.cropper").on("input.cropper", updateCropper);

        }));
    });

    $(document).trigger("load.form_type.cropper");
});