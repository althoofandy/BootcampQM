"use strict";
class Car {
    constructor(property, model, year) {
        this.property = property;
        this.model = model;
        this.year = year;
    }
    displayInfo() {
        var _a, _b, _c;
        console.log(`Property: ${(_a = this.property) !== null && _a !== void 0 ? _a : "Empty Property"}, Model: ${(_b = this.model) !== null && _b !== void 0 ? _b : "Empty Model"}, Year: ${(_c = this.year) !== null && _c !== void 0 ? _c : "Empty Years"}`);
    }
}
let myCar = new Car("Toyota", "Avanza");
myCar.displayInfo();
