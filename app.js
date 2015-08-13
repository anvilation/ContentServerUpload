var supporting = {
	hasAttachment: function(d, auth) {
		var promise = $.Deferred();
		var url = '/otcs/cs.exe/api/v1/nodes/' + d + '/nodes';
		$.ajax({
			type: "GET",
			url: url,
			headers: {
				"otcsticket": token
			},
			success: function(data) {
				///promise.resolve(data.total_count); // removed because of update in attachment validation
				promise.resolve(data.data);
			},
			error: function() {
				var error = 'an error occured returning Attachment Volume information';
				promise.reject(error);
			}
		});
		return promise;
	}

};


$(document).ready(function() {

	var supportFolder = supporting.hasAttachment(uploadFolder, token),
		addVersion = 0,
        supportFiles;

	supportFolder.done(function(result) {
		var resultLength = result.length;
        console.log(result);
		if (!resultLength) {
			$('#supportingDocuments').html('<p class="lead">No Supporting Information Uploaded</p>');

		}


	}).fail(function(error) {
		alert(error);
	});
    
    
    //$("#supportingDocument").on('change', prepareUpload);
    
	$("#supportingDocument").change(function() {
		
        var filename = $(this).val();
        filename = filename.split('/').pop().split('\\').pop();
        console.log(filename);
        var fd = new FormData();
        fd.append("type", "144");
        fd.append("parent_id", uploadFolder);
        fd.append("name", filename);
        fd.append("file", document.getElementById( 'supportingDocument' ).files[ 0 ]);
        var url = '/otcs/cs.exe/api/v1/nodes/';


        $.ajax({
            type: "POST",
            url: url,
            data: fd,
            contentType: false,
            processData: false,
            beforeSend: function( xhr ) {
                // Add the ticket from the Autheticate function to the request header.
                xhr.setRequestHeader( "otcsticket", token ),
                xhr.overrideMimeType( "multipart/form-data" )
            }
        }).done(function( data ) {
            console.log( data );
        }).fail(function( request, statusText ) {
            console.log( statusText );
        });

	});



});

    $("#initDocumentAddVersion").change(function() {
		var fd = new FormData();
        fd.append("id", uploadDocument );
        fd.append("file", document.getElementById( 'initDocumentAddVersion' ).files[ 0 ]);
        var url = '/otcs/cs.exe/api/v1/nodes/' + uploadDocument + '/versions';


        $.ajax({
            type: "POST",
            url: url,
            data: fd,
            contentType: false,
            processData: false,
            beforeSend: function( xhr ) {
                // Add the ticket from the Autheticate function to the request header.
                xhr.setRequestHeader( "otcsticket", token ),
                xhr.overrideMimeType( "multipart/form-data" )
            }
        }).done(function( data ) {
            console.log( data );
        }).fail(function( request, statusText ) {
            console.log( statusText );
        });

	});
function prepareUpload(event)
{
  supportFiles = event.target.files;
    console.log(files);
}