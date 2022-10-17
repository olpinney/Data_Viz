/*
This is a javascript example for week 2. 
*/

let num =100; // int
function foo() {
    let num2=100;   
};

//console.log(num2) // will get error

foo(); // call the funciton 

//short cut for an anonymous function is an arrow function like:
// let anonFun = function() {
//     console.log("hello")
// }


let anonFun2 = () => console.log("hello");

// inside the () go any parameters that are needed. 
// the functions are equivalent but one is using 
// it is helpful because you dont have to name it and it can be immediately run

let person = "Summer";
function(peopleName) {
    console.log("Hello"+peopleName)
}

let arr = ["foo",123,["zar","bar"]]


for (let item of arr){
}

for (let i in arr){
console.log(i + "" + arr[i]);

}

arr.forEach((item,i)=> console.log(i+" "+item))

//object
let obj1 = {
    name: "jill",
    age: 85,
    job: "Catus Hunter",
};
//sometimes people but kys in quotes

//different ways to reference
console.log(obj1.name)
console.log(obj1["name"])

obj1.job="Barista"

//can itterate through the dict keys and items
//printing can be done with + or `

console.log(`hello ${obj1.name}`)

//for (let i=0, i<10, i++)
// if () {} else if () {} else () {}

//terary opperator is an inline else if
let y = (x>50) ? "above" : "below" ; 
//true and false