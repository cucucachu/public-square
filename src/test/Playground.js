require("@babel/polyfill");


let object1 = {a: 1, b: 2};
let object2 = {c: 3, d: 4};

Object.assign(object1, object2);

console.log(JSON.stringify(object1));