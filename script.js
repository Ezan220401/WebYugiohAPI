const API_URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

const cardPage = document.querySelector(".card");
const infoContainer = document.getElementById("info_container");
const cardContainer = document.getElementById("yugioh_card_container");
const form = document.getElementById("form");

// Menampilkan kartu random saat halaman dimuat
window.addEventListener("load", displayRandom);

form.addEventListener("submit", function(event) {
    event.preventDefault();
    let inputName = document.getElementById("name_card").value.trim();

    if (!inputName) {
        inputName = "Raidraptor - Force Strix";
    }

    fetch(`${API_URL}`)
        .then((response) => response.json())
        .then((data) => {
            // Filter kartu yang memiliki nama sesuai input
            const matchingCards = data.data.filter(card =>
                card.name.toLowerCase().includes(inputName.toLowerCase())
            );

            // Nama tidak ditemukan
            if (matchingCards.length === 0) {
                alert("Tidak ada kartu yang cocok!");
                cardContainer.innerHTML = "";
                return;
            }

            // Bila hanya ada satu kartu yang ditemukan
            const getCard = data.data.find(card => card.name.toLowerCase() === inputName.toLowerCase());
            if (getCard) {
                displayCard(getCard);
                return;
            }

            // Ada lebih dari satu kartu
            if (matchingCards.length >= 2) {
                const randomCards = getRandomCards(matchingCards, 12); // Maksimal 12 kartu
                displayCards(randomCards);
                alert("There are several cards for your input (max 12 cards display).");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});

// Fungsi untuk mengambil hingga n elemen acak dari array
function getRandomCards(array, n) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

// Fungsi untuk menampilkan gambar kartu beruntun
function displayCards(cards) {
    cardContainer.innerHTML = "";
    infoContainer.innerHTML = "";
    infoContainer.style.display = "none"

    cardContainer.style.display = "grid";
    cardContainer.style.margin = "10px auto";
    cardContainer.style.gap = "10px";
    cardContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(180px, 1fr))";

    cards.forEach(card => {
        const link = document.createElement("a");
        link.href = "#";
        link.setAttribute("data-id", card.id);
        link.className = "display";
        link.style.textDecoration = "none";

        const image = document.createElement("img");
        image.src = card.card_images[0].image_url;
        image.alt = card.name;
        image.style.width = "180px";
        image.style.margin = "10px";
        image.style.borderRadius = "5px";
        image.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

        link.appendChild(image);
        cardContainer.appendChild(link);
    });
}

// Menampilkan kartu random
function displayRandom() {
    fetch(`${API_URL}`)
        .then((response) => response.json())
        .then((data) => {
            const randomIndex = Math.floor(Math.random() * data.data.length);
            const randomCard = data.data[randomIndex];
            displayCard(randomCard);
        })
        .catch((error) => {
            console.error("Error Fetching Card Data:", error);
        });
}

// Memilih kartu dari klik
cardContainer.addEventListener("click", (event) => {
    const target = event.target.closest("a");
    if (target) {
        const cardId = target.getAttribute("data-id");

        fetch(`${API_URL}`)
            .then((response) => response.json())
            .then((data) => {
                const selectedCard = data.data.find(card => card.id == cardId);
                if (selectedCard) {
                    displayCard(selectedCard);
                }
            })
            .catch((error) => {
                console.error("Error Fetching Card Data:", error);
            });
    }
});

// Menampilkan detail kartu
function displayCard(card) {
    cardContainer.innerHTML = ""; // Kosongkan container
    cardContainer.style.display = "flex"; // Ganti grid dengan flex
    cardContainer.style.justifyContent = "center"; // Pusatkan kartu

    const image = document.createElement("img");
    image.src = card.card_images[0].image_url;
    image.alt = card.name;
    image.style.width = "300px"; 
    image.style.borderRadius = "5px";
    image.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    image.style.margin = "10px";

    cardContainer.appendChild(image);

    infoContainer.innerHTML = `
        <h2>${card.name}</h2>
        <h4 style="background: yellow; padding: 5px;">Price: ${card.card_prices?.[0]?.amazon_price || "N/A"} USD in Amazon</h4>
        <h4 style="background: yellow; padding: 5px;">Description</h4>
        <p>${card.desc}</p>`;
    infoContainer.style.display = "block";
}
