/* The purpose of this is show:
 - how a new document can be uploaded to an Attachment volume / folder
 - how to add a version to a an existing document



*/
// Sample Documents
var sampleData = {
		folder: 0, //Folder
		document: 0, //Document
		user: "otadmin@otds.admin", //username
		password: "livelink", //password
		url: "http://otcs105.exchange.loc/otcs/cs.exe/api/v1", //url to rest api
		token: null,


	},
    authenticate = function(url, user, password) { // authentication method
        var promise = $.Deferred();
        url = url + '/auth';
        $.ajax({
            type: "POST",
            url: url,
            data: {
                username: user,
                password: password
            },
            success: function(data) {
                promise.resolve(data.ticket);
            },
            error: function() {
                var error = "Invalid username/password specified";
                promise.reject(error);
            }
        });
        return promise;
    },
    displayDocuments = function(folder, token) {
        var promise = $.Deferred(),
            url = sampleData.url + '/nodes/' + folder + '/nodes';
        $.ajax({
            type: "GET",
            url: url,
            headers: {
                "otcsticket": token
            },
            success: function(data) {
                promise.resolve(data.data);



            },
            error: function() {
                var error = 'an error occured returning Folder information';
                promise.reject(error);
            }
        });
        return promise;

    };

$(document).ready(function() {
	authenticate(sampleData.url, sampleData.user, sampleData.password).done(function(result) {
		var message = $('<p></p>'),
			output = $('#output');
		message.append('Auth Token: ' + result);
		output.html(message);
		sampleData.token = result;
		$('.document').show();

		displayDocuments(sampleData.folder, sampleData.token).done(function(result) {
			var resultLength = result.length,
				output = $('#output'),
				message = $('<p></p>'),
				documents = $('<ul></ul>');
			console.log(result);
			message.append(JSON.stringify(result));
			output.append(message);
			if (!resultLength) {
				$('#supportingDocuments').html('<p class="lead">No Supporting Information Uploaded</p>');
			} else {
				var document = "";
				for (var x = 0; x > resultLength; x++) {
					document = document + '<li>' + result.name + '<li/>';
				}
				documents.append(document);
				$('#supportingDocuments').append(documents);
			}
		});
	}).fail(function(error) {
		$('#output').text(error);
	});


});

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
			xhr.setRequestHeader("otcsticket", sampleData.token),
				xhr.overrideMimeType("multipart/form-data")
		}
	}).done(function(data) {
		console.log(data);
	}).fail(function(request, statusText) {
		console.log(statusText);
	});

});

$("#supportingDocument").change(function() {

	var filename = $(this).val(),
        url = sampleData.url + '/nodes/',
        fd = new FormData();// Create FormData Object
            
	filename = filename.split('/').pop().split('\\').pop();
	console.log(filename);
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
			xhr.setRequestHeader("otcsticket", sampleData.token),
				xhr.overrideMimeType("multipart/form-data")
		}
	}).done(function(data) {
		console.log(data);
	}).fail(function(request, statusText) {
		console.log(statusText);
	});

});