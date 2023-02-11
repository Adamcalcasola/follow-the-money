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