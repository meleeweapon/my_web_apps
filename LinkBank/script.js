const input  = document.getElementById("input");
const button = document.getElementById("add_button");
let   list   = document.getElementById("list");

const url_arr = [];

if (url_arr.length === 0) {
    list.innerHTML = "No links."
}

button.addEventListener("click" ,() => {
    // get text from input and reset it
    url_arr.push(input.value);
    input.value = "";

    newHTML = url_arr.reduce((pre, cur) => {
        return pre + "<li><a href='" + cur + "' target='_blank'>" + cur + "</a></li>";
    }, "");

    console.log(newHTML)
    list.innerHTML = newHTML;

    // console.log(url_arr);
})