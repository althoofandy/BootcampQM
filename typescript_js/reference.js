let a = 10;
let b = a;
b = 20;

let objA = { value: 10 };
let objB = objA;
objB.value = 20;

//array push(tambah data ke bagian terakhir array) pop()(hapus data di bagian terakhir array)
//array shift(hapus data di bagian pertama array) unshift(tambah data di bagian pertama array)
let arr = [1, 2, 3];
arr.push(4);
arr.pop();
// console.log(arr);
arr.unshift(0);
arr.shift();
// console.log(arr);

//array slice (mengambil sebgian array tanpa mengubah array asli) dan splice(hapus atau tambah elemen pada posisi tertentu)
let arr1 = [1, 2, 3, 4, 5];
let arr2 = arr1.slice(1, 4);
// console.log(arr1);
// console.log(arr2);

let arr3 = [1, 2, 3, 4, 5];
arr3.splice(1, 2);
// console.log(arr3);

//shallow copy, konsepnya sama sperti reference
let arr4 = [1, 2, { name: "John" }];
let arr5 = arr4.slice();
arr5[2].name = "Jane";
// console.log(arr4);
// console.log(arr5);

//deep copy
let arr6 = JSON.parse(JSON.stringify(arr4));
arr6[2].name = "Fand";

console.log(arr4);
console.log(arr6);
