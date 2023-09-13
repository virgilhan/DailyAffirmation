chrome.runtime.onMessage.addListener((message, senders, sendResponse) => {
    console.log(message);
    let id = message.id;

    if (id === "update-badge") {
        updateBadge();
    }

    if (id === "get-date") {
        getLastOpenedDate();
    }

    if (id === "save-date") {
        saveLastOpenedDate(new Date());
        chrome.action.setBadgeText({ text: '' });
    }

    if (id === "save-quotes") {
        saveQuotes(message.content);
    }

    if (id === "save-signature") {
        saveSignature(message.content);
    }

    if (id === "save-image") {
        saveImage(message.content);
    }

    if (id === "save-colors") {
        saveColors(message.content);
    }

    if (id === "get-data") {
        getData((data) => {
            sendResponse(data);
        });
        return true;
    }
})

function updateBadge() {
    getLastOpenedDate(d => {
        console.log(d);
        if (d) {
            let saveDate = new Date(d);
            let currentDate = new Date();
            saveDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);

            console.log(saveDate, currentDate, currentDate > saveDate)
            if (currentDate > saveDate) {
                chrome.action.setBadgeText({ text: ' ' });
                chrome.action.setBadgeBackgroundColor({ color: '#F00' });
            } else {
                chrome.action.setBadgeText({ text: '' });
            }
        } else {
            chrome.action.setBadgeText({ text: ' ' });
            chrome.action.setBadgeBackgroundColor({ color: '#F00' });
        }
    });
}

function saveLastOpenedDate(date) {
    date.setHours(0, 0, 0, 0);
    chrome.storage.local.set({ 'lastOpenedDate': date.toString() }, function () {
        console.log('Settings saved');
        return ("Setings saved");
    });
}

function getLastOpenedDate(callback) {
    chrome.storage.local.get(['lastOpenedDate'], function (items) {
        console.log('Settings retrieved', items.lastOpenedDate);
        callback(items.lastOpenedDate);
    });
}

function saveQuotes(quotesString) {
    chrome.storage.local.set({ 'quotes': quotesString }, function () {
        console.log('Settings saved');
        return ("Settings saved");
    });
}
function getQuotes(callback) {
    chrome.storage.local.get(['quotes'], function (items) {
        console.log('Settings retrieved', items.quotes);
        if (items.quotes) {
            callback(items.quotes)
        } else {
            fetch("quotes.txt")
                .then((res) => res.text())
                .then((content) => {
                    callback(content);
                })
                .catch((e) => console.error(e));
        }
    });
}

function saveSignature(signature){
    chrome.storage.local.set({ 'signature': signature }, function () {
        console.log('Settings saved');
        return ("Settings saved");
    });
}

function saveImage(urlData){
    chrome.storage.local.set({ 'image': urlData }, function () {
        console.log('Settings saved');
        return ("Settings saved");
    });
}

function saveColors(colors){
    chrome.storage.local.set({ 'colors': colors });
}

function getData(callback){
    chrome.storage.local.get(['quotes','signature','image','colors'], function (items) {
        console.log('Settings retrieved', items);
        if (!items.signature){
            items.signature = 'Pope Innocent III';
        }
        if(!items.colors){
            items.colors = {color:-220080897,highlight:0}
        } else {
            if(!items.colors.color) items.colors.color = -220080897;
            if(!items.colors.highlight) items.colors.highlight = 0;
        }
        if (items.quotes) {
            callback(items);
        } else {
            fetch("quotes.txt")
                .then((res) => res.text())
                .then((content) => {
                    callback({quotes:content,signature:items.signature,image:items.image,colors:items.colors});
                })
                .catch((e) => console.error(e));
        }
    });
}