let osApiKey = "&apikey=57bf365637e080dcba9bad64d8d27cd9";
let ppApiKey = "&apikey=X-API-Key:kqVbQ8sZ5zEvgLGkTATaYq7atntKVhzG7Nnx2e9k"
let osUrl = "http://www.opensecrets.org/api/?method=getLegislators&output=json&id=";
let ppUrl = "https://api.propublica.org/congress/v1/both/votes/recent.json";


let stateSelect = document.querySelector("#state");
let delegationEl = document.querySelector("#map");

function voteRecord() {
    fetch(ppUrl + "?method=" + ppApiKey)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
    })
}

function repBios() {

}

function displayReps() {
    delegationEl.innerHTML = "";
    let state = stateSelect.value;
    let stateBox = document.createElement("div");
    stateBox.className = "board";
    delegationEl.appendChild(stateBox);
    //console.log(stateSelect.value);
    fetch(osUrl + state + osApiKey)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            for (i=0; i<data.response.legislator.length; i++) {
                console.log(data);
                let legislator = Object.values(data.response.legislator[i]);
                let repBox = document.createElement("div");
                repBox.className = "name";
                let repName = document.createElement("a");
                let repParty = document.createElement("p");
                repName.setAttribute("href", "https://bioguide.congress.gov/search/bio/" + legislator[0].bioguide_id);
                repName.setAttribute("target", "_blank");
                repName.textContent = legislator[0].firstlast;
                repParty.textContent = legislator[0].bioguide_id;
                stateBox.appendChild(repBox);
                repBox.appendChild(repName);
                repBox.appendChild(repParty);
            }
        })
}

voteRecord();
stateSelect.addEventListener('change', (event) => {displayReps();});

// stateSelect.addEventListener('change', (event) => {
//     console.log(stateSelect.value);
// });


//if (window.addEventListener) { window.addEventListener("message", function (event) { if (event.data.length >= 22) { if (event.data.substr(0, 22) == "__MM-LOCATION.REDIRECT") location = event.data.substr(22); } }, false); } else if (window.attachEvent) { window.attachEvent("message", function (event) { if (event.data.length >= 22) { if (event.data.substr(0, 22) == "__MM-LOCATION.REDIRECT") location = event.data.substr(22); } }, false); }

