class Car {
  property?: string;
  model?: string;
  year?: number;
  constructor(property?: string, model?: string, year?: number) {
    this.property = property;
    this.model = model;
    this.year = year;
  }

  displayInfo() {
    console.log(
      `Property: ${this.property ?? "Empty Property"}, Model: ${
        this.model ?? "Empty Model"
      }, Year: ${this.year ?? "Empty Years"}`
    );
  }
}

let myCar = new Car("Toyota", "Avanza");
myCar.displayInfo();
