// import { name, stringModule } from "./module";

//apply module
// console.log(name);
// console.log(stringModule().generateRandomCharacters(10));

//destructuring: memilah data yang ada dan langsung menjadikan variabel
const persons = {
  name: "John",
  age: 30,
  height: 170,
  weight: 70,
  gender: "male",
  country: "Indonesia",
};

const fruits = ["apple", "banana", "orange"];

let { name: personName, height, weight, gender, country } = persons;
let [apple, orange] = fruits;
console.log(personName, height, weight, gender, country);
console.log(apple, orange);
