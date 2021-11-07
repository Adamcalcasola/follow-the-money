let osApiKey = "&apikey=57bf365637e080dcba9bad64d8d27cd9";
let ppApiKey = "kqVbQ8sZ5zEvgLGkTATaYq7atntKVhzG7Nnx2e9k"
let osUrl = "http://www.opensecrets.org/api/?method=getLegislators&output=json&id=";
let ppUrl = "https://api.propublica.org/congress/v1/members/" + memberId + "/votes.json";




let stateSelect = document.querySelector("#state");
let delegationEl = document.querySelector("#map");





function displayReps() {
    delegationEl.innerHTML = "";
    let state = stateSelect.value;
    let stateBox = document.createElement("div");
    stateBox.className = "board";
    delegationEl.appendChild(stateBox);
    // console.log(stateSelect.value);
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
    let billVotesEl = document.querySelector("#billVotes")
    billVotesEl.innerHTML = "";
    let billVotesBox = document.createElement("div");
    billVotesBox.className = "votebox";
    billVotesEl.appendChild(billVotesBox);
    fetch(ppUrl2, {
        method: "GET",
        headers: {"X-API-Key" : ppApiKey, 
                "Content-Type": "application/json"},
                }
    ).then(function(response){
            return response.json();
        }).then(function(data){
                console.log(data);
            // console.log(data.results);
            // for (i = 0; i < data.results.votes.length; i++){
            //     let votes = data.results.votes;
            //     console.log(data.results.votes[0].url);
            //     let voteBox = document.createElement("div");
            //     voteBox.className = "votes";
            //     let billName = document.createElement("p");
            //     billName.textContent = votes.description;
            //     billName.setAttribute("href", votes[i].url);
            //     billName.setAttribute("target", "_blank"); 
            //     billVotesBox.appendChild(voteBox);
            //     voteBox.appendChild(billName);
                    
            }

           
        // })
       
      
        )}





proPublicaFetch();

stateSelect.addEventListener('change', (event) => {displayReps(), proPublicaFetch();});

// stateSelect.addEventListener('change', (event) => {
//     console.log(stateSelect.value);
// });


//if (window.addEventListener) { window.addEventListener("message", function (event) { if (event.data.length >= 22) { if (event.data.substr(0, 22) == "__MM-LOCATION.REDIRECT") location = event.data.substr(22); } }, false); } else if (window.attachEvent) { window.attachEvent("message", function (event) { if (event.data.length >= 22) { if (event.data.substr(0, 22) == "__MM-LOCATION.REDIRECT") location = event.data.substr(22); } }, false); }

