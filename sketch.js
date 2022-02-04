let spirits = []; // array of Jitter objects
let mic; //microphone 
let amplitude; //volume 
let level; //level of volume 


let d; //distance to Middle
let song; //Spirited Away audio 
let button; //Music button 
let xTarget = 0;
let yTarget = 0;


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // loading audio 
  song = loadSound("evil.mp3", loaded); 
  button = createButton("play");
  button.mousePressed(togglePlaying);
  background(51);
  
  // Creating 50 jitter objects
  for (let i = 0; i < 50; i++) {
    spirits[i] = new Jitter();
  
  //Setting up Mic input
  mic = new p5.AudioIn(); //create audio object
  mic.start(); //turns on audio input
  amplitude = new p5.Amplitude(); 
  amplitude.setInput(mic); 
    
  }
}

function draw() {
  background(38, 29, 5);
  
  for (let i = 0; i < spirits.length; i++) {
    spirits[i].run(); 
  }    
}


//Imported audio 
function loaded() {
console.log("loaded");
}

// Button to trigger when music plays
function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    button.html("pause");
  } else {
    song.pause();
    button.html("play");
  }
}


// Jitter class
class Jitter {
  constructor() {
    this.x = random(width); // x location
    this.y = random(height); // y location 
    this.diameter = random(10, 30); // diameter 
    this.rotationAngle = random(360); 
    this.xSpeed = random(-2, 2); // x Speed/direction 
    this.ySpeed = random(-2, 2); // y Speed/direction
    // this.colour = color(255, random(100, 200), 255); //colour
    this.colour = color(0,0,0); //colour
    this.sensitive = 200; // repel radius
  }

  
  jitter() { 
    // Makes the bugs jitter around 
    this.x += random (-this.xSpeed,this.xSpeed); 
    this.y += random (-this.ySpeed,this.ySpeed); 
  }
  
  
  move() { 
    //Adds value to x and y coordinates so they move
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }  
  
  
  
  boundary () {
    //Creates a boundary so the bugs stay in the canvas
    if (this.x > (width - this.diameter/2)  ||  (this.x < this.diameter/2)){
      this.xSpeed *= -1; 
    }


    if (this.y > (height - this.diameter/2) || (this.y < this.diameter/2)){
      this.ySpeed *= -1;
    } 
  }
  
  
  scared () {
    //when the song is louder than 0.5 the bugs get frightened and move to the outer edges of the canvas
    let level = amplitude.getLevel();
    let d = dist(width/2, height/2, this.x, this.y);
    if (d <= this.sensitive && level > 0.5) {
      this.xSpeed *= -1;
      this.ySpeed *= -1;

    }
    if (d <= this.sensitive - this.diameter/4) {
      this.x = random(width);
      this.y = random(height);
    }
  }

  
  freeze () {
    // when people are speaking too loud they will scare the bugs so they freeze 
    let level = amplitude.getLevel();
     
    if (level > 0.5) {
      this.x -= this.xSpeed;
      this.y -= this.ySpeed;
    }
  }

  
  
  display() { 
    //bodies 
    fill(this.colour); 
    noSmooth()
    curveTightness(-5);
    ellipse(this.x, this.y, this.diameter, this.diameter);
    
    //eyes 
    fill(255, 255, 255)
    ellipse(this.x - this.diameter/5, this.y, this.diameter/4, this.diameter/4);
    ellipse(this.x + this.diameter/5, this.y, this.diameter/4, this.diameter/4);
    
    //eye balls
    fill(0);
    ellipse(this.x - this.diameter/5, this.y, this.diameter/15, this.diameter/10);
    ellipse(this.x + this.diameter/5, this.y, this.diameter/15, this.diameter/10);
  } 
  
  
  
  
  // Function containing all methods 
  run() {
    this.move();
    this.display();
    this.jitter();
    this.scared();
    this.boundary();
    this.freeze();
  }
}


