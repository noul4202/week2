const comming = document.getElementById("duckIsComming");
const duckImg = document.getElementById("realDuck");

async function loadingDuck(params) {
    try{
        const response = await fetch('https://random-d.uk/api/random');
        const data = await response.json();
        const imgUrl = data.url;

        duckImg.src = imgUrl;

        duckImg.onload = () => {
            duckImg.style.display = 'block';
            comming.style.display = 'none';
        }

        duckImg.onerror = () => {
            comming.textContent = "Failed to load duck image.";
        }
    }
    catch (error) {
        comming.textContent = "Error fetching duck image.";
    }
}

loadingDuck();