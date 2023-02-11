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