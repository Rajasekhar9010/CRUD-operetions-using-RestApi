$(document).ready(function () {
    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('TestingItems')/items?$select=ID,Title,FirstName,Gender,Salary,JoingDate,Conformation,Location/Title,User/Title&$expand=Location,User";
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

        var tableContent = '<table id="tableREST" class="minimalistBlack"><thead><tr><th>Title</th><th>First Name</th><th>Gender</th><th>Salary</th><th>Joing Date</th><th>Confirmation</th><th>Location</th><th>User Name</th></tr></thead><tbody>';
        

        for (var i = 0; i < objItems.length; i++) {
            var id = objItems[i].ID;
            var title = objItems[i].Title;
            var fname = objItems[i].FirstName;
            var gender = objItems[i].Gender;
            var salary = objItems[i].Salary;
            var date = new Date(objItems[i].JoingDate);
            var formatDate = date.toLocaleString('en-US', { year: "numeric", month: "numeric", day: "numeric" });
            var confirmation = objItems[i].Conformation;
            if(confirmation=="true"){
                confirmation="Yes";
            }
            else{
                confirmation="No";
            }

            var location = objItems[i]["Location"].Title;
            var username = objItems[i]["User"].Title;
            

            tableContent += '<tr>';
            tableContent += '<td><a href="https://sharepointtebs.sharepoint.com/sites/TestIng/SitePages/EditForm.aspx?ItemID=' + id + '">'+title+'</a></td>';
            tableContent += '<td>' + fname + '</td>';
            tableContent += '<td>' + gender + '</td>';
            tableContent += '<td>' + salary + '</td>';
            tableContent += '<td>' + formatDate + '</td>';
            tableContent += '<td>' + confirmation + '</td>';
            tableContent += '<td>' + location + '</td>';
            tableContent += '<td>' + username + '</td>';
            tableContent += '</tr>';            
        }
        tableContent += '</tbody></table>';
        $('#RESTGrid').append(tableContent);
    }
    function onError(error) {
        alert('Error');
    }
});
