var url = "http://www.opensecrets.org/api/?method=candSummary&cid=N00007360&cycle=2022&apikey=57bf365637e080dcba9bad64d8d27cd9";
var xhr = new XMLHttpRequest();
xhr.open("GET", url);

xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
   }};

xhr.send();

// var apikey = "57bf365637e080dcba9bad64d8d27cd9";
// var openSecretsUrl = "http://www.opensecrets.org/api/?method=candSummary&cid=N00007360&cycle=2022&apikey=";

// fetch(openSecretsUrl + apikey)
//     .then(function (response) {
//         console.log(response);
//         return response.json();
//     }).then(function (data) {
//         console.log(data);
//     });

// if (window.addEventListener) {
//     window.addEventListener("message",
//         function (event) {
//             if (event.data.length >= 22) {
//                 if (event.data.substr(0, 22) == "__MM-LOCATION.REDIRECT")
//                     location = event.data.substr(22);
//             }
//         }, false);
// } else if (window.attachEvent) {
//     window.attachEvent("message", function (event) {
//         if (event.data.length >= 22) {
//             if (event.data.substr(0, 22) == "__MM-LOCATION.REDIRECT")
//                 location = event.data.substr(22);
//         }
//     }, false);
// }