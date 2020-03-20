import './global.scss';
import * as PIXI from 'pixi.js';
import Person from './src/utils/Person';

const peopleTrackBar = document.getElementById('people-range') as HTMLInputElement;
const peopleLabel = document.getElementById('people-label') as HTMLElement;
peopleLabel.innerText = `(${peopleTrackBar.value}/600) People`;
const confinementTrackBar = document.getElementById('confinement-range') as HTMLInputElement;
const confinementLabel = document.getElementById('confinement-label') as HTMLElement;
confinementLabel.innerText = `(${confinementTrackBar.value}%) confinement`;

const app = new PIXI.Application({
  width: 800,
  height: 400,
  backgroundColor: 0x000000,
  antialias: true,
  resolution: 1,
});

app.view.style.marginTop = '2rem';
app.view.style.borderRadius = '10px';

document.body.appendChild(app.view);


// ------------------------------------------------------------------------------- SIMULATION

const graphics = new PIXI.Graphics();


let peopleArray: Array<Person> = new Array();
const widthFrame = app.renderer.width;
const heightFrame = app.renderer.height;

function createPeople(numberOfPeople:number) {
  peopleArray = new Array();
  for (let i = 0; i < numberOfPeople; i++) {
    peopleArray.push(new Person(graphics, 'normal', Math.random() * widthFrame, Math.random() * heightFrame, widthFrame, heightFrame));
  }

  // random infected
  let randomSelected = Math.floor(Math.random()*(peopleArray.length-1));
  peopleArray[randomSelected].changeInfectionState('infected');
  peopleArray[randomSelected].setName('Macron');

  randomSelected = Math.floor(Math.random()*(peopleArray.length-1));
  peopleArray[randomSelected].setName('Castaner 👺');

  randomSelected = Math.floor(Math.random()*(peopleArray.length-1));
  peopleArray[randomSelected].setName('Schiappa 👿');
}

app.stage.addChild(graphics);
createPeople(parseInt(peopleTrackBar.value));

function hitTestRectangle(child1: any, child2: any) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  child1.centerX = child1.x + child1.width / 2;
  child1.centerY = child1.y + child1.height / 2;
  child2.centerX = child2.x + child2.width / 2;
  child2.centerY = child2.y + child2.height / 2;

  //Find the half-widths and half-heights of each sprite
  child1.halfWidth = child1.width / 2;
  child1.halfHeight = child1.height / 2;
  child2.halfWidth = child2.width / 2;
  child2.halfHeight = child2.height / 2;

  //Calculate the distance vector between the sprites
  vx = child1.centerX - child2.centerX;
  vy = child1.centerY - child2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = child1.halfWidth + child2.halfWidth;
  combinedHalfHeights = child1.halfHeight + child2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};

app.ticker.add((delta) => {
  peopleArray.forEach((element) => {
    element.clear();
    element.update(delta);
    element.draw();
  });
});

// ------------------------------------------------------------------------------- EVENTs

peopleTrackBar.addEventListener('input', (event) => {
  peopleLabel.innerText = `(${peopleTrackBar.value}/600) People`;
});

confinementTrackBar.addEventListener('input', (event) => {
  confinementLabel.innerText = `(${confinementTrackBar.value}%) confinement`;
});

peopleTrackBar.addEventListener('change', (event) => {
  app.stop();
  peopleArray.forEach(element => {
    element.clear();
    element.destroy();
  });
  createPeople(parseInt(peopleTrackBar.value));
  peopleArray.forEach((particule) => {
    particule.setConfinementRatio(parseInt(confinementTrackBar.value));
  });
  app.start();
});

confinementTrackBar.addEventListener('change', (event) => {
  peopleArray.forEach((particule) => {
    particule.setConfinementRatio(parseInt(confinementTrackBar.value));
  });
});
