"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getPokemon() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fetchDitto = yield fetch("https://pokeapi.co/api/v2/pokemon/ditto/");
            const responseDitto = yield fetchDitto.json();
            console.log("Cek data Ditto : ", responseDitto);
            const fetchPikachu = yield fetch("https://pokeapi.co/api/v2/pokemon/pikachu/");
            const responsePikachu = yield fetchPikachu.json();
            console.log("Cek data Pikachu : ", responsePikachu);
        }
        catch (error) {
            console.log("cek error gan: ", error);
        }
    });
}
getPokemon();
// fetch("https://pokeapi.co/api/v2/pokemon/ditto/", {
//   method: "GET",
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error("error nih gan :" + error));
