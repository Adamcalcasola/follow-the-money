let osApiKey = "&apikey=57bf365637e080dcba9bad64d8d27cd9";
let ppApiKey = "kqVbQ8sZ5zEvgLGkTATaYq7atntKVhzG7Nnx2e9k"
let osUrl = "http://www.opensecrets.org/api/?output=json";
let ppUrl = "https://api.propublica.org/congress/v1/both/votes/recent.json";


let stateSelect = document.querySelector("#state");
let delegationEl = document.querySelector("#map");

function voteRecord() {
    fetch(ppUrl, {
        method: "GET",
        headers: {"X-API-Key" : ppApiKey}
    })
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
    })
}

function repBios(data) {
    console.log(data);
    delegationEl.innerHTML = "";
    fetch(osUrl + "&method=candIndustry&cid=" + data + "&cycle=2021" + osApiKey)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);
            let objBios = Object.values(data.response.industries);
            let box = document.createElement("div");
            let name = document.createElement("div");
            let cycle = document.createElement("div");
            let updated = document.createElement("div");
            let origin = document.createElement("div");
            let container = document.createElement("div");
            let column1 = document.createElement("div");
            let column2 = document.createElement("div");

            box.className = "board";
            container.className = "columns";
            column1.className = "column";
            column2.className = "column";

            name.textContent = objBios[0].cand_name;
            cycle.textContent = objBios[0].cycle;
            updated.textContent = objBios[0].last_updated;
            origin.textContent = objBios[0].origin;

            delegationEl.appendChild(box);
            box.appendChild(name);
            box.appendChild(cycle);
            box.appendChild(updated);
            box.appendChild(origin);
            box.appendChild(container);
            container.appendChild(column1);
            container.appendChild(column2);            

            for (i=0;i<data.response.industries.industry.length;i++) {
                let objData = Object.values(data.response.industries.industry[i]);
                let industry = document.createElement("p");
                let contributions = document.createElement("p");
                
                industry.textContent = objData[0].industry_name + ": ";
                contributions.textContent = "$" + objData[0].total;

                column1.appendChild(industry);
                column2.appendChild(contributions);
            }
        })
}

function displayReps() {
    delegationEl.innerHTML = "";
    let state = stateSelect.value;
    let stateBox = document.createElement("div");
    stateBox.className = "board";
    delegationEl.appendChild(stateBox);
    //console.log(stateSelect.value);
    fetch(osUrl + "&method=getLegislators&id=" + state + osApiKey)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            for (i=0; i<data.response.legislator.length; i++) {
                //console.log(data);
                let legislator = Object.values(data.response.legislator[i]);
                let repBox = document.createElement("div");
                repBox.className = "name";
                let repName = document.createElement("button");
                let repParty = document.createElement("p");
                //repName.setAttribute("href", "https://bioguide.congress.gov/search/bio/" + legislator[0].bioguide_id);
                //repName.setAttribute("target", "_blank");
                repName.setAttribute("id", legislator[0].firstLast);
                repName.addEventListener("click", function() {
                    repBios(legislator[0].cid);
                })
                repName.textContent = legislator[0].firstlast;
                repParty.textContent = legislator[0].bioguide_id;
                stateBox.appendChild(repBox);
                repBox.appendChild(repName);
                //repBox.appendChild(repParty);
            }
        })
}

//voteRecord();
stateSelect.addEventListener('change', (event) => {displayReps();});

// stateSelect.addEventListener('change', (event) => {
//     console.log(stateSelect.value);
// });


//if (window.addEventListener) { window.addEventListener("message", function (event) { if (event.data.length >= 22) { if (event.data.substr(0, 22) == "__MM-LOCATION.REDIRECT") location = event.data.substr(22); } }, false); } else if (window.attachEvent) { window.attachEvent("message", function (event) { if (event.data.length >= 22) { if (event.data.substr(0, 22) == "__MM-LOCATION.REDIRECT") location = event.data.substr(22); } }, false); }

