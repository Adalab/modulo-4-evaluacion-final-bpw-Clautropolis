/*document.addEventListener("DOMContentLoaded", getPlants);

async function getPlants() {
    const response = await fetch('/plants'); 
    const data = await response.json();
    
    const list = document.getElementById("plant-list");
    list.innerHTML = ""; 

    data.results.forEach(plant => {
        const li = document.createElement("li");
        li.textContent = `${plant.name} - ${plant.color}`;
        list.appendChild(li);
    });
}*/

const buttonSearch = document.querySelector('.button_search-js');
const inputSearch = document.querySelector('.input_search-js');
let errorMessage = document.querySelector('.error-message');
console.log(buttonSearch, inputSearch);

async function getFavorites(ev) {
    ev.preventDefault();
    const userId = inputSearch.value;
    console.log(userId);
    
    if (!userId) {
        errorMessage.textContent = "Por favor, introduce un ID de usuario.";
        return;
    }

    const response = await fetch(`http://localhost:5001/user/${userId}/favorites`);
    console.log(response);
    const data = await response.json();
    console.log(data);
    
    const list = document.getElementById("favorites-list");
    list.innerHTML = ""; 

    if (data.success) {
        data.results.forEach(plant => {
            const li = document.createElement("li");
            li.textContent = `${plant.name} - ${plant.color}`;
            list.appendChild(li);
        });
    } else {
        list.innerHTML = "<li>No se encontraron plantas favoritas.</li>";
    }
}

buttonSearch.addEventListener('click', getFavorites)