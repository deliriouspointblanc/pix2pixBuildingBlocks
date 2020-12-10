/*
  ML5.js basic pix2pix human example,
  based on ml5.js example code, adapted by Joe McAlister
  
  Model from: https://github.com/dongphilyoo/pix2pix-ml5-demo
  
  File loader from p5.js reference: https://p5js.org/reference/#/p5/createFileInput
  
  Three notes for improvement:
  
  1. I don't know how to call a callback of a callback. For example, line 22 callback to handleFile and then in line 73, put the code from drawImage() inside the if statement detecting the loaded image.
  
  2. I could not get the saveBtn to work because programme did not recognise the right-hand side of resultImg in line 142 as being an object. I will try doing this with just html/plain js because it is possible to save the image manually.
  
  3. I could not figure out how to drag the output/resultImg yet still have the output div there so I can dynamically transfer images. Instead, I made a separate drag-and-drop project that uses images generated from this code.
  
*/

const SIZE = 256;
let inputImg,
  inputCanvas,
  outputContainer,
  statusMsg,
  transferBtn,
  clearBtn,
  saveBtn,
  resultImg;

let slider;

let input;
let img;

function setup() {
  //Choose image from file folder
  input = createFileInput(handleFile);
  input.position(10, 35);

  // Create a canvas
  inputCanvas = createCanvas(SIZE, SIZE);
  inputCanvas.class("border-box").parent("canvasContainer");

  //inputImg = loadImage("images/albers_1.jpg", drawImage);

  // Select output div container - this is where the result appears on the DOM
  outputContainer = select("#output");

  // used to reflect when our model has loaded
  statusMsg = select("#status");

  // Select 'transfer' button html element
  transferBtn = select("#transferBtn");

  // Select 'clear' button html element
  clearBtn = select("#clearBtn");
  // Attach a mousePressed event to the 'clear' button
  clearBtn.mousePressed(function () {
    // when someone presses the clear button added via the html file we trigger clear canvas
    clearCanvas();
  });

  //Select 'saveBtn' html element
  saveBtn = select("#saveBtn");
  //mousePressed event to save image to folder
  saveBtn.mousePressed(function () {
    save(resultImg);
  });

  // Set stroke to black
  stroke(0);
  pixelDensity(1);

  ml5.pix2pix("models/facades_BtoA.pict").ready.then((model) => {
    // Show 'Model Loaded!' message
    statusMsg.html("Model Loaded!");

    // Call transfer function after the model is loaded
    //transfer(model);

    // Attach a mousePressed event to the button
    transferBtn.mousePressed(function () {
      transfer(model);
    });
  });

  // set background to red
  background(255, 0, 0);
}

// Draw on the canvas when mouse is pressed
function draw() {
  //background(0);
  // really simple line drawing
  if (mouseIsPressed) {
    strokeWeight(2);
    stroke(0);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }

  if (inputImg) {
    image(inputImg, 0, 0, SIZE, SIZE);
  }
}

function handleFile(file) {
  print(file);

  if (file.type === "image") {
    inputImg = createImg(file.data, "");
    inputImg.hide();
  } else {
    img = null;
  }
}

// Draw the input image to the canvas
function drawImage() {
  image(inputImg, 0, 0, SIZE, SIZE);

  // // After input image is loaded, initialise a pix2pix method with a pre-trained model // models/edges2cats_AtoB.pict //facades_BtoA
  // ml5.pix2pix("models/facades_BtoA.pict").ready.then((model) => {
  //   // Show 'Model Loaded!' message
  //   statusMsg.html("Model Loaded!");
  //
  //   // Call transfer function after the model is loaded
  //   //transfer(model);
  //
  //   // Attach a mousePressed event to the button
  //   transferBtn.mousePressed(function () {
  //     transfer(model);
  //   });
  // });
}

// Clear the canvas
function clearCanvas() {
  background(255);
}

function transfer(pix2pix) {
  // Update status message
  statusMsg.html("Applying Style Transfer...!");

  // pix2pix requires a canvas DOM element, we can get p5.js canvas and pass this
  // Select canvas DOM element
  const canvasElement = select("canvas").elt;

  // Apply pix2pix transformation
  pix2pix.transfer(canvasElement).then((result) => {
    // Clear output container
    //outputContainer.html("");
    // Create an image based result

    // v1 - all in output
    //resultImg = createImg(result.src).class("border-box").parent("output");

    // v2 - all in separate divs
    let the_id = "output_" + random(10000);
    createDiv("").class("draggable").id(the_id);
    resultImg = createImg(result.src).class("border-box").parent(the_id);

    // Show 'Done!' message
    statusMsg.html("Done!");
  });
}
