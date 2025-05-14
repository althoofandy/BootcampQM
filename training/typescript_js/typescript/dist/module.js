"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = void 0;
exports.subtract = subtract;
exports.default = stringModule;
exports.name = "Althoofandy";
function subtract(a, b) {
    return a + b;
}
function stringModule() {
    return {
        generateRandomCharacters: (length) => {
            return Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join("");
        },
        generateRandomNumber: (num) => {
            return Math.floor(Math.random() * num);
        },
    };
}
// export default name;
