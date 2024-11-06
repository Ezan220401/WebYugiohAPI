const API_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
const infoContainer = document.getElementById("info_container");
const cardContainer = document.getElementById("yugioh_card_container");
const form = document.getElementById("form")

function displayCard(){
    fetch(`${API_URL}`)
        .then((response) => response.json())
        .then((data) => {
            const randomIndex = Math.floor(Math.random() * data.data.length);
            const randomCard = data.data[randomIndex];

            const image = document.createElement("img");
            image.src = randomCard.card_images[0].image_url;
            image.alt = randomCard.name;

            //Menghapus kartu sebelumnya
            cardContainer.innerHTML = "";
            cardContainer.appendChild(image);

            infoContainer.innerHTML = `<h2>${randomCard.name}</h2>
                                        <h4>Price: ${randomCard.card_prices[0].amazon_price} USD in Amazon</h4>
                                        <h4>Description</h4>
                                        <p>${randomCard.desc}</p>`
        }).catch((error) => {
            console.error("Sorry: Error Fetching Card Data", error);
        });
    }

    window.addEventListener("load", displayCard);