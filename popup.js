function pseudoRand(x, y, z) {
    x = (171 * x) % 30269
    y = (172 * y) % 30307
    z = (170 * z) % 30323
    return (x / 30269.0 + y / 30307.0 + z / 30323.0) % 1.0
}


chrome.runtime.sendMessage({ id: "get-data" }, (response) => {
    if (response) {
        //load quote
        quotes = response.quotes.split('\n');

        var date = new Date()
        var index = Math.floor(quotes.length * pseudoRand(date.getDate() * 100, date.getDay() * 1000, date.getFullYear() * 4 + date.getMonth() * 4));

        document.getElementById('quote').innerText = quotes[index]
        console.log(quotes[index]);

        document.getElementById("signature").innerText = '\u2013 ' + response.signature;

        //load image
        if (response.image) {
            document.getElementById("image").src = response.image;
        }

        //load colors
        let c = response.colors
        var color = `rgba(${(c.color >> 24) & 0xFF},${(c.color >> 16) & 0xFF},${(c.color >> 8) & 0xFF},${(Math.floor(100 * (c.color & 0xFF) / 255)) / 100})`;
        var highlight = `rgba(${(c.highlight >> 24) & 0xFF},${(c.highlight >> 16) & 0xFF},${(c.highlight >> 8) & 0xFF},${(Math.floor(100 * (c.highlight & 0xFF) / 255)) / 100})`;
        var p = document.getElementsByTagName("p");
        for (let i = 0; i < p.length; i++) {
            p[i].style.color = color;
            p[i].style.backgroundColor = highlight;
        }
    } else {
        console.log("No quotes received");
    }
});


//update date & badge
chrome.runtime.sendMessage({ id: "save-date" });