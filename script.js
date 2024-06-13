var BASE_URL = "https://rickandmortyapi.com/api";
var characterList = document.querySelector(".character-list");
var getCharactersBtn = document.querySelector("button");
var filterForm = document.querySelector(".filters");
var toggleFiltersBtn = document.querySelector(".toggle-filters-btn");

getCharactersBtn.addEventListener("click", function () {
  getCharacters().then(function (data) {
    var characters = data.results;
    displayCharacters(characters);
  });
});

toggleFiltersBtn.addEventListener("click", function () {
  toggleFiltersBtn.textContent = filterForm.classList.contains("show")
    ? "Ver filtros"
    : "Ocultar filtros";

  filterForm.classList.toggle("show");
});

filterForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var elements = event.target.elements;

  var name = elements["name"].value;
  var type = elements["type"].value;
  var species = elements["species"].value;
  var gender = getSelectedRadio(elements, "gender");
  var status = getSelectedRadio(elements, "status");

  var params = {};

  if (name) params.name = name;
  if (type) params.type = type;
  if (species) params.species = species;
  if (gender) params.gender = gender;
  if (status) params.status = status;

  getCharacters(params)
    .then(function (data) {
      if (data.error) {
        return displayError();
      }

      var characters = data.results;
      displayCharacters(characters);
    })
    .catch(function () {
      displayError("Lo sentimos, algo salio mal");
    });
});

function getSelectedRadio(elements, name) {
  var radios = elements[name];

  for (var radio of radios) {
    if (radio.checked) {
      return radio.value;
    }
  }

  return null;
}

function getCharacters(params) {
  var url = new URL(BASE_URL + "/character");

  if (params) {
    Object.keys(params).forEach(function (key) {
      url.searchParams.append(key, params[key]);
    });
  }

  return fetch(url).then(function (res) {
    return res.json();
  });
}

function displayCharacter(character) {
  var charLi = document.createElement("li");
  var charDetailsDiv = document.createElement("div");
  var charImg = document.createElement("img");
  var nameH2 = document.createElement("h2");
  var metadataSpan = document.createElement("span");

  charLi.classList.add("character-card");
  charDetailsDiv.classList.add("details");
  metadataSpan.classList.add(character.status.toLowerCase());
  metadataSpan.textContent = character.species + " - " + character.status;
  nameH2.textContent = character.name;
  charImg.src = character.image;

  charDetailsDiv.append(nameH2, metadataSpan);
  charLi.append(charImg, charDetailsDiv);
  characterList.append(charLi);
}

function displayCharacters(characters) {
  characterList.innerHTML = "";

  for (var character of characters) {
    displayCharacter(character);
  }
}

function displayError(error) {
  characterList.innerHTML = "";

  var errorLi = document.createElement("li");
  errorLi.classList.add("no-results");
  errorLi.innerHTML = error
    ? error
    : "Lo sentimos, no se encontraron resultados";

  characterList.append(errorLi);
}
