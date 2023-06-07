var links = document.querySelectorAll("a");

links.forEach(function (link) {
    if (link.target === "_blank") {
        if (localStorage.getItem(link.href)) {
            link.classList.add("visited");
        } else {
            link.addEventListener("click", function () {
                localStorage.setItem(link.href, true);
                link.classList.add("visited");
            });
        }
    }
});