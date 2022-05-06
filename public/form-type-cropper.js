
$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.cropper", function () {
        
        
        document.querySelectorAll("[data-cropper-field]").forEach((function (el) {

            var cropper;
            var cropperOptions = JSON.parse(el.getAttribute("data-cropper") || "");

            var id      = el.getAttribute("data-cropper-field");
            var image = document.querySelector("#"+id+"_image");
            var naturalWidth, naturalHeight;
            
            var initCropper = function() {
               
                $("#"+id+"_loader").remove()
                $("#"+id+"_image").removeClass("hidden");
                $("#"+id+"_aspectRatios").removeClass("hidden");
            };

            var updateCropper = function() {

                // Expand on negative value
                data = cropper.getData();

                var x  = Math.round($("#"+id+"_x").val());
                var x0 = Math.round(data["x"]);

                var width = Math.round($("#"+id+"_width").val());
                if(x < 0) width = width + Math.abs(x-x0);

                var y  = Math.round($("#"+id+"_y").val());
                var y0 = Math.round(data["y"]);

                var height = Math.round($("#"+id+"_height").val());
                if(y < 0) height = height + Math.abs(y-y0);

                data = extractData();
                data["width"]  = width;
                data["height"] = height;
                cropper.setData(data);

                // Squeeze action 
                if(Math.round(cropper.getData()["x"]) !== x && x > 0)
                    data["width"]  = x > naturalWidth  ? 0 : data["width"]  - Math.abs(x-x0);
                if(Math.round(cropper.getData()["y"]) !== y && y > 0) 
                    data["height"] = y > naturalHeight ? 0 : data["height"] - Math.abs(y-y0);

                data["width"]  = Math.min(data["width"], naturalWidth);
                data["height"] = Math.min(data["height"], naturalHeight);
                cropper.setData(data);
            }

            // Make sure the form is within boundaries
            var defaultCrop = function(event) {

                $("#"+id+"_x").val(Math.round(event.detail.x));
                $("#"+id+"_y").val(Math.round(event.detail.y));
                $("#"+id+"_width").val(Math.round(event.detail.width));
                $("#"+id+"_height").val(Math.round(event.detail.height));
                $("#"+id+"_rotate").val(Math.round(event.detail.rotate));
                $("#"+id+"_scaleX").val(Math.round(event.detail.scaleX));
                $("#"+id+"_scaleY").val(Math.round(event.detail.scaleY));
            };

            cropperOptions["crop"] = "crop" in cropperOptions ? Function('return ' + cropperOptions["crop"])() : defaultCrop;
            cropperOptions["build"] = "build" in cropperOptions ? Function('return ' + cropperOptions["build"])() : updateCropper;
            cropperOptions["ready"] = "ready" in cropperOptions ? Function('return ' + cropperOptions["ready"])() : initCropper;

            function extractData()
            {
                var x   = Math.round($("#"+id+"_x").val());
                var y    = Math.round($("#"+id+"_y").val());
                var width  = Math.round($("#"+id+"_width").val());
                var height = Math.round($("#"+id+"_height").val());
                var rotate = Math.round($("#"+id+"_rotate").val());
                var scaleY = Math.round($("#"+id+"_scaleY").val());
                var scaleX = Math.round($("#"+id+"_scaleX").val());

                var data = {};
                    data["x"]      = Math.max(0, Math.min(x     , naturalWidth));
                    data["y"]      = Math.max(0, Math.min(y     , naturalHeight));
                    data["width"]  = Math.max(0, Math.min(width , naturalWidth));
                    data["height"] = Math.max(0, Math.min(height, naturalHeight));
                    data["rotate"] = rotate % 360 || 0;
                    data["scaleY"] = scaleY || 1;
                    data["scaleX"] = scaleX || 1;

                return data;
            }

            var reader = new FileReader();
                reader.onloadend = e => {

                    image.src = e.target.result;
                    image.onload = function () {

                        naturalWidth  = parseInt(image.width);
                        naturalHeight = parseInt(image.height);
                        cropperOptions["data"] = extractData();

                        cropper = new Cropper(image, cropperOptions);

                        $("#"+id+"_x"     ).off("input.cropper").on("input.cropper", updateCropper);
                        $("#"+id+"_y"     ).off("input.cropper").on("input.cropper", updateCropper);
                        $("#"+id+"_width" ).off("input.cropper").on("input.cropper", updateCropper);
                        $("#"+id+"_height").off("input.cropper").on("input.cropper", updateCropper);
                        $("#"+id+"_scaleX").off("input.cropper").on("input.cropper", updateCropper);
                        $("#"+id+"_scaleY").off("input.cropper").on("input.cropper", updateCropper);
                        $("#"+id+"_rotate").off("input.cropper").on("input.cropper", updateCropper);

                        $("#"+id+"_aspectRatios button") 
                            .off("click.cropper")
                            .on("click.cropper", function() { // Do not inline (this)
                                cropper.setAspectRatio(parseFloat($(this).data("aspect-ratio")));
                            });
                    };
                }

                if(image.src.startsWith("data:")) return ;

                var xhr = new XMLHttpRequest();
                    xhr.open('GET', image.src, true);
                    xhr.responseType = 'blob';
                    xhr.onload = function(e) { reader.readAsDataURL(this.response); }
                    xhr.send();

                //
                // Fix refresh of cropper container on resize...
                let doIt
                window.addEventListener('resize', () => {
                    clearTimeout(doIt);
                    cropper.disable()
                    doIt = setTimeout(() => {
                        cropper.enable()
                    }, 100);
                })
        }));
    });

    $(document).trigger("load.form_type.cropper");
});