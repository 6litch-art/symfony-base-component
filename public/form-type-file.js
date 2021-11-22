if (typeof Dropzone !== 'undefined')
    Dropzone.autoDiscover = false;

$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.file", function () {


        document.querySelectorAll("[data-file-field]").forEach((function (el) {

            var id       = el.getAttribute("data-file-field");
            var dropzone = $(el).data('file-dropzone');

            function updateMetadata(el = $("#"+id), nFiles)
            {
                var id = $(el).attr("id");
                
                var maxFiles = parseInt($("#"+id+"_dropzone").data("file-max-files")) || undefined;
                var remainingFiles = maxFiles - nFiles;

                var counter = "";
                     if(nFiles < 1) counter = $("#"+id+"_dropzone").data("file-counter[none]"    ).replace("{0}", nFiles);
                else if(nFiles < 2) counter = $("#"+id+"_dropzone").data("file-counter[singular]").replace("{0}", nFiles);
                else                counter = $("#"+id+"_dropzone").data("file-counter[plural]"  ).replace("{0}", nFiles);
    
                var counterMax = "";
                if(!isNaN(maxFiles)) { 
    
                         if(remainingFiles < 1) counterMax = $("#"+id+"_dropzone").data("file-counter-max[none]"    ).replace("{0}", remainingFiles);
                    else if(remainingFiles < 2) counterMax = $("#"+id+"_dropzone").data("file-counter-max[singular]").replace("{0}", remainingFiles);
                    else                        counterMax = $("#"+id+"_dropzone").data("file-counter-max[plural]"  ).replace("{0}", remainingFiles);
                }
    
                $("#"+id+"_metadata").html(counter+" "+counterMax);
            }

            if(dropzone) {

                var el             = document.getElementById(id+"_dropzone");
                var sortable       = $(el).data("file-sortable");
                var ajaxPost       = el.getAttribute("data-file-ajaxPost");

                dropzone["init"] = function() {
                    
                    // Initialize existing pictures
                    var val = $('#'+id).val();
                        val = (!val || val.length === 0 ? [] : val.split('|'));

                    $('#'+id).val(val.map(path => {
                        return path.substring(path.lastIndexOf('/') + 1);
                    }).join('|'));

                    var arr = []
                    $.each(val, function(key, path) { 
                        arr.push(fetch(path).then(p => p.blob()).then(function(blob) {
                            return {path:path, blob: blob};
                        })); 
                    });

                    Promise.all(arr).then(function(val){
                        $.each(val, function(key,file) {
                            
                            var path = file.path;
                            var blob = file.blob;

                            var id = parseInt(key)+1;
                            var uuid = path.substring(path.lastIndexOf('/') + 1);
                            var mock = {status: 'existing', name: '#'+id, uuid: uuid, type: blob.type, dataURL:URL.createObjectURL(blob), size: blob.size};

                            editor.files.push(mock);
                            editor.displayExistingFile(mock, path);

                            updateMetadata(this.id, editor.files.length);
                        });
                    });

                    this.on('success', function(file, response) {

                        file.serverId = response;
                        var val = $('#'+id).val();
                            val = (!val || val.length === 0 ? [] : val.split('|'));

                        val.push(file.serverId['uuid']);
                        $('#'+id).val(val.join('|'));

                        updateMetadata(this.id, val.length);
                    });

                    this.on('removedfile', function(file) {
                        
                        // Max files must be updated based on existing files 
                        if (file.status == 'existing') editor.options.maxFiles += 1;
                        else if (file.serverId) $.post(ajaxPost+"/"+file.serverId['uuid']+'/delete');
                        
                        var val = $('#'+id).val();
                            val = (!val || val.length === 0 ? [] : val.split('|'));

                        const index = val.indexOf((file.serverId ? file.serverId['uuid'] : file.uuid));
                        if (index > -1) val.splice(index, 1);
                        
                        $('#'+id).val(val.join('|'));
                        
                        updateMetadata(this.id, val.length);
                    });


                     // Sortable drag-and-drop
                     this.on('dragend', function(file) {

                        var queue = [];
                        
                        $('#'+id+'_dropzone .dz-preview .dz-image img').each(function (count, el) {

                            var name = el.getAttribute('alt');
                            this.files.forEach(function(file) {
                                if(name == file.name)
                                    queue.push(file.uuid);
                            });

                        }.bind(this));

                        $('#'+id).val(queue.join('|'));
                    });

                };

                let editor = new Dropzone("#"+id+"_dropzone", dropzone);

                if(sortable) {
                    var sortable = new Sortable(document.getElementById(id+'_dropzone'), {draggable: '.dz-preview'});
                }

            } else {

                $('#'+id+'_deleteBtn').on('click', function() {
                    $('#'+id+'_raw').val('');
                    $('#'+id+'_deleteBtn').css('display', 'none');
                });
                
                $('#'+id+'_raw').on('change', function() {
                    if( $('#'+id+'_raw').val() !== '') $('#'+id+'_deleteBtn').css('display', 'block');
                    else $('#'+id+'_deleteBtn').css('display', 'none');
                });
            }

        }));
    });

    $(document).trigger("load.form_type.file");
});