const sourceInput = document.getElementById("sourceUrl");
const searchButton = document.querySelector(".searchSource button");
const result = document.querySelector(".result p");

let jsonData;

searchButton.addEventListener("click", _ => {
    const url = sourceInput.value;

    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            jsonData = responseJson;
            console.log(jsonData);

            convert(jsonData);
        });
});