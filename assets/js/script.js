// Global Variables
let osApiKey = "&apikey=57bf365637e080dcba9bad64d8d27cd9";
let ppApiKey = "kqVbQ8sZ5zEvgLGkTATaYq7atntKVhzG7Nnx2e9k"
let osUrl = "https://www.opensecrets.org/api/?output=json";
let ppUrl = "https://api.propublica.org/congress/v1/members/";
let ppUrl2 = "https://api.propublica.org/congress/v1/bills/search.json?query=";
let stateSelect = document.getElementById("state");
let displayEl = document.getElementById("display");
let selectBar = document.getElementById("select-bar");
let voteDisplay = document.getElementById("vote-display");
let voteBox = document.createElement("div");
let bioBox = document.createElement("div");
let searchSave = document.getElementById("search-save");
var searches = [];
bioBox.classList = "board";
voteBox.classList = "column is-fluid is-danger board";
voteBox.setAttribute("id", "vote-box");

// loads previous search from local storage
function loadSearch() {
    searches = JSON.parse(localStorage.getItem("searches")) || [];
    for(i=0;i<searches.length;i++) {
        let saveOption = document.createElement("Option");
        saveOption.setAttribute("value", searches[i].id);
        saveOption.textContent = searches[i].name;
        searchSave.appendChild(saveOption);
    }
}

// saves searched representive and populated select box
function saveSearch(id) {
    fetch(ppUrl + id + ".json", {
        method: "GET",
        headers: {"X-API-Key": ppApiKey}
    }).then(function (response) {
        return response.json();
    }).then(function (data) {

    let memberId = data.results[0].id;
    let firstName = data.results[0].first_name;
    let lastName = data.results[0].last_name;
    let fullName = firstName + " " + lastName;

    let saveOption = document.createElement("Option");
    saveOption.setAttribute("value", memberId);
    saveOption.textContent = fullName;
    searchSave.appendChild(saveOption);

    searches.push({
        id: memberId,
        name: fullName
    });
 
    localStorage.setItem("searches", JSON.stringify(searches));
    repBio(memberId);
    })
}

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
// Displays reps voting summary and current committee assignments
function voteSummary(id) {
    fetch(ppUrl + id + ".json", {
        method: "GET",
        headers: {"X-API-Key": ppApiKey}
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
    let firstName = data.results[0].first_name;
    let lastName = data.results[0].last_name;
    let party = data.results[0].current_party;
    let lastUpdated = data.results[0].last_updated;
    let billsCosponsored = data.results[0].roles[0].bills_cosponsored;
    let billsSponsored = data.results[0].roles[0].bills_sponsored;
    let missedVotes = data.results[0].roles[0].missed_votes;
    let missedVotesPct = data.results[0].roles[0].missed_votes_pct;
    let totalPresent = data.results[0].roles[0].total_present;
    let totalVotes =data.results[0].roles[0].total_votes;
    let votesAgainstPartyPct = data.results[0].roles[0].votes_against_party_pct;
    let votesWithPartyPct = data.results[0].roles[0].votes_with_party_pct;
    let committees = data.results[0].roles[0].committees.length;
    let committee = [];
    for (i=0;i<committees;i++) {
        committee.push(data.results[0].roles[0].committees[i].name);
    }
    let breakEl = document.createElement("br");
    let lastUpdatedEl = document.createElement("div");
    let billsCosponsoredEl = document.createElement("div");
    let billsSponsoredEl = document.createElement("div");
    let missedVotesEl = document.createElement("div");
    let missedVotesPctEl = document.createElement("div");
    let totalPresentEl = document.createElement("div");
    let totalVotesEl = document.createElement("div");
    let votesAgainstEl = document.createElement("div");
    let votesWithEl = document.createElement("div");
    let committeesEl = document.createElement("div");
    let committeesHeader = document.createElement("div");
    
    let repName = document.createElement("h1");
    repName.className = "rep-name";
    repName.textContent = firstName + " " + lastName + " (" + party + ")";
    lastUpdatedEl.textContent = "Last Updated: " + lastUpdated;
    billsCosponsoredEl.textContent = "Bills Cosponsored: " + billsCosponsored;
    billsSponsoredEl.textContent = "Bills Sponsored: " + billsSponsored;
    missedVotesEl.textContent = "Missed Votes: " + missedVotes;
    missedVotesPctEl.textContent = "% Missed Votes: " + missedVotesPct + "%";
    totalPresentEl.textContent = "Total Present: " + totalPresent;
    totalVotesEl.textContent = "Total Votes: " + totalVotes;
    votesAgainstEl.textContent = "Votes Against Party: " + votesAgainstPartyPct + "%";
    votesWithEl.textContent = "Votes With Party: " + votesWithPartyPct + "%";
    committeesHeader.textContent = "Current Committee Assignments:";
    committeesEl.textContent = committee;

    displayEl.innerHTML = "";
    bioBox.innerHTML = "";
    
    let returnBtn = document.createElement("button");
    returnBtn.classList = "button is-danger is-rounded is-normal is-focused";
    returnBtn.textContent = "Return to Representitive Bio";
    returnBtn.addEventListener("click", (event) => {
        repBio(id);
    })

    displayEl.appendChild(bioBox);
    bioBox.appendChild(repName);
    bioBox.appendChild(lastUpdatedEl);
    bioBox.appendChild(breakEl);
    bioBox.appendChild(billsCosponsoredEl);
    bioBox.appendChild(billsSponsoredEl);
    bioBox.appendChild(missedVotesEl);
    bioBox.appendChild(missedVotesPctEl);
    bioBox.appendChild(totalPresentEl);
    bioBox.appendChild(totalVotesEl);
    bioBox.appendChild(votesAgainstEl);
    bioBox.appendChild(votesWithEl);
    bioBox.appendChild(committeesHeader);
    bioBox.appendChild(committeesEl);
    bioBox.appendChild(breakEl);
    bioBox.appendChild(returnBtn);
    })
}
// Displays reps voting record
function voteRecord(id) {
    displayEl.innerHTML = "";
    fetch(ppUrl + id + "/votes.json", {
        method: "GET",
        headers: {
            "X-API-Key": ppApiKey
        }
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        for (i = 0; i < data.results[0].votes.length; i++) {
            let container = document.createElement("div");
            let column1 = document.createElement("div");
            let column2 = document.createElement("div");
            let column3 = document.createElement("div");
            let billDescTitle = document.createElement("h2");
            let billDesc = document.createElement("div");
            let positionTitle = document.createElement("h2");
            let position = document.createElement("div");
            let totalVote = document.createElement("h2");
            let totalVoteYes = document.createElement("div");
            let totalVoteNo = document.createElement("div");
            let totalVoteNV = document.createElement("div");

            
            container.className = "columns";
            column1.className = "column";
            column2.className = "column";
            column3.className = "column";
            billDescTitle.className = "billDescTitle";
            billDesc.className = "billDesc";
            positionTitle.className = "positionTitle"
            position.className = "position";
            totalVote.className = "totalvote";
            totalVoteYes.className = "totalVoteYes";
            totalVoteNo.className =  "totalVoteNo";
            totalVoteNV.className = "totalVoteNV";
            
            billDescTitle.textContent = "Description"
            billDesc.textContent = data.results[0].votes[i].description;

            positionTitle.textContent = "Position";
            position.textContent = data.results[0].votes[i].position;

            totalVote.textContent = "Total Vote Count";
            totalVoteYes.textContent = "Yes : " + data.results[0].votes[i].total.yes;
            totalVoteNo.textContent = "No: " + data.results[0].votes[i].total.no;
            totalVoteNV.textContent = "Not Voting: " + data.results[0].votes[i].total.not_voting;

            voteRecordEl.appendChild(container);

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
// Displays reps biography and produces buttons for other functional displays
function repBio(id) {
    fetch(ppUrl + id + ".json", {
        method: "GET",
        headers: {"X-API-Key": ppApiKey}
    }).then(function (response) {
        return response.json();
    }).then(function (data) {

    // let state = data.results[0].roles[0].state;
    // getLegislators(state);
    
    // let billSearch = document.createElement("input");
    // billSearch.setAttribute("type", "search");
    // billSearch.setAttribute("id", "bill-search");
    
    // let searchBtn = document.createElement("button");
    // searchBtn.setAttribute("id", "search-btn");
    // searchBtn.textContent = "Search";
    
    // searchBtn.addEventListener("click", (event) => {
    //     searchBills(billSearch.value);
    // });

    displayEl.innerHTML = "";
    bioBox.innerHTML = "";
        
    let memberId = data.results[0].id;
    let firstName = data.results[0].first_name;
    let lastName = data.results[0].last_name;
    let party = data.results[0].current_party;
    let repUrl = data.results[0].url;
    let fullName = firstName + " " + lastName + " (" + party + ")"
    
    let repName = document.createElement("h1");
    repName.className = "rep-name";
    repName.textContent = fullName;

    let title = document.createElement("h1");
    title.className = "cycle";
    title.textContent = "Title: " + data.results[0].roles[0].title;
    
    let birthdate = document.createElement("h1");
    birthdate.textContent = "Date of Birth: " + data.results[0].date_of_birth;

    let urlLink = document.createElement("a");
    urlLink.setAttribute("href", repUrl);
    urlLink.textContent = repUrl;

    let summaryBtn = document.createElement("button");
    summaryBtn.classList = "button is-danger is-rounded is-normal is-focused";
    summaryBtn.textContent = "Summary of Fundraising Information";
    summaryBtn.addEventListener("click", (event) => {
        candSummary(memberId);
    });

    let contribBtn = document.createElement("button");
    contribBtn.classList = "button is-danger is-rounded is-normal is-focused";
    contribBtn.textContent = "Top Campaign Contributors";
    contribBtn.addEventListener("click", (event) => {
        candContrib(memberId);
    });

    let industryBtn = document.createElement("button");
    industryBtn.classList = "button is-danger is-rounded is-normal is-focused";
    industryBtn.textContent = "Top Campaign Contributions by Industry";
    industryBtn.addEventListener("click", (event) => {
        candIndustry(memberId);
    });

    let sectorBtn = document.createElement("button");
    sectorBtn.classList = "button is-danger is-rounded is-normal is-focused";
    sectorBtn.textContent = "Top Campaign Contributions by Sector";
    sectorBtn.addEventListener("click", (event) => {
        candSector(memberId);
    });

    let voteSummaryBtn = document.createElement("button");
    voteSummaryBtn.classList = "button is-danger is-rounded is-normal is-focused";
    voteSummaryBtn.textContent = "Voting Summary";
    voteSummaryBtn.addEventListener("click", (event) => {
        voteSummary(memberId);
    })

    let votesBtn = document.createElement("button");
    votesBtn.classList = "button is-danger is-rounded is-normal is-focused";
    votesBtn.textContent = "Last 20 Vote Positions";
    votesBtn.addEventListener("click", (event) => {
        voteRecord(memberId);
    })

    displayEl.appendChild(bioBox);
    bioBox.appendChild(repName);
    bioBox.appendChild(title);
    bioBox.appendChild(birthdate);
    bioBox.appendChild(urlLink);
    bioBox.appendChild(summaryBtn);
    bioBox.appendChild(contribBtn);
    bioBox.appendChild(industryBtn);
    bioBox.appendChild(sectorBtn);
    bioBox.appendChild(voteSummaryBtn);
    bioBox.appendChild(votesBtn);
    })
}
// Unfinished function to get Legislators by state. Uncalled and should probably be deleted
// function getLegislators(state) {
//     fetch(osUrl + "&method=getLegislators&id=" + state + osApiKey)
//         .then(function (response) {
//             return response.json();
//         }).then(function (data) {
//             //console.log(data);
//             for (i=0;i<data.response.legislator.length;i++) {
//             }
//         });
//     }

// Unfinished CID retrieval function for Open Secret calls
// function getCid(id) {
//         let cid = fetch(ppUrl + id + ".json", {
//             method: "GET",
//         headers: {
//             "X-API-Key": ppApiKey
//         }
//     }).then(function (response) {
//         return response.json();
//     }).then(function (data) {
//         console.log(data);
//         let crp = data.results[0].crp_id;
//         console.log(crp);
//         return crp;
//     })
//     return cid;
// }
// Function to display candidates financial summary
function candSummary(id) {
    fetch(ppUrl + id + ".json", {
        method: "GET",
        headers: {
            "X-API-Key": ppApiKey
        }
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        let cid = data.results[0].crp_id;
        fetch(osUrl + "&method=candSummary&cid=" + cid + "&cycle=2021" + osApiKey)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                
                displayEl.innerHTML = "";
                let objBios = Object.values(data.response.summary);
                let box = document.createElement("div");
                let name = document.createElement("div");
                let cycle = document.createElement("div");
                let updated = document.createElement("div");
                let origin = document.createElement("div");
                let container = document.createElement("div");
                let column1 = document.createElement("div");
                let column2 = document.createElement("div");
                let title = document.createElement("h2");
                let totals = document.createElement("h2");
                let cashWords = document.createElement("p");
                let cashOnHand = document.createElement("p");
                let debtWords = document.createElement("p");
                let debt = document.createElement("p");
                let spentWords = document.createElement("p");
                let spent = document.createElement("p");
                let totalWords = document.createElement("p");
                let total = document.createElement("p");
                
                let returnBtn = document.createElement("button");
                returnBtn.classList = "button is-danger is-rounded is-normal is-focused";
                returnBtn.textContent = "Return to Representitive Bio";
                returnBtn.addEventListener("click", (event) => {
                    repBio(id);
                })

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
                title.textContent = "Summary:";
                totals.textContent = "Totals:";

                cashWords.textContent = "Cash On Hand";
                cashOnHand.textContent = "$" + objBios[0].cash_on_hand;
                debtWords.textContent = "Debt"
                debt.textContent = "$" + objBios[0].debt;
                spentWords.textContent = "Spent"
                spent.textContent = "$" + objBios[0].spent;
                totalWords.textContent = "Total"
                total.textContent = "$" + objBios[0].total;

                displayEl.appendChild(box);
                box.appendChild(name);
                box.appendChild(cycle);
                box.appendChild(updated);
                box.appendChild(origin);
                box.appendChild(container);
                box.appendChild(cashOnHand);
                box.appendChild(debt);
                box.appendChild(spent);
                box.appendChild(total);
                box.appendChild(returnBtn);
                container.appendChild(column1);
                container.appendChild(column2);
                column1.appendChild(title);
                column1.appendChild(cashWords);
                column1.appendChild(debtWords);
                column1.appendChild(spentWords);
                column1.appendChild(totalWords);
                column2.appendChild(totals);
                column2.appendChild(cashOnHand);
                column2.appendChild(debt);
                column2.appendChild(spent);
                column2.appendChild(total);
            })
    })
}
// Function to display candidates top contributors
function candContrib(id) {
    fetch(ppUrl + id + ".json", {
        method: "GET",
        headers: {
            "X-API-Key": ppApiKey
        }
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        let cid = data.results[0].crp_id;
        fetch(osUrl + "&method=candContrib&cid=" + cid + "&cycle=2021" + osApiKey)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                
                displayEl.innerHTML = "";
                let objBios = Object.values(data.response.contributors);
                let box = document.createElement("div");
                let name = document.createElement("div");
                let cycle = document.createElement("div");
                let updated = document.createElement("div");
                let origin = document.createElement("div");
                let container = document.createElement("div");
                let column1 = document.createElement("div");
                let column2 = document.createElement("div");
                let title = document.createElement("h2");
                let contributionsTitle = document.createElement("h2");
                
                let returnBtn = document.createElement("button");
                returnBtn.classList = "button is-danger is-rounded is-normal is-focused";
                returnBtn.textContent = "Return to Representitive Bio";
                returnBtn.addEventListener("click", (event) => {
                    repBio(id);
                })

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
                title.textContent = "Contributors:";
                contributionsTitle.textContent = "Total Contributions:";

                displayEl.appendChild(box);
                box.appendChild(name);
                box.appendChild(cycle);
                box.appendChild(updated);
                box.appendChild(origin);
                box.appendChild(container);
                box.appendChild(returnBtn);
                container.appendChild(column1);
                container.appendChild(column2);
                column1.appendChild(title);
                column2.appendChild(contributionsTitle);

                for (i = 0; i < data.response.contributors.contributor.length; i++) {

                    let objData = Object.values(data.response.contributors.contributor[i]);
                    let contributor = document.createElement("p");
                    let contributions = document.createElement("p");

                    contributor.textContent = objData[0].org_name + ": ";
                    contributions.textContent = "$" + objData[0].total;

                    column1.appendChild(contributor);
                    column2.appendChild(contributions);
                }
            })
    })
}
// Function to display candidates top industry contributors
function candIndustry(id) {
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

                displayEl.appendChild(box);
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
// Function to display candidates top sector contributors
function candSector(id) {
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
        fetch(osUrl + "&method=candSector&cid=" + cid + "&cycle=2021" + osApiKey)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                //console.log(data);
                displayEl.innerHTML = "";
                let objBios = Object.values(data.response.sectors);
                let box = document.createElement("div");
                let name = document.createElement("div");
                let cycle = document.createElement("div");
                let updated = document.createElement("div");
                let origin = document.createElement("div");
                let container = document.createElement("div");
                let column1 = document.createElement("div");
                let column2 = document.createElement("div");
                let title = document.createElement("h2");
                let contributionsTitle = document.createElement("h2");

                let returnBtn = document.createElement("button");
                returnBtn.classList = "button is-danger is-rounded is-normal is-focused";
                returnBtn.textContent = "Return to Representitive Bio";
                returnBtn.addEventListener("click", (event) => {
                    repBio(id);
                })
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
                title.textContent = "Industry:";
                contributionsTitle.textContent = "Total Contributions:";

                displayEl.appendChild(box);
                box.appendChild(name);
                box.appendChild(cycle);
                box.appendChild(updated);
                box.appendChild(origin);
                box.appendChild(container);
                box.appendChild(returnBtn);
                container.appendChild(column1);
                container.appendChild(column2);
                column1.appendChild(title);
                column2.appendChild(contributionsTitle);

                for (i = 0; i < data.response.sectors.sector.length; i++) {

                    let objData = Object.values(data.response.sectors.sector[i]);
                    let sector = document.createElement("p");
                    let contributions = document.createElement("p");

                    sector.textContent = objData[0].sector_name + ": ";
                    contributions.textContent = "$" + objData[0].total;

                    column1.appendChild(sector);
                    column2.appendChild(contributions);
                }
            })
    })
}
// Function to display reps in select box for a given state and chamber
function displayReps(state, chamber) {
    selectBar.removeChild(selectBar.lastChild);

    let stateBox = document.createElement("div");
    let selectBox = document.createElement("div");
    let repSelect = document.createElement("select");
    let nilOption = document.createElement("option");

    stateBox.classList = "column is-offset-6";
    selectBox.classList = "select is-danger is-rounded is-normal is-focused";
    repSelect.setAttribute("id", "rep-select");
    nilOption.setAttribute("value", "Select Member");
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
        for (i = 0; i < data.results.length; i++) {
            let repOption = document.createElement("option");
            repOption.setAttribute("value", data.results[i].id);
            repOption.textContent = data.results[i].name;
            repSelect.appendChild(repOption);
        }
        selectBox.addEventListener("change", (event) => {
            if (event.target.value === "Select Member") {
                location.reload();
            } else {
            saveSearch(event.target.value);
            }
        });
    })
}
// Function to display chambeer select box after selecting state
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
    noOption.setAttribute("value", "Select Chamber");
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
        if (event.target.value === "Select Chamber") {
            location.reload();
        } else {
        displayReps(state, event.target.value);
        }
    })
}

loadSearch();

// Event listeners for saved search and state selector
searchSave.addEventListener('change', (event) => {
    if (event.target.value === "Previous Searches") {
        location.reload();
    } else {
    repBio(event.target.value);
    }
});

stateSelect.addEventListener('change', (event) => {
    if (event.target.value === "Select State") {
        location.reload();
    } else {
    displayChamber(event.target.value);
    }
});

