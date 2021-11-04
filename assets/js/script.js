var apiKey = "&apikey=57bf365637e080dcba9bad64d8d27cd9";
var openSecretsUrl = "http://www.opensecrets.org/api/?method=getLegislators&output=json&id=";

var stateSelect = document.querySelector("#state");

fetch(openSecretsUrl + "CT" + apiKey)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
    })



stateSelect.addEventListener('change', (event) => {
    console.log(stateSelect.value);
});


//if (window.addEventListener) { window.addEventListener("message", function (event) { if (event.data.length >= 22) { if (event.data.substr(0, 22) == "__MM-LOCATION.REDIRECT") location = event.data.substr(22); } }, false); } else if (window.attachEvent) { window.attachEvent("message", function (event) { if (event.data.length >= 22) { if (event.data.substr(0, 22) == "__MM-LOCATION.REDIRECT") location = event.data.substr(22); } }, false); }

