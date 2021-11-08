let osApiKey = "&apikey=57bf365637e080dcba9bad64d8d27cd9";
let ppApiKey = "kqVbQ8sZ5zEvgLGkTATaYq7atntKVhzG7Nnx2e9k"
let osUrl = "http://www.opensecrets.org/api/?output=json";
let ppUrl = "https://api.propublica.org/congress/v1/members/";
let aaa = "/office_expenses/2020/4.json";
let bbb = "https://api.propublica.org/congress/v1/members/B001277/votes.json"
//https://api.propublica.org/congress/v1/members/{member-id}/bills/{type}.json
//https://api.propublica.org/congress/v1/members/{member-id}/votes.json

let stateSelect = document.querySelector("#state");
let delegationEl = document.querySelector("#map");
let voteRecordEl = document.getElementById("state-box");
let selectBar = document.getElementById("select-bar");



function voteRecord(cid) {
    // console.log(cid);
    
    
    
    
    
    fetch(bbb, {
        method: "GET",
        headers: {"X-API-Key" : ppApiKey}
    })
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        for (i=0;i<data.results[0].votes.length;i++) {
        //console.log(data.results[0].votes[i].description);
        //console.log(data.results[0].votes[i].position);
        let container = document.createElement("div");
        let column1 = document.createElement("div");
        let column2 = document.createElement("div");
        let billDesc = document.createElement("div");
        let position = document.createElement("div");
        billDesc.textContent = data.results[0].votes[i].description;
        position.textContent = data.results[0].votes[i].position;
        voteRecordEl.appendChild(container);
        container.appendChild(column1);
        container.appendChild(column2);
        column1.appendChild(billDesc);
        column2.appendChild(position);
        }
    })
}

function repBios(data) {
    //console.log(data);
    voteRecord(data);
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
            let industryTitle = document.createElement("h2");
            let contributionsTitle = document.createElement("h2");

            box.className = "board";
            container.className = "columns";
            column1.className = "column";
            column2.className = "column";

            name.textContent = objBios[0].cand_name;
            cycle.textContent = "Cycle Year: " + objBios[0].cycle;
            updated.textContent = "Last Updated: " + objBios[0].last_updated;
            origin.textContent = "Origin: " + objBios[0].origin;
            industryTitle.textContent = "Industry:";
            contributionsTitle.textContent = "Total Contributions:";

            delegationEl.appendChild(box);
            box.appendChild(name);
            box.appendChild(cycle);
            box.appendChild(updated);
            box.appendChild(origin);
            box.appendChild(container);
            container.appendChild(column1);
            container.appendChild(column2);
            column1.appendChild(industryTitle);
            column2.appendChild(contributionsTitle);            

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
    //delegationEl.innerHTML = "";
    selectBar.removeChild(selectBar.lastChild);

    let state = stateSelect.value;
    let stateBox = document.createElement("div");
    let selectBox = document.createElement("div");
    let repSelect = document.createElement("select");
    let nilOption = document.createElement("option");

    stateBox.classList = "column is-offset-6";
    selectBox.classList = "select is-danger is-rounded is-normal is-focused";
    repSelect.setAttribute("id", "rep-select");
    nilOption.textContent = "Select Representitive";

    selectBar.appendChild(selectBox);
    selectBox.appendChild(repSelect);
    repSelect.appendChild(nilOption);

    fetch(osUrl + "&method=getLegislators&id=" + state + osApiKey)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            for (i=0; i<data.response.legislator.length; i++) {
                let legislator = Object.values(data.response.legislator[i]);
                let repOption = document.createElement("option");
                repOption.setAttribute("value", legislator[0].cid);
                repOption.textContent = legislator[0].firstlast;
                repSelect.appendChild(repOption);
            }
            selectBox.addEventListener("change", (event) => {
                repBios(event.target.value);
            });
        })  
};

//voteRecord();
getHouseMemberId();
stateSelect.addEventListener('change', (event) => {displayReps();});
