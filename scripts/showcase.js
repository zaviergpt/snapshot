function getPhoto(id) {
    overlay = document.getElementById("overlay");
    overlay.querySelector("iframe").src = "./photo.html?" + (new URLSearchParams({
        id: id
    })).toString();
    overlay.style.display = "block";
}
document.addEventListener("DOMContentLoaded", async (event) => {
    let metadata = await (await fetch("https://zaviergpt.github.io/snapshot/media/photos/metadata.json")).json();
    let filter = document.getElementById("filter").querySelectorAll("button");
    let input = document.getElementById("search-input");
    let params = new URLSearchParams(window.location.search);
    function getResults(query, type) {
        let results = [document.getElementById("results"), {}];
        results[0].innerHTML = "";
        for (let index = 0, button = filter[index]; index < filter.length; index ++, button = filter[index]) {
            if (button.textContent.toLowerCase() === type) {
                button.className = "active";
            } else {
                button.className = "unactive";
            }
        }
        if (query && query.length > 0) {
            query = query.replace(/[^a-zA-Z]+/g, "").toLowerCase();
            filtered = Object.entries(metadata).filter((entry) => (type === "all" ? (entry[1].name + entry[1].author + entry[1].collection + entry[1].metadata.Model).replace(/[^a-zA-Z]+/g, "").toLowerCase() : entry[1][type].replace(/[^a-zA-Z]+/g, "").toLowerCase()).includes(query)); // https://stackoverflow.com/questions/23136947/javascript-regex-to-return-letters-only
        } else { // show none query, with type
            filtered = Object.entries(metadata);
        }
        filteredt = filtered.sort((a, b) => { return a[0] < b[0] ? -1 : 1 }) //
        if (type === "all") {
            results[1] = filtered
            for (var index = 0, data = results[1][index]; index < results[1].length; index ++, data = results[1][index]) {
                let photo = document.createElement("li");
                photo.className = "photo";
                photo.innerHTML = `<button onclick="getPhoto('${data[0].split(".")[0]}')"><img src="./media/photos/${data[0]}"><div class="info"><div><span>The ${data[1].collection} Collection</span><h1>${data[1].name}</h1></div><img src="./media/icons/expand-solid-full.svg"></div></button>`;
                results[0].appendChild(photo);
            }
        } else {
            filtered.forEach((entry) => {
                if (!Object.keys(results[1]).includes(entry[1][type])) results[1][entry[1][type]] = []
                results[1][entry[1][type]].push(entry)
            })
            let categories = Object.entries(results[1]);
            for (var index = 0, data = categories[index]; index < categories.length; index ++, data = categories[index]) {
                let category = document.createElement("li");
                let info = document.createElement("div");
                let photos = [document.createElement("ul"), data[1], document.createElement("div")];
                for (var index2 = 0, data2 = photos[1][index2]; index2 < photos[1].length; index2 ++, data2 = photos[1][index2]) {
                    let photo = document.createElement("li");
                    photo.className = "photo";
                    photo.innerHTML = `<button onclick="getPhoto('${data2[0].split(".")[0]}')"><img src="./media/photos/${data2[0]}"><div class="info"><div><span>The ${data2[1].collection} Collection</span><h1>${data2[1].name}</h1></div><img src="./media/icons/expand-solid-full.svg"></div></button>`;
                    photos[0].appendChild(photo);
                }
                info.className = "info";
                info.innerHTML = `<h1>${data[0]}</h1><span>${photos[1].length} Photos</span>`;
                category.className = "category";
                photos[0].className = "photos";
                photos[2].className = "scrollable";
                photos[2].appendChild(photos[0])
                category.appendChild(info)
                category.appendChild(photos[2]);
                results[0].appendChild(category);
            }
        }
    }
    for (var index = 0, button = filter[index]; index < filter.length; index ++, button = filter[index]) {
        button.onclick = function() {
            window.location.href = "?" + (new URLSearchParams({
                query: params.has("query") ? params.get("query") : "",
                filter: this.textContent.toLowerCase()
            })).toString();
        }
    }
    if (window.location.search.length > 0) {
        input.value = params.get("query");
        document.getElementById("search-filter").value = params.has("filter") ? params.get("filter") : "all";
        getResults(input.value, params.has("filter") ? params.get("filter") : "all");
    } else {
        getResults(null, "all");
    }
})