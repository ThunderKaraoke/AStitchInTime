
// A Stitch In Time
// Code By: Alex Spencer
// This is My First Javascript Project!
// http://www.ThunderKaraoke.com

// Inspired By: Hitomezashi Stitch Patterns - Numberphile
// https://www.youtube.com/watch?v=JbfhzlMk2eY

// VARIABLES TO ALTER
let grid = 10; // cell dimensions of table
let frm = 300; // framerate
let height = 720; // pixel dimensions of canvas
let bg = 'red'; // color background
let fg = 'yellow'; // color of lines
let sg = 'blue'; // color of area fills / squares
let rad = 0; // radius of square corners

let width = height; // * (16 / 9);
let spc = height / grid; // Math.max(height, width) / grid;
let strk = spc / 7;
let col = 0;
let row = 0;
let colA = 0;
let rowA = 0;
let colB = 0;
let rowB = 0;
let i = 0;
let j = 0;
let sh = 0;
const table = [];
const randos = [];

class cell {
  constructor(col,row) {
    this.x = col * spc;
    this.y = row * spc;
    this.bot = true;
    this.right = true;
    this.fill = false;
    this.col = col;
    this.row = row;
    this.circ = false;
    this.line = [false,false,false,false];
  }
}

function setup() {
  createCanvas(width, height); //, WEBGL);
  background(bg);
  stroke(fg);
  strokeWeight(strk);
  frameRate(frm);
  fill(sg);

  gridpoints();
  sorandom();
  stitches();
  fillshape();
  j = 0;
}

function gridpoints() {
  for (col = 0; col < grid + 1; col++) {
    for (row = 0; row < grid + 1; row++) {
      let thiscell = new cell(col,row);
      table.push(thiscell);
    }
  }
}

function sorandom() {
  let j = 0;
  for (j = 0; j < 2 * grid; j++) {
    if (random(1) < 0.5) {
      randos[j] = 0;
    } else {
      randos[j] = 1;
    }
  }
}

function stitches() {
  let col = 0;
  let row = 0;
  let quiz = 0;
  for (col = 0; col < grid; col++) {
    for (row = 0; row < (grid / 2); row++) { 
      quiz = (col * (grid + 1)) + (row * 2) + randos[col]; // columns
      table[quiz].right = false;

      quiz = col + ((row * 2) + randos[col + grid]) * (grid + 1); // rows
      table[quiz].bot = false;
    }
  }
  for (col = 0; col < grid + 1; col++) {
    quiz = (grid + 1) * grid + col; // last column copied from first
    table[quiz].right = table[col].right;
    table[quiz].bot = table[quiz - 2 * (grid + 1)].bot;

    quiz = (grid + 1) * col + grid; // last row copied from first
    table[quiz].right = table[quiz - 2].right;
    table[quiz].bot = table[col * (grid + 1)].bot;
  }
}

function fillshape() {
  table[0].fill = true;
  for (col = 0; col < grid + 1; col++) {
    for (row = 0; row < grid + 1; row++) {
      picksquares();
    }
  }
}

function picksquares() {
  let quiz = col * (grid + 1) + row;
  let curr = table[quiz];
  let left = table[quiz - (grid + 1)];
  let up   = table[quiz - 1];
  let sw   = 0;
  if (row == 0 && col > 0) {
    if (left.right) {
      sw = 1;
    }
    if (left.fill) {
      sw = sw + 1;
    }
  }
  if (row > 0) {
    if (up.bot) {
      sw = 1;
    }
    if (up.fill) {
      sw = sw + 1
    }
  }
  if (sw == 1) {
    curr.fill = true;
  } else {
    curr.fill = false;
  }
  if (col > 0 && row > 0 && col < grid && row < grid) {
    if (curr.fill && curr.right && curr.bot && left.right && up.bot) {
      curr.circ = true;
    }
  }
  //if (!curr.fill) {
    if (row > 0 && !up.bot) {
      curr.line[0] = true;
      } else {
      curr.line[0] = false;
    }
    if (col < grid + 1 && !curr.right) {
      curr.line[1] = true;
      } else {
      curr.line[1] = false;
    }
    if (row < grid + 1 && !curr.bot) {
      curr.line[2] = true;
      } else {
      curr.line[2] = false;
    }
    if (col > 0 && !left.right) {
      curr.line[3] = true;
      } else {
      curr.line[3] = false;
    }
  //}
}

function shiftleft() {
  for (j = 0; j < table.length - (grid + 1); j++) {
    table[j].bot    = table[j + (grid + 1)].bot;
    table[j].right  = table[j + (grid + 1)].right;
    table[j].fill   = table[j + (grid + 1)].fill;
    table[j].circ   = table[j + (grid + 1)].circ;
    table[j].line[0] = table[j + (grid + 1)].line[0];
    table[j].line[1] = table[j + (grid + 1)].line[1];
    table[j].line[2] = table[j + (grid + 1)].line[2];
    table[j].line[3] = table[j + (grid + 1)].line[3];
  }
  for (j = 0; j < grid + 1; j++) {
    let k = table.length - (grid + 1) + j;
    table[k].bot    = table[k - 2 * (grid + 1)].bot;
    table[k].right  = table[j].right;
  }
  for (col = grid - 1; col < grid + 1; col++) {
    for (row = 0; row < grid + 1; row++) {
      picksquares();
    }
  }
}

function shiftup() {
  for (col = 0; col < grid + 1; col++) { // move cell settings up
    for (row = 0; row < grid; row++) {
      let quiz = col * (grid + 1) + row;
      table[quiz].bot    = table[quiz + 1].bot;
      table[quiz].right  = table[quiz + 1].right;
      table[quiz].fill   = table[quiz + 1].fill;
      table[quiz].circ   = table[quiz + 1].circ;
      table[quiz].line[0]   = table[quiz + 1].line[0];
      table[quiz].line[1]   = table[quiz + 1].line[1];
      table[quiz].line[2]   = table[quiz + 1].line[2];
      table[quiz].line[3]   = table[quiz + 1].line[3];
    }
  }
  for (col = 0; col < grid + 1; col++) { // copy first row to last
    row = grid;
    let quiz = col * (grid + 1) + row;
    table[quiz].right = table[quiz - 2].right;
    table[quiz].bot   = table[col * (grid + 1)].bot;
  }
  for (row = grid - 1;row < grid + 1; row++) {
    for (col = 0; col < grid + 1; col++) { // fill in shapes of bottom row
      picksquares();
    }
  }
}

function shiftgrid() {
  for (i = 0; i < table.length; i++) {
    table[i].x += sh;
    table[i].y += sh;
  }
}

function draw() {
  // STEP !: DRAW LINES
  if (colA < grid) {
    let quizC = colA * (grid + 1) + rowA;
    let currC = table[quizC];
    let quizR = rowA * (grid + 1) + colA;
    let currR = table[quizR];
    if (currC.right) {
      line(currC.x + spc, currC.y, currC.x + spc, currC.y + spc);
    }
    if (currR.bot) {
      line(currR.x, currR.y + spc, currR.x + spc, currR.y + spc);
    }
    rowA += 1;
    if (rowA >= grid) {
      colA += 1;
      rowA = 0;
    }
  }
  // STEP 2: FILL IN SHAPES
  if (colA == grid && colB < grid) {
    frameRate(5);
    for (rowB = 0; rowB < grid + 1; rowB++) {
      let quizC = colB * (grid + 1) + rowB;
      let currC = table[quizC];
      if (currC.fill) {
        fill(sg);
        strokeWeight(0);
        rect(currC.x, currC.y, spc, spc);
      //} else {
      strokeWeight(.5 * strk);
      let j = .5 * spc
      if (currC.line[0]) {
        line(currC.x + j, currC.y, currC.x + j, currC.y + j);
      }
      if (currC.line[1]) {
        line(currC.x + j, currC.y + j, currC.x + spc, currC.y + j);
      }
      if (currC.line[2]) {
        line(currC.x + j, currC.y + j, currC.x + j, currC.y + spc);
      }
      if (currC.line[3]) {
        line(currC.x, currC.y + j, currC.x + j, currC.y + j);
      }
      fill(bg);
      ellipse(currC.x + j, currC.y + j, 2 * strk);
      }
      //strokeWeight(strk);
    }
    colB += 1;
  }
  // STEP 3: SHIFT LEFT & UP
  if (colB == grid) {
    frameRate(spc);
    background(bg);
    j = table[0].x;
    if (j > -spc) {
        sh = -5;
        shiftgrid();
    } else {
        sh = spc;
        shiftleft();
        shiftup();
        shiftgrid();
    }
    for (i = 0; i < table.length; i++) {
      let curr = table[i];
      strokeWeight(strk);
      stroke(fg);
      if (curr.right) {
        line(curr.x + spc, curr.y, curr.x + spc, curr.y + spc);
      }
      if (curr.bot) {
        line(curr.x, curr.y + spc, curr.x + spc, curr.y + spc);
      }
      if (curr.fill) { // && !curr.circ) {
        fill(sg);
        strokeWeight(0);
        rect(curr.x, curr.y, spc, spc);
      //} else {
        strokeWeight(.5 * strk);
        j = .5 * spc;
        if (curr.line[0]) {
          line(curr.x + j, curr.y, curr.x + j, curr.y + j);
        }
        if (curr.line[1]) {
          line(curr.x + j, curr.y + j, curr.x + spc, curr.y + j);
        }
        if (curr.line[2]) {
          line(curr.x + j, curr.y + j, curr.x + j, curr.y + spc);
        }
        if (curr.line[3]) {
          line(curr.x, curr.y + j, curr.x + j, curr.y + j);
        }
        fill(bg);
        ellipse(curr.x + j, curr.y + j, 2 * strk);
      }
      if (curr.circ) {
        //push();
        let k = spc;
        strokeWeight(.5 * strk);
        stroke(fg);
        fill(sg);
        do {
          k -= 2 * strk;
          //rect(curr.x + .5 * (spc - k), curr.y + .5 * (spc - k), k);
          ellipse(curr.x + j, curr.y + j, k);
        } while (k > .5 * strk);
        //pop();
      }
    }
  }
}

function junk() {
  let cg = bg;
  switch (cg) {
    case bg:
      cg = fg;
      //break;
    case fg:
      cg = bg;
      break;
  }
  j = 0;
  switch (j) {
    case 0:
      fill(fg);
      j = 1;
      break;
    case 1:
      fill(sg);
      j = 0;
      break;
  }
}

function shiftup1() {
  let shift = [];
  for (col = 0; col < grid; col++) {
    shift.push(table[col * grid]);
  }
  for (col = 0; col < grid; col++) {
    for (row = 0; row < grid - 1; row++) {
      let quiz = col * grid + row;
      table[quiz].bot    = table[quiz + 1].bot;
      table[quiz].right  = table[quiz + 1].right;
      table[quiz].fill   = table[quiz + 1].fill;
      table[quiz].circ   = table[quiz + 1].circ;
    }
  }
  for (col = 0; col < grid; col++) {
    let row = (col + 1) * grid - 1;
    table[row].right = table[row - 2].right;
    table[row].bot   = shift[col].bot;
  }
  row = grid - 1;
  for (col = 0; col < grid; col++) {
    picksquares();
  }
}

function shiftleft1() {
  let shift = [];
  let j = 0;
  for (j = 0; j < grid; j++) {
    shift.push(table[j]);
  }
  for (j = 0; j < table.length - grid; j++) {
    table[j].bot    = table[j + grid].bot;
    table[j].right  = table[j + grid].right;
    table[j].fill   = table[j + grid].fill;
  }
  for (j = 0; j < grid; j++) {
    let k = table.length - grid + j;
    table[k].bot    = table[k - 2 * grid].bot;
    table[k].right  = shift[j].right;
  }
  col = grid - 1;
  for (row = 0; row < grid; row++) {
    picksquares();
  }
}