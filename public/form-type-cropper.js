
$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.cropper", function () {

        document.querySelectorAll("[data-cropper-field]").forEach((function (el) {

            var id             = el.getAttribute("data-cropper-field");

        //     var cropper        = $(el).data("image-cropper") || null;
        //     if (cropper) {

        //         var imageCropper;
        //         var imageBlob;

        //         // Image processing
        //         $('#'+id+'_modal').on('shown.bs.modal', function () { 
        //             imageCropper = new Cropper($('#'+id+'_cropper')[0], cropper); 
        //         }).on('hidden.bs.modal', function () { 
        //             imageCropper.destroy(); 
        //         });

        //         $('#'+id+'_deleteBtn').on('click', function () {
                
        //             var file = $('#'+id+'_file').val();
        //             if(file !== '') $.post(ajaxPost+"/"+file+"/delete");
        //         });

        //         $('.'+id+'_modalClose').on('click', function () {

        //             $('#'+id+'_modal').modal('hide');
        //             $('#'+id+'_file').val(imageBlob);
        //             $('#'+id+'_thumbnail').val(imageBlob);

        //             if ($('#'+id+'_file').val() === '')
        //                 $('#'+id+'_deleteBtn').click();
        //         });

        //         $(document).on('keypress',function(e) {
        //             if(e.which == 13 && $('#'+id+'_raw').val() !== '')
        //                 $('#'+id+'_modalSave').trigger('click');
        //         });

        //         $('#'+id+'_modalSave').on('click', function () {
                    
        //             $('#'+id+'_modal').modal('hide');
        //             if (imageCropper) {

        //                 var canvas = imageCropper.getCroppedCanvas({width: 160, height: 160});
        //                 $('#'+id+'_thumbnail')[0].src = canvas.toDataURL();

        //                 canvas.toBlob(function (blob) {

        //                     var formData = new FormData();

        //                     var file = $('#'+id+'_file').val();
        //                     if(file !== '') $.post(postDeletePath);

        //                     formData.append('file', blob, $('#'+id+'_raw').val());
        //                     imageBlob = blob;

        //                     $.ajax(ajaxPost, {
        //                         method: 'POST',
        //                         data: formData,
        //                         processData: false,
        //                         contentType: false,

        //                         success: function (file) { $('#'+id+'_file').val(file.uuid).trigger('change'); },
        //                         error: function (file) { $('#'+id+'_thumbnail')[0].src = thumbnail; },
        //                         complete: function () { },
        //                     });
        //                 });
        //             }
        //         });

        //         $('#'+id+'_thumbnail').on('click', function() {
        //             if($('#'+id+'_raw').val() === '') $('#'+id+'_raw').click();
        //             else $('#'+id+'_modal').modal('show');
        //         });

        //         $('#'+id+'_deleteBtn').on('click', function() {
        //             $('#'+id+'_thumbnail')[0].src = thumbnail;
        //             $('#'+id+'_raw').val('');
        //             $('#'+id+'_raw').change();
        //         });

        //         $('#'+id+'_raw').on('change', function() {

        //             if( $('#'+id+'_raw').val() !== '') {

        //                 $('#'+id+'_modal').modal('show'); 
        //                 $('#'+id+'_figcaption').css('display', 'none');
        //                 $('#'+id+'_cropper')[0].src = URL.createObjectURL(event.target.files[0]);

        //             } else {

        //                 $('#'+id+'_file').val('');
        //                 $('#'+id+'_figcaption').css('display', 'flex');
        //                 $('#'+id+'_cropper')[0].src = thumbnail;
        //             }
        //         });

        //     } else {

        //         $('#'+id+'_thumbnail').on('click', function() {
        //             $('#'+id+'_raw').click();
        //         });

        //         $('#'+id+'_raw').on('change', function() {

        //             if( $('#'+id+'_raw').val() !== '') {

        //                 $('#'+id+'_figcaption').css('display', 'none');
        //                 $('#'+id+'_thumbnail')[0].src = URL.createObjectURL(event.target.files[0]);

        //             } else {

        //                 $('#'+id+'_file').val('');
        //                 $('#'+id+'_figcaption').css('display', 'flex');
        //                 $('#'+id+'_thumbnail')[0].src = thumbnail;
        //             }
        //         });
        //     }

        //     $('#'+id+'_figcaption').on('click', function() {
        //         $('#'+id+'_raw').click();
        //     });

        //     $('#'+id+'_deleteBtn').on('click', function() {
        //         $('#'+id+'_thumbnail')[0].src = thumbnail;
        //         $('#'+id+'_raw').change();
        //     });

        }));
    });

    $(document).trigger("load.form_type.cropper");
});