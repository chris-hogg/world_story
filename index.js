// TODO: Add to Github.
// FILE ONE: The questions and and answers (i.e planning the words)
var scenesObjectArray = [];
var questionsArray= ["Once upon a time...", "Every Day...", "Until One Day...", "Because of that...", "Because of that...", "Because of that...", "until one day...", "and ever since then..."]
//TODO: Remove this and add the prompt.
var a1Test = ["Vienna was the capital of Austria", "Salzburg wanted to be the capital", "It broke away", "Vienna was angry", "Vienna bribed people to come", "people came", "salzburg rejoined", "vienna is the capital of austria"];
// TODO: make this into another internal object.
function Scene(number){
    this.number = number;
    this.question = questionsArray[number-1];
    this.a1 = "DEFAULT A1";
    this.a2= "DEFAULT A2";
    this.animation_function= "Default function";
    this.animation_parameter = "default parameter";
};

function createHeader(array){
    var header = " "
    for (var i = 0; i < array.length; i++) {
        header = header + array[i] + "," +"picture"+","
    }
    return header + "\n"
}


function generateScenes(){
    for (var i = 0; i < questionsArray.length; i++) {
    var scene = new Scene(i+1);
    // scene.a1= prompt(questionsArray[i], "What happened?");
    scene.a1= a1Test[i];
    scenesObjectArray.push(scene);
};
};

function createStory(){
        var storyString = " ";
    for (var i = 0; i<questionsArray.length;i++){
        var scene = scenesObjectArray[i];
        var storyLine = scene.question + " "+ scene.a1
        storyString = storyString + "\n" + storyLine;
    };
};

function askMapDescription(){
    for (var i = 0; i<questionsArray.length;i++){
        var scene = scenesObjectArray[i];
        // scene.a2 = prompt(scene.question + " " + scene.a1 + "  ||  ", "Enter a short map description here ")
    }
};

function getValues(objectArray,key){
    var allAnswers = [];
    for (var i = 0; i < objectArray.length; i++) {
        allAnswers.push(objectArray[i][key]);
    }
    return allAnswers.join() + "\n"
}

function getStory() {
    generateScenes();
    createStory();
    askMapDescription();
};

// FILE TWO: The map

var width = 960,
    height = 400,
    active = d3.select(null);
// TODO: Programmatically edit the projection.
var projection = d3.geo.mercator().center([14.5501, 47.5162]).scale(5000);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var g = svg.append("g")
    .style("stroke-width", "1.5px");

var countiesVar;

// TODO: Encode this better.
var places = [
  {
    name: "Vienna",
    location: {
      latitude: 48.210033,
      longitude: 16.363449
    }
  },
  {
    name: "Salzburg",
    location: {
      latitude: 47.811195,
      longitude: 13.033229
    }
  }
]


d3.json("world.topojson", function(error, locationFile) {
  if (error) throw error;
  g.selectAll("path")
      .data(topojson.feature(locationFile, locationFile.objects.iso_a3).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "feature")
      .attr("id",  function(d,i) {return d.properties.adm0_a3}) // TODO: Get this so it links in.
      .on("click", zoomInPlace);

  g.append("path")
      .datum(topojson.mesh(locationFile, locationFile.objects.iso_a3, function(a, b) { return a !== b; }))
      .attr("class", "mesh")
      .attr("d", path);

      g.selectAll(".pin")
       .data(places)
       .enter().append("circle", ".pin")
       .attr("id", function(d){return "city-"+ d.name})
       .attr("class","city")
       .attr("transform", function(d) {
         return "translate(" + projection([
           d.location.longitude,
           d.location.latitude
         ]) + ")";
       });
       g.selectAll(".text")
        .data(places)
        .enter().append("text", ".text")
        .attr("class","label")
        .attr("transform", function(d) {
          return "translate(" + projection([
            d.location.longitude,
            d.location.latitude
          ]) + ")";
        })
        .text(function(d){return d.name});

        g.append("text")
        .attr("class", "dollar")
        .attr("transform", function(d) {
          return "translate(600.2445526887334,159.74921180128968)";
        })
        .attr("id","symbol-dollar")
        .text("$$$");

 countiesVar = topojson.feature(locationFile, locationFile.objects.iso_a3)
});


function reset() {
  active.classed("active", false);
  active = d3.select(null);

  g.transition()
      .duration(750)
      .style("stroke-width", "1.5px")
      .attr("transform", "");
}

// FILE THREE: The Storyboard.

function changeNarration(text, answerText){
    var narrationBox = document.getElementById('narration-box');
    narrationBox.innerHTML = text;
    var narrationAnswerBox = document.getElementById('narration-box-answers');
    narrationAnswerBox.innerHTML = answerText;
}

// TODO Resets to start by clicking on the place which is last zoomed in. there is a better way to solve this.

function resetToStart(place,sceneNumber){
    zoomInPlace(place);
    if(questionsArray[sceneNumber-1] == null){
        changeNarration("Press Play to Start","Answer Dude")
    }
    else{
        changeNarration(questionsArray[sceneNumber-1],scenesObjectArray[sceneNumber-1].a1);
    }
};

// TODO: how to get this by  name?
var countyTransitionOrder = [4,8,1,0,4,2,1,2];
function createPlace(number){
    return countiesVar.features[number]
};

function createTimings(scene, place, timeFromStart){
    return setTimeout(function(){resetToStart(createPlace(place),scene)},timeFromStart);
}

function autoPlay (delayMs){
    for (var i = 0; i < countyTransitionOrder.length+1; i++) {
    if(i=== countyTransitionOrder.length){
        return createTimings(i+1,countyTransitionOrder[i-1],i*delayMs)
    }
    else{
    createTimings(i+1,countyTransitionOrder[i],i*delayMs)
}
};
}
function playAnimation(){
autoPlay(2000);
}

// TODO: Combinig many animationfunctions in one scene.


// TODO: What to do if there is multiple animations in the same scene? Array of arrays?
var sceneFunctionsArray = [changeCapital,changeCapital,scenceFunctionToggle, scenceFunctionToggle, scenceFunctionToggle,scenceFunctionToggle,scenceFunctionToggle,scenceFunctionToggle,];
var sceneFunctionsArrayStrings = ["Vienna", "Salzburg", "Salzburg", "city-Vienna", "symbol-dollar", "Salzburg", "Wien", "Salzburg"]

function addAnimationToSceneObject (sceneNumber) {
    var scene = scenesObjectArray[sceneNumber-1];
    scene.animation_function = sceneFunctionsArray[sceneNumber-1];
    scene.animation_parameter = sceneFunctionsArrayStrings[sceneNumber-1];
};

function CreateSceneButton(number){
    addAnimationToSceneObject(number);
    var sceneObject = scenesObjectArray[number-1];
    // var sceneObjectAnimation = function(){ return sceneObject.animation_function(sceneObject.animation_parameter);}
    var newButton= $('<button> Scene '+ number + '</button>').addClass("button-scene").attr("id","button-scene-" + number);
    $("#buttons-div").append(newButton);
    // TODO: to run automatically bascially involves the line below being set on a delay.
    $("#button-scene-" + number).click(function(){changeNarration(questionsArray[number-1],sceneObject.a1); sceneObject.animation_function(sceneObject.animation_parameter);});
};


function createAllButtons(){
    console.log(scenesObjectArray);
    for (var i = 0; i < scenesObjectArray.length; i++) {
    sceneNumber = i+1;
    CreateSceneButton(sceneNumber);
}};

// Scene Function Buttons- ths are the animations/ transitions.
// TODO: Rename the functions which will cause animation.

function scenceFunctionToggle(id){
    $("#" +id).toggle()
};
// TODO:  Need to change it as has two parameters.
function sceneFunctionAddClass(id){
    $("#Wien").removeClass('active').addClass(id)
}

function zoomInPlace(d) {
    var linePath = document.getElementById(d.properties.adm0_a3);
  if (active.node() === linePath) return reset();
  active.classed("active", false);
 active = d3.select(linePath).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];
  g.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}

function changeCapital(city){
    var cityElms = document.getElementsByClassName('city');
    for (var i = 0; i < cityElms.length; i++) {
        cityElms[i].classList.remove('city-capital');
    }
    document.getElementById("city-"+ city).classList.add('city-capital');
};


//THESE BUTTONS WORK!
$('#button-story').click(function(){getStory()});
$("#button-scene-one").click(function(){changeCapital("Vienna");changeNarration(questionsArray[0],scenesObjectArray[0].a1)});
$("#button-scene-two").click(function(){changeCapital("Salzburg");changeNarration(questionsArray[1],scenesObjectArray[1].a1)});
$("#button-scene-three").click(function(){$("#Salzburg").toggle();changeNarration(questionsArray[2],scenesObjectArray[2].a1)});
$("#button-scene-four").click(function(){zoomInPlace(createPlace(8));changeNarration(questionsArray[3],scenesObjectArray[3].a1)});
$("#button-scene-five").click(function(){$("#symbol-dollar").toggle();changeNarration(questionsArray[4],scenesObjectArray[4].a1)});
$("#button-scene-six").click(function(){$("#Wien").removeClass('active').addClass('high-pop');changeNarration(questionsArray[5],scenesObjectArray[5].a1)});
$("#button-scene-seven").click(function(){zoomInPlace(createPlace(4));$("#Salzburg").toggle();changeNarration(questionsArray[6],scenesObjectArray[6].a1)});
$("#button-scene-eight").click(function(){changeNarration(questionsArray[7],scenesObjectArray[7].a1);zoomInPlace(createPlace(4));changeCapital("Vienna");});
