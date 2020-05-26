var UserId;
var myID;
var listname = "TestingItems";
$(document).ready(function () {
    myID = getUrlVars()["ItemID"];
    initializePeoplePicker("_UserName");
    //GetCurrentUser();
    setuserdetails(myID);
    $("#bsubmit").click(function () {
        saveuserinfo();
    });
    $("#btndelete").click(function () {
      deleteuserinfo();
  });
});
function setuserdetails(myID){
  var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('TestingItems')/items?$select=Title,FirstName,Gender,Salary,JoingDate,Conformation,Location/Title,User/Title&$expand=Location,User&$filter=ID eq '" + myID + "'";
        $.ajax({
            url: requestUri,
            type: "GET",
            headers: {
                "accept": "application/json; odata=verbose"
            },
            success: onSuccess,
            error: onError
        });

        function onSuccess(data) {
            var objItems = data.d.results;
            for (var i = 0; i < objItems.length; i++) {
                $('#ttitle').val(objItems[i].Title);
                $('#fname').val(objItems[i].FirstName);
                $('#tgender').val(objItems[i].Gender);
                $('#tsalary').val(objItems[i].Salary);
                var date = new Date(objItems[i].JoingDate);
                var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
                var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
                var formatDate = date.getFullYear()+"-"+MM+"-"+dd;
                $('#tjoingDate').val(formatDate);
                $('#_UserName_TopSpan_EditorInput').val(objItems[i]["User"].Title);
                
                var theText=objItems[i]["Location"].Title;
                $("#tlocation option:contains(" + theText + ")").attr('selected', 'selected');
                var rad3=objItems[i].Conformation;
                if(rad3===false){
                    $("#rad2").prop("checked", true);
                }
                else{
                    $("#rad1").prop("checked", true);
                }
            }
        }
        function onError(error) {
            alert('Error');
        }
}
function deleteuserinfo(){   
    $.ajax({  
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listname + "')/items(" + myID + ")",  
        type: "POST",  
        contentType: "application/json;odata=verbose",  
        headers: {  
            "Accept": "application/json;odata=verbose",  
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
            "IF-MATCH": "*",  
            "X-HTTP-Method": "DELETE",  
        },  
        success: function(data) {  
            alert("item deleted successfully.");  
        },  
        error: function(data) {  
            alert("failed");  
        }  
    });  
}

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

    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + listname + "')/getItemById('" + myID + "')";
    
    $.ajax({
    url: requestUri,
    type: "POST",
    data:JSON.stringify({'__metadata': { 'type': "SP.Data.TestingItemsListItem" }, 
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
    "accept":"application/json;odata=verbose",
    "content-type": "application/json;odata=verbose",
    "X-RequestDigest":$("#__REQUESTDIGEST").val(),
    "X-HTTP-Method": "MERGE",
    "IF-MATCH":"*"
    },
    success: onSuccess,
    error: onError
    });

    function onSuccess(data) {
    alert('List Item Updated');
    }

    function onError(error) {
    alert(JSON.stringify(error));
    }
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

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
