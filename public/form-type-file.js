document.querySelectorAll("[data-file-field]").forEach((function (el) {

    var id       = el.getAttribute("data-file-field");
    var dropzone = $(el).data('file-dropzone');

    if(dropzone) {

        Dropzone.autoDiscover = false;

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
                });
            });

            this.on('dragend', function(file) {

                var queue = [];
                
                var files = this.files;
                $('#editor .dz-preview .dz-image img').each(function (count, el) {

                    var name = el.getAttribute('alt');
                    $.each(this.files, function(key,file) {
                        if(name == file.name) queue.push(file.uuid);
                    });

                }.bind(this));

                $('#'+id).val(queue.join('|'));
            });

            this.on('success', function(file, response) {

                file.serverId = response;
                var val = $('#'+id).val();
                    val = (!val || val.length === 0 ? [] : val.split('|'));

                val.push(file.serverId['uuid']);
                $('#'+id).val(val.join('|'));
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
