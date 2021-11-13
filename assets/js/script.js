let osApiKey = "&apikey=57bf365637e080dcba9bad64d8d27cd9";
let ppApiKey = "kqVbQ8sZ5zEvgLGkTATaYq7atntKVhzG7Nnx2e9k"
let osUrl = "http://www.opensecrets.org/api/?output=json";
let ppUrl = "https://api.propublica.org/congress/v1/members/";
let ppUrl2 = "https://api.propublica.org/congress/v1/bills/search.json?query=";
let stateSelect = document.getElementById("state");
let delegationEl = document.getElementById("map");
let voteRecordEl = document.getElementById("vote-box");
let selectBar = document.getElementById("select-bar");
let voteDisplay = document.getElementById("vote-display");
let voteBox = document.createElement("div");
voteBox.classList = "column is-fluid is-danger board";
voteBox.setAttribute("id", "vote-box");



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

function voteRecord(id) {
    delegationEl.innerHTML = "";
    fetch(ppUrl + id + "/votes.json", {
        method: "GET",
        headers: {
            "X-API-Key": ppApiKey
        }
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        //voteDisplay.append(voteBox);

        for (i = 0; i < data.results[0].votes.length; i++) {
            let box2 = document.createElement("div");
            let container = document.createElement("div");
            let column1 = document.createElement("div");
            let column2 = document.createElement("div");
            let column3 = document.createElement("div");
            let billDesc = document.createElement("div");
            let position = document.createElement("div");
            let totalVoteYes = document.createElement("div");
            let totalVoteNo = document.createElement("div");
            let totalVoteNV = document.createElement("div");
            let billDescTitle = document.createElement("h2");
            let positionTitle = document.createElement("h2");
            let totalVote = document.createElement("h2");
            
            box2.className = "board";
            container.className = "columns";
            column1.classList = "column";
            column2.classList = "column";
            column3.classList = "column";
            billDescTitle.className = "billDescTitle";
            positionTitle.className = "positionTitle"
            totalVote.className = "totalvote";
            billDesc.className = "billDesc";
            position.className = "position";
            totalVoteYes.className = "totalVoteYes";
            totalVoteNo.className =  "totalVoteNo";
            totalVoteNV.className = "totalVoteNV";
            
            billDescTitle.textContent = "Description"
            positionTitle.textContent = "Position";
            totalVote.textContent = "Total Vote Count";
            billDesc.textContent = data.results[0].votes[i].description;
            
            position.textContent = data.results[0].votes[i].position;
            
            totalVoteYes.textContent = "Yes : " + data.results[0].votes[i].total.yes;
            totalVoteNo.textContent = "No: " + data.results[0].votes[i].total.no;
            totalVoteNV.textContent = "Not Voting: " + data.results[0].votes[i].total.not_voting;
            
            // voteBox.appendChild(box2);
            
            delegationEl.appendChild(box2);
            box2.appendChild(container);
            container.appendChild(column1);
            container.appendChild(column2);
            container.appendChild(column3);
            column1.appendChild(billDescTitle);
            column1.appendChild(billDesc);
            column2.appendChild(positionTitle);
            column2.appendChild(position);
            column3.appendChild(totalVote);
            column3.appendChild(totalVoteYes);
            column3.appendChild(totalVoteNo);
            column3.appendChild(totalVoteNV);
        }
    })
}

function repBio(id) {
    fetch(ppUrl + id + ".json", {
        method: "GET",
        headers: {"X-API-Key": ppApiKey}
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
    console.log(data);
    delegationEl.innerHTML = "";
    let bioBox = document.createElement("div");
    bioBox.classList = "board";
    
    let billSearch = document.createElement("input");
    billSearch.setAttribute("type", "search");
    billSearch.setAttribute("id", "bill-search");

    let searchBtn = document.createElement("button");
    searchBtn.setAttribute("id", "search-btn");
    searchBtn.textContent = "Search";

    searchBtn.addEventListener("click", (event) => {
        searchBills(billSearch.value);
    });

    let memberId = data.results[0].id;
    let firstName = data.results[0].first_name;
    let lastName = data.results[0].last_name;

    let repName = document.createElement("h1");
    repName.textContent = "Name: " + firstName + " " + lastName;

    let birthdate = document.createElement("h1");
    birthdate.textContent = "Date of Birth: " + data.results[0].date_of_birth;

    let title = document.createElement("h1");
    title.textContent = "Title: " + data.results[0].roles[0].title;

    let industryBtn = document.createElement("button");
    industryBtn.classList = "button is-danger is-rounded is-normal is-focused";
    industryBtn.textContent = "Top Campaign Contributions by Industry";
    industryBtn.addEventListener("click", (event) => {
        industryContributions(memberId);
    });

    let votesBtn = document.createElement("button");
    votesBtn.classList = "button is-danger is-rounded is-normal is-focused";
    votesBtn.textContent = "Last 20 Vote Positions";
    votesBtn.addEventListener("click", (event) => {
        voteRecord(memberId);
    })

    delegationEl.appendChild(bioBox);
    bioBox.appendChild(repName);
    bioBox.appendChild(title);
    bioBox.appendChild(birthdate);
    bioBox.appendChild(billSearch);
    bioBox.appendChild(searchBtn);
    bioBox.appendChild(industryBtn);
    bioBox.appendChild(votesBtn);
    })
}

function industryContributions(id) {
    delegationEl.innerHTML = "";
    fetch(ppUrl + id + ".json", {
        method: "GET",
        headers: {
            "X-API-Key": ppApiKey
        }
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        //console.log(data);
        let cid = data.results[0].crp_id;
        //some members of congress do not have crpids(e.g. Sen. Alex Padilla CA)
        //console.log(cid);
        fetch(osUrl + "&method=candIndustry&cid=" + cid + "&cycle=2021" + osApiKey)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                //console.log(data);
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
                cycle.className = "cycle";
                name.className = "rep-name";
                
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

                for (i = 0; i < data.response.industries.industry.length; i++) {

                    let objData = Object.values(data.response.industries.industry[i]);
                    let industry = document.createElement("p");
                    let contributions = document.createElement("p");

                    industry.textContent = objData[0].industry_name + ": ";
                    contributions.textContent = "$" + objData[0].total;

                    column1.appendChild(industry);
                    column2.appendChild(contributions);
                }
            })
    })
}

function displayReps(state, chamber) {
    selectBar.removeChild(selectBar.lastChild);

    let stateBox = document.createElement("div");
    let selectBox = document.createElement("div");
    let repSelect = document.createElement("select");
    let nilOption = document.createElement("option");

    stateBox.classList = "column is-offset-6";
    selectBox.classList = "select is-danger is-rounded is-normal is-focused";
    repSelect.setAttribute("id", "rep-select");
    nilOption.textContent = "Select Member";

    selectBar.appendChild(selectBox);
    selectBox.appendChild(repSelect);
    repSelect.appendChild(nilOption);

    fetch(ppUrl + chamber + "/" + state + "/current.json", {
        method: "GET",
        headers: {
            "X-API-Key": ppApiKey
        }
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        //console.log(data)
        for (i = 0; i < data.results.length; i++) {
            let repOption = document.createElement("option");
            repOption.setAttribute("value", data.results[i].id);
            repOption.textContent = data.results[i].name;
            repSelect.appendChild(repOption);
        }
        selectBox.addEventListener("change", (event) => {
            repBio(event.target.value); //voteRecord(event.target.value);
        });
    })
}

function displayChamber(state) {
    selectBar.removeChild(selectBar.lastChild);

    let chamberBox = document.createElement("div");
    let selectDiv = document.createElement("div");
    let chamberSelect = document.createElement("select");
    let noOption = document.createElement("option");
    let senateOption = document.createElement("option");
    let houseOption = document.createElement("option");
    
    chamberBox.classList = "column is-offset-6";
    selectDiv.classList = "select is-danger is-rounded is-normal is-focused";

    chamberSelect.setAttribute("id", "chamber-select");
    senateOption.setAttribute("value", "senate");
    houseOption.setAttribute("value", "house");

    noOption.textContent = "Select Chamber";
    senateOption.textContent = "Senate";
    houseOption.textContent = "House of Representatives";

    selectBar.appendChild(selectDiv);
    selectDiv.appendChild(chamberSelect);
    chamberSelect.appendChild(noOption);
    chamberSelect.appendChild(senateOption);
    chamberSelect.appendChild(houseOption);

    selectDiv.addEventListener("change", (event) => {
        displayReps(state, event.target.value);
    })
}



stateSelect.addEventListener('change', (event) => {
    displayChamber(event.target.value);
});
