document.addEventListener("DOMContentLoaded", () => {
    let toggle = document.getElementById("navigation-toggle");
    toggle.onclick = function() {
        let links = document.getElementById("navigation").querySelector("ul")
        if (links.className === "active") {
            links.className = ""
            toggle.innerHTML = '<img src="./media/icons/bars-solid-full.svg">'
        } else {
            links.className = "active"
            toggle.innerHTML = '<img src="./media/icons/xmark-solid-full.svg">'
        }
    }
    toggle.innerHTML = '<img src="./media/icons/bars-solid-full.svg">'
})