const textarea = document.querySelector('textarea')
const lineNumbers = document.querySelector('.line-numbers')

textarea.addEventListener('keyup', event => {
  const numberOfLines = event.target.value.split('\n').length

  lineNumbers.innerHTML = Array(numberOfLines)
    .fill('<span></span>')
    .join('')
})

textarea.addEventListener('keydown', event => {
  if (event.key === 'Tab') {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end)
    textarea.focus()

    event.preventDefault()
  }
})

//get current quotes on load
chrome.runtime.sendMessage({ id: "get-data" }, (response) => {

  console.log("Loading values: ",response);
  if (response) {
    //load quote
    document.getElementById('quote-textarea').value = response.quotes;
    lineNumbers.innerHTML = Array(response.quotes.split('\n').length)
      .fill('<span></span>')
      .join('')

    document.getElementById('signature-input').value = response.signature;

    //load image
    if (response.image) {
      document.getElementById("bg-image").src = response.image;
    } else {
      console.log("No Image Found");
    }

    //load colors
    loadColors(response.colors.color,response.colors.highlight)

  } else {
    console.log("No quotes received");
  }
});




// Attach event listeners 
document.addEventListener("DOMContentLoaded", function () {
  //add button listeners
  document.getElementById("save-quotes-btn").addEventListener("click", saveQuotes);
  document.getElementById("upload-quotes-btn").addEventListener("click", uploadQuoteFile);
  document.getElementById("default-quotes-btn").addEventListener("click", loadDefaultQuotes);
  document.getElementById("clear-quotes-btn").addEventListener("click", clearEditor);

  document.getElementById("save-sign-btn").addEventListener("click", saveSignature);

  document.getElementById("default-image-btn").addEventListener("click", loadDefaultImage);
  document.getElementById("upload-image-btn").addEventListener("click", uploadImageFile);
  document.getElementById("save-image-btn").addEventListener("click", saveImage);

  document.getElementById("text-color-default").addEventListener("click", loadDefaultColors);
  document.getElementById("text-color-save").addEventListener("click", saveColors);


  //add colorpicker listeners
  document.getElementById("text-color").addEventListener("change", updateColorValues);
  document.getElementById("text-color-R").addEventListener("change", updateColorPicker);
  document.getElementById("text-color-G").addEventListener("change", updateColorPicker);
  document.getElementById("text-color-B").addEventListener("change", updateColorPicker);

  document.getElementById("text-highlight").addEventListener("change", updateColorValues);
  document.getElementById("text-highlight-R").addEventListener("change", updateColorPicker);
  document.getElementById("text-highlight-G").addEventListener("change", updateColorPicker);
  document.getElementById("text-highlight-B").addEventListener("change", updateColorPicker);
});

function updateColorPicker(){
  let r = document.getElementById("text-color-R").value;
  let g = document.getElementById("text-color-G").value;
  let b = document.getElementById("text-color-B").value;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  r = r.toString(16).padStart(2, '0');
  g = g.toString(16).padStart(2, '0');
  b = b.toString(16).padStart(2, '0');
  document.getElementById("text-color").value = `#${r}${g}${b}`

  r = document.getElementById("text-highlight-R").value;
  g = document.getElementById("text-highlight-G").value;
  b = document.getElementById("text-highlight-B").value;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  r = r.toString(16).padStart(2, '0');
  g = g.toString(16).padStart(2, '0');
  b = b.toString(16).padStart(2, '0');
  document.getElementById("text-highlight").value = `#${r}${g}${b}`

}
function updateColorValues(){
  var color = document.getElementById("text-color").value.replace(/^#/, '');
  color = parseInt(color, 16);
  document.getElementById("text-color-R").value = (color >> 16) & 255;
  document.getElementById("text-color-G").value = (color >> 8) & 255;
  document.getElementById("text-color-B").value = color & 255;

  var highlight = document.getElementById("text-highlight").value.replace(/^#/, '');
  highlight = parseInt(highlight, 16);
  document.getElementById("text-highlight-R").value = (highlight >> 16) & 255;
  document.getElementById("text-highlight-G").value = (highlight >> 8) & 255;
  document.getElementById("text-highlight-B").value = highlight & 255;
}



function uploadQuoteFile() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.txt'

  input.onchange = e => {

    // getting a hold of the file reference
    var file = e.target.files[0];

    // setting up the reader
    var reader = new FileReader();
    reader.readAsText(file); // this is reading as data url

    // here we tell the reader what to do when it's done reading...
    reader.onload = readerEvent => {
      var content = readerEvent.target.result; // this is the content!

      document.getElementById('quote-textarea').value = content;
      lineNumbers.innerHTML = Array(content.split('\n').length)
        .fill('<span></span>')
        .join('')
    }

  }
  input.click();
}

function loadDefaultQuotes() {
  fetch("quotes.txt")
    .then((res) => res.text())
    .then((content) => {
      document.getElementById('quote-textarea').value = content;
      lineNumbers.innerHTML = Array(content.split('\n').length)
        .fill('<span></span>')
        .join('')
    })
    .catch((e) => console.error(e));

  document.getElementById('signature-input').value = 'Pope Innocent III';
}

function saveQuotes() {
  console.log("test");
  chrome.runtime.sendMessage({ id: "save-quotes", content: document.getElementById('quote-textarea').value });
}

function clearEditor() {
  document.getElementById('quote-textarea').value = "";
  lineNumbers.innerHTML = '<span></span>'
}

function saveSignature() {
  chrome.runtime.sendMessage({ id: "save-signature", content: document.getElementById("signature-input").value });
}


function loadDefaultImage() {
  document.getElementById('bg-image').src = "images/Erasmus.png";
}

function uploadImageFile() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.png, .jpg, .jpeg, .webp'

  input.onchange = e => {

    // getting a hold of the file reference
    var file = e.target.files[0];

    // setting up the reader
    var reader = new FileReader();
    reader.readAsDataURL(file); // this is reading as data url

    // here we tell the reader what to do when it's done reading...
    reader.onload = readerEvent => {
      var content = readerEvent.target.result;
      // the result image data
      console.log(content);
      document.getElementById('bg-image').src = content;
    }

  }
  input.click();
}

function saveImage() {
  chrome.runtime.sendMessage({ id: "save-image", content: document.getElementById("bg-image").src });
}

function loadDefaultColors() {
  document.getElementById("text-color").value = '#f2e1d4';
  document.getElementById("text-color-R").value = 0xf2;
  document.getElementById("text-color-G").value = 0xe1;
  document.getElementById("text-color-B").value = 0xd4;
  document.getElementById("text-color-A").value = 0xff;

  document.getElementById("text-highlight").value = '#000000';
  document.getElementById("text-highlight-R").value = 0x00;
  document.getElementById("text-highlight-G").value = 0x00;
  document.getElementById("text-highlight-B").value = 0x00;
  document.getElementById("text-highlight-A").value = 0x00;
}

function saveColors() {
  var color = Number(document.getElementById("text-color-R").value);
  color = (color << 8) | Number(document.getElementById("text-color-G").value);
  color = (color << 8) | Number(document.getElementById("text-color-B").value);
  color = (color << 8) | Number(document.getElementById("text-color-A").value);

  var highlight = Number(document.getElementById("text-highlight-R").value);
  highlight = (highlight << 8) | Number(document.getElementById("text-highlight-G").value);
  highlight = (highlight << 8) | Number(document.getElementById("text-highlight-B").value);
  highlight = (highlight << 8) | Number(document.getElementById("text-highlight-A").value);

  console.log(color,highlight)

  chrome.runtime.sendMessage({ id: "save-colors", content: {color:color,highlight:highlight} });

  // Replace with your actual color value

}


function loadColors(color, highlight){

  // Extract RGBA values
  var r = (color >> 24) & 0xFF;
  var g = (color >> 16) & 0xFF;
  var b = (color >> 8) & 0xFF;
  var a = color & 0xFF;

  // Assign values to input elements
  document.getElementById("text-color").value = "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  document.getElementById("text-color-R").value = r;
  document.getElementById("text-color-G").value = g;
  document.getElementById("text-color-B").value = b;
  document.getElementById("text-color-A").value = a;


  var r = (highlight >> 24) & 0xFF;
  var g = (highlight >> 16) & 0xFF;
  var b = (highlight >> 8) & 0xFF;
  var a = highlight & 0xFF;

  // Assign values to input elements
  document.getElementById("text-highlight").value = "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  document.getElementById("text-highlight-R").value = r;
  document.getElementById("text-highlight-G").value = g;
  document.getElementById("text-highlight-B").value = b;
  document.getElementById("text-highlight-A").value = a;
}
