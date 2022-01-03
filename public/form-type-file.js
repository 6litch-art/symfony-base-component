if (typeof Dropzone !== 'undefined')
    Dropzone.autoDiscover = false;

$(document).on("DOMContentLoaded", function () {

    $(document).on("load.form_type.file", function () {

        document.querySelectorAll("[data-file-field]").forEach((function (el) {

            var id       = el.getAttribute("data-file-field");
            var dropzone = $(el).data('file-dropzone');

            var entityIdList = $("#"+id+"_dropzone").data("entity-id") ?? [];
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

                var el       = document.getElementById(id+"_dropzone");
                var sortable = $(el).data("file-sortable");
                var ajax     = el.getAttribute("data-file-ajax");
                
                dropzone["init"] = function() {

                    // Initialize existing pictures
                    var val = $('#'+id).val();
                        val = (!val || val.length === 0 ? [] : val.split('|'));

                    var arr = [];
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

                            var entityId = entityIdList[uuid] ?? null;
                            var mock = {status: 'existing', name: '#'+id, entityId: entityId, uuid: uuid, type: blob.type, size: blob.size};

                            editor.files.push(mock);
                            
                            if(path === "") path = "./bundles/base/images.svg";
                            editor.displayExistingFile(mock, path);

                            updateMetadata(this.id, editor.files.length);
                        });
                    });

                    this.on('error', function(file, response) {
                        
                        var errorMessage = $(file.previewElement).find(".dz-error-message");
                        if (errorMessage.length == 0) return;

                        errorMessage.css("opacity", 1);
                        setTimeout(function() {
                            errorMessage[0].style.removeProperty('opacity');
                        }, 2000);
                    });

                    this.on('success', function(file, response) {

                        file.serverId = response;

                        var previewList = $('#'+id+'_dropzone .dz-preview');
                        var preview = $(previewList)[previewList.length-1];
                        if(file.status !== "existing") 
                            $(preview).data("uuid", file.uuid = file.serverId['uuid']);

                        var val = $('#'+id).val();
                            val = (!val || val.length === 0 ? [] : val.split('|'));

                        val.push(file.serverId['uuid']);
                        $('#'+id).val(val.join('|'));

                        updateMetadata(this.id, val.length);
                    });

                    function findDuplicates(files, file, dataURL = undefined)
                    {
                        var _i, _len;
                        for (_i = 0, _len = files.length; _i < _len - 1; _i++) {

                            if(files[_i] === file) continue; // Exception for the file itself..
                            if(files[_i].status == "existing") {

                                var img = getImage(files[_i].uuid);
                                if(img !== undefined) { 
                                
                                    if(files[_i].size === file.size && img.src.toString() === dataURL)
                                        return file;
                                }

                            } else {

                                if(files[_i].size === file.size && files[_i].lastModified.toString() === file.lastModified.toString())
                                    return file;
                            }
                        }

                        return undefined;
                    }

                    function findByUUID(files, fileUUID)
                    {
                        var _i, _len;
                        for (_i = 0, _len = files.length; _i < _len; _i++) {

                            var uuid = files[_i].serverId ? files[_i].serverId['uuid'] : files[_i].uuid;
                            if(fileUUID == uuid) return files[_i];
                        }

                        return undefined;
                    }

                    this.on("thumbnail", function(file, dataURL) {

                        var duplicateFile = findDuplicates(this.files, file, dataURL);
                        if (duplicateFile) this.removeFile(duplicateFile);
                    });

                    this.on('removedfile', function(file) {

                        // Max files must be updated based on existing files 
                        if (file.status == 'existing' && editor.options.maxFiles != null) editor.options.maxFiles += 1;
                        else if (file.serverId) $.post(ajax+"/"+file.serverId['uuid']+'/delete');

                        var val = $('#'+id).val();
                            val = (!val || val.length === 0 ? [] : val.split('|'));
                            val = val.map(path => {
                                return path.substring(path.lastIndexOf('/') + 1);
                            });
            
                        const index = val.indexOf((file.serverId ? file.serverId['uuid'] : file.uuid));
                        if (index > -1) val.splice(index, 1);
                        
                        $('#'+id).val(val.join('|'));
                        
                        updateMetadata(this.id, val.length);
                    });

                    this.on("addedfile", function(file) {

                        var previewList = $('#'+id+'_dropzone .dz-preview');
                        var preview = $(previewList)[previewList.length-1];
                        
                        // Add UUID to preview for existing files (these are not triggering "success" event)
                        if(file.status == "existing") {

                            $(preview).data("uuid", file.uuid);

                            if(file.entityId !== null) {
                                var span = $(preview).find(".dz-filename > span")[0];
                                    span.innerHTML = "<a href="+$("#"+id+"_dropzone").data("file-href"  )
                                                                                    .replace("{0}", file.entityId)+">"+ span.innerHTML + "</a>";
                            }
                        }
                    });

                    function getImage(fileUUID)
                    {
                        var image = undefined;
                        $('#'+id+'_dropzone .dz-preview').each(function (count, el) {

                            var uuid = $(el).data('uuid');
                            if(fileUUID == uuid) image = $(el).find(".dz-image img")[0] || undefined;
                        });

                        return image;
                    }
                    
                    // Sortable drag-and-drop
                    Array.prototype.insert = function(i,...rest) { this.splice(i,0,...rest); return this; }

                    this.on('dragend', function() {

                        var queue = [];
                        var that = this;
                        $('#'+id+'_dropzone .dz-preview').each(function(file) {

                            var file = findByUUID(that.files, $(this).data("uuid"));
                            if (file) queue.push(file.status === "existing" ? file.dataURL : file.uuid);
                        });

                        $('#'+id).val(queue.join('|'));
                    });
                };

                let editor = new Dropzone("#"+id+"_dropzone", dropzone);

                if(sortable)
                    var sortable = new Sortable(document.getElementById(id+'_dropzone'), {draggable: '.dz-preview'});

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