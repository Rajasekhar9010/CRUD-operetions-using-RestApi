var UserId;
var listname = "TestingItems";
$(document).ready(function () {
    initializePeoplePicker("_UserName");
    $("#bsubmit").click(function () {
        saveuserinfo();
    });
});

function initializePeoplePicker(peoplePickerElementId) {
    var schema = {};
    schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
    schema['SearchPrincipalSource'] = 15;
    schema['ResolvePrincipalSource'] = 15;
    schema['AllowMultipleValues'] = false;
    schema['MaximumEntitySuggestions'] = 50;
    schema['Width'] = '280px';

    this.SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, null, schema);
}

function saveuserinfo() {
    var title = $('#ttitle').val();
    var lnFstName = $('#fname').val();
    var vgender = $('#tgender option:selected').text();
    var vsalary = $('#tsalary').val();
    var rconfir = $("input[name='vol1']:checked").val();
    var date = new Date($("#tjoingDate").val());
    var formatDate = date.toLocaleString('en-US', { year: "numeric", month: "numeric", day: "numeric" });
    var locationval= parseInt($('#tlocation').val());

    ensureUser();
     $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('"+listname+"')/items",
        type: "POST",
        async: false,
        data: JSON.stringify({
            __metadata: {
                type: "SP.Data.TestingItemsListItem"
            },
            'Title': title,
            'FirstName': lnFstName,
            'Gender': vgender,
            'Salary': vsalary,
            'JoingDate':formatDate,
            'Conformation':rconfir,
            'LocationId':locationval,
            UserId: UserId
        }),
        headers: {  
			"Accept": "application/json;odata=verbose",  
			"Content-Type": "application/json;odata=verbose",  
			"X-RequestDigest": $("#__REQUESTDIGEST").val(),  
			"X-HTTP-Method": "POST",
		},
        success: function(data){
            alert("User details saved successfully");
        },
        error: function(error){
            alert(JSON.stringify(error));
       }
    });
}

function ensureUser() {
	var peoplePickerTopDivId = $('#_UserName').children().children().attr('id');
    var peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict[peoplePickerTopDivId];
	var users = peoplePicker.GetAllUserInfo();
	var arryuser = users[0];
	if(arryuser) {
    var payload = { 'logonName': arryuser.Key}; 
	$.ajax({
		url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/ensureuser",
		type: "POST",
		async:false,
		contentType: "application/json;odata=verbose",
		data: JSON.stringify(payload),
		headers: {
			"X-RequestDigest": $("#__REQUESTDIGEST").val(),
			"accept": "application/json;odata=verbose"
		},
		success: function(data, status, xhr) {  	
		   UserId = data.d.Id;			
		},
		error: function(xhr, status, error) {  	 
		}
	}); 
	}	
	else {
		UserId = 0;
	}
}
