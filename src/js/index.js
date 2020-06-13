const sourceInput = document.getElementById("sourceUrl");
const searchButton = document.querySelector(".searchSource button");
const styleResult = document.querySelector(".result p.style");
const eventResult = document.querySelector(".result p.event");


let jsonData;

searchButton.addEventListener("click", _ => {
    const url = sourceInput.value;

    fetch(url)
        .then(response => response.json())
        .then(responseJson => {
            jsonData = responseJson;
            console.log(jsonData);

            results = convert(jsonData);
            styleResult.innerText = results[0];
            eventResult.innerText = results[1];

        });
});