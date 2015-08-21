/* The purpose of this is show:
 - how a new document can be uploaded to an Content Server conainter
 - how to add a version to a an existing document



*/
// Sample Data
var sampleData = {
		folder: 0, //Folder
		document: 0, //Document
		user: "otadmin@otds.admin", //username
		password: "livelink", //password
		url: "http://host/otcs/cs.exe/api/v1"
};
var authToken = Cookies.get('anl_authToken');

$(document).ready(function() {
   //Cookies.remove('anl_authToken');
    authToken ? displayDocuments (sampleData.url, sampleData.folder, authToken) : authenticate(sampleData.url, sampleData.user, sampleData.password, sampleData.folder);

});


//Authenticate and set auth token cookie
function authenticate (url, user, pass, folder){
    
    var authurl = url + '/auth';
    $.ajax({
        type: "POST",
        url: authurl,
        data: {
            username: user,
            password: pass
        },
        success: function(data) {
            Cookies.set('anl_authToken', data.ticket, { expires: 0 });
            displayDocuments (url, folder, data.ticket)
        },
        error: function() {
            var error = "Invalid username/password specified";
             $('#output').text(error);
        }
    });
}

//  return documents 
function displayDocuments (url, folder, token){
    url = url + '/nodes/' + folder + '/nodes';
    $.ajax({
        type: "GET",
        url: url,
        headers: {
            "otcsticket": token
        },
        success: function(data) {
            renderDocuments(data.data);
        },
        error: function() {
            var error = 'an error occured returning Folder information';
            $('#output').text(error);
        }
    });
    
}
//render documents
function renderDocuments (result){
    var resultLength = result.length,
        folderData = $('#folderData'),
        message = $('<p><Target folder Data Returned/p>');
    folderData.find('tbody').empty();
    if (resultLength === 0) {
        $('#supportingDocuments').html('<p class="lead">No Supporting Information Uploaded</p>');
    } else {
        var document = "";
        for (i = 0; i < resultLength; i++) {
            document = document + '<tr><td><img src=' + result[i].icon + ' border=0 alt=' + result[i].mime_type + ' /></td>' + '<td>' + result[i].name + '</td>' + '<td>' + result[i].size_formatted + '</td></tr>';
        }
        folderData.find('tbody').append(document);
    }
}


// Add Version to Document 
$("#initDocumentAddVersion").change(function() {
	var fd = new FormData(),
		url = sampleData.url + '/nodes/' + uploadDocument + '/versions';
	fd.append("id", uploadDocument);
	fd.append("file", document.getElementById('initDocumentAddVersion').files[0]);

	$.ajax({
		type: "POST",
		url: url,
		data: fd,
		contentType: false,
		processData: false,
		beforeSend: function(xhr) {
			// Add the ticket from the Autheticate function to the request header.
			xhr.setRequestHeader("otcsticket", authToken),
				xhr.overrideMimeType("multipart/form-data")
		}
	}).done(function(data) {
		displayDocuments (sampleData.url, sampleData.folder, authToken);
        
	}).fail(function(request, statusText) {
        $('#output').text(statusText);
	});

});

$("#supportingDocument").change(function() {

	var filename = $(this).val(),
        url = sampleData.url + '/nodes/',
        formEl = $(this),
        fd = new FormData();// Create FormData Object
            
	filename = filename.split('/').pop().split('\\').pop();
	
	fd.append("type", "144");
	fd.append("parent_id", sampleData.folder);
	fd.append("name", filename);
	fd.append("file", document.getElementById('supportingDocument').files[0]);
	


	$.ajax({
		type: "POST",
		url: url,
		data: fd,
		contentType: false,
		processData: false,
		beforeSend: function(xhr) {
			// Add the ticket from the Autheticate function to the request header.
			xhr.setRequestHeader("otcsticket", authToken),
				xhr.overrideMimeType("multipart/form-data")
		}
	}).done(function(data) {
        $('#output').text(JSON.stringify(data));
        displayDocuments (sampleData.url, sampleData.folder, authToken);
        formEl.replaceWith( formEl = formEl.clone( true ) );
    }).fail(function(request, statusText) {
		$('#output').text(statusText);
	});

});