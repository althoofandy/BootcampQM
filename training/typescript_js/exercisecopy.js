let students = [
  { name: "Alice", score: 85 },
  { name: "Bob", score: 90 },
  { name: "Charlie", score: 78 },
];

//shallow copy
let studentsShallowCopy = [...students];
console.log(studentsShallowCopy);

//deepcopy
let studentsDeepCopy = JSON.parse(JSON.stringify(students));
studentsDeepCopy[0].score = 100;
studentsDeepCopy[1].score = 75;
console.log(students);
console.log(studentsDeepCopy);
