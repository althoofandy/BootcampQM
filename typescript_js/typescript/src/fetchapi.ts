async function getPokemon() {
  try {
    const fetchDitto = await fetch("https://pokeapi.co/api/v2/pokemon/ditto/");
    const responseDitto = await fetchDitto.json();
    console.log("Cek data Ditto : ", responseDitto);

    const fetchPikachu = await fetch(
      "https://pokeapi.co/api/v2/pokemon/pikachu/"
    );
    const responsePikachu = await fetchPikachu.json();
    console.log("Cek data Pikachu : ", responsePikachu);
  } catch (error) {
    console.log("cek error gan: ", error);
  }
}

getPokemon();

// fetch("https://pokeapi.co/api/v2/pokemon/ditto/", {
//   method: "GET",
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error("error nih gan :" + error));
