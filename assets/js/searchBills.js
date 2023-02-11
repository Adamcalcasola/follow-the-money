// function(uncalled) for future feature to search bills by key word
function searchBills(input) {
    console.log(input);
    fetch(ppUrl2 + input, {
        method: "GET",
        headers: {
            "X-API-Key": ppApiKey
        }
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        for (i=0;i<10;i++) {
            let billId = data.results[0].bills[i].bill_id;
            console.log(billId);
        }
    })
}