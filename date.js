// module.exports="Hello World"; // currently our "date" module exports a string that says Hello World!
// module.exports.getDate = getDate; //When and when not to add the () with java script objects.

// // console.log(module);
// module.exports="Hello!";
// console.log(module.exports);
// console.log(module);


// // function getDate() {    //because getDate was getting all over the place.
// var getDate=function(){

//Also module.exports could be replace with "exports" simply
//it would mean the same thing

module.exports.getDate= function(){
    
    let today = new Date();                               //object declaration
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",

    }

    return today.toLocaleDateString("en-US", options)
    //instead of 
    // let day = today.toLocaleDateString("en-US", options) //toLocaleString is a method
    // return day;
}

module.exports.getDay = function getDay(){

    let today = new Date();                               //object declaration
    let options = {
        weekday: "long",
    }

    return today.toLocaleDateString("en-US", options) //toLocaleString is a method
    


    
}



