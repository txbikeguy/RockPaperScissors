//_________________________________database stuff_______________________________
var config = {
    apiKey: "AIzaSyD2vtEDdW7ALhJSEDmH7b-LbkGRBSH6bUU",
    authDomain: "first-project-4bfd6.firebaseapp.com",
    databaseURL: "https://first-project-4bfd6.firebaseio.com",
    projectId: "first-project-4bfd6",
    storageBucket: "first-project-4bfd6.appspot.com",
    messagingSenderId: "1061865414511"
        };

// Assign the reference to the database to a variable named 'database'
//var database = ...
firebase.initializeApp(config);
var database = firebase.database();

//_________________________________submitBtn stuff_____________________________
var nameInput;
var destInput;
var timeInput;
var freqInput;

var inputList =[];

var nextArrival;
var minutesAway;
var minutes;

//retrieve unique ids and child values, then create train using that data
database.ref().on("child_added", function(childSnapshot) {
    createTrain(childSnapshot.val().name, childSnapshot.val().destination, childSnapshot.val().startTime, childSnapshot.val().frequency, inputList);
    console.log(minutesAway);
});

$("#submitBtn").on("click", function() {
    nameInput = $("#name-input").val().trim();
    destInput = $("#dest-input").val().trim();
    timeInput = $("#time-input").val().trim();
    freqInput = $("#freq-input").val().trim();
    
    createTrain(nameInput, destInput, timeInput, freqInput, inputList);

    database.ref().push({
        name: nameInput,
        destination: destInput,
        startTime: timeInput,
        frequency: freqInput
    });

    $("#name-input").val("");
    $("#dest-input").val("");
    $("#time-input").val("");
    $("#freq-input").val("");

    return false;
});

function createTrain(name, destination, startTime, frequency, inputs) {
    //create row of info
    inputs = [];
    inputs.push(name, destination,  frequency, nextArrival, minutes);
    var tRow = document.createElement("TR");
    for (i=0;i<inputs.length;i++) {
        var tItem = document.createElement("TD");
        tItem.append(inputs[i]);
        tRow.append(tItem);
    }

    var tBody = document.getElementById("tableBody");
    tBody.append(tRow);

database.ref().on("child_added", function(childSnapshot, prevChildKey){

        console.log(childSnapshot.val());


        // assign firebase variables to snapshots.
        var firebaseName = childSnapshot.val().name;
        var firebaseDestination = childSnapshot.val().destination;
        var firebaseTrainTime = childSnapshot.val().startTime;
        var firebaseFrequency = childSnapshot.val().frequency;

        var trainTimeConverted = moment(firebaseTrainTime, 'hh:mm').subtract(1, 'years');
        
        var diffTime = moment().diff(moment(trainTimeConverted), "minutes");

        var minutesAway = diffTime % firebaseFrequency;

        var minutes = firebaseFrequency - minutesAway;

        var nextArrival = moment().add(minutes, 'minutes').format("hh:mm"); 
    });
};

var currentTime = moment().format("HH:mm - dddd MMM. Do, YYYY");
console.log(currentTime);



