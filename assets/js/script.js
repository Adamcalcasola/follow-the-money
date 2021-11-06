let osApiKey = "&apikey=57bf365637e080dcba9bad64d8d27cd9";
let ppApiKey = "kqVbQ8sZ5zEvgLGkTATaYq7atntKVhzG7Nnx2e9k"
let osUrl = "http://www.opensecrets.org/api/?method=getLegislators&output=json&id=";
let ppUrl = "https://api.propublica.org/congress/v1/both/votes/recent.json" ;



let stateSelect = document.querySelector("#state");
let delegationEl = document.querySelector("#map");




function displayReps() {
    delegationEl.innerHTML = "";
    let state = stateSelect.value;
    let stateBox = document.createElement("div");
    stateBox.className = "board";
    delegationEl.appendChild(stateBox);
    console.log(stateSelect.value);
    fetch(osUrl + state + osApiKey)
        .then(function(response) {
            console.log(response);
            return response.json();
        }).then(function(data) {
            for (i=0; i<data.response.legislator.length; i++) {
                let legislator = Object.values(data.response.legislator[i]);
                let repBox = document.createElement("div");
                repBox.className = "name";
                let repName = document.createElement("a");
                repName.setAttribute("href", legislator[0].website);
                repName.setAttribute("target", "_blank");
                repName.textContent = legislator[0].firstlast;
                stateBox.appendChild(repBox);
                repBox.appendChild(repName);
            }
        })
}

function proPublicaFetch(){
    // let state = stateSelect.value;
    fetch(ppUrl, {
        method: "GET",
        headers: {"X-API-Key" : ppApiKey, 
                "Content-Type": "application/json"},
                }
    ).then(function(response){
            console.log(response);
            return response.json();
        })
        //   .then(function(data){
        //     for (i = 0; i < data.response.length; i++){      
            // }
        // })
      
}





proPublicaFetch();

stateSelect.addEventListener('change', (event) => {displayReps();});

// stateSelect.addEventListener('change', (event) => {
//     console.log(stateSelect.value);
// });


//if (window.addEventListener) { window.addEventListener("message", function (event) { if (event.data.length >= 22) { if (event.data.substr(0, 22) == "__MM-LOCATION.REDIRECT") location = event.data.substr(22); } }, false); } else if (window.attachEvent) { window.attachEvent("message", function (event) { if (event.data.length >= 22) { if (event.data.substr(0, 22) == "__MM-LOCATION.REDIRECT") location = event.data.substr(22); } }, false); }

