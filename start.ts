import './global.scss';
import * as PIXI from 'pixi.js';
import Person from './src/utils/Person';

const peopleTrackBar = document.getElementById('people-range') as HTMLInputElement;
const peopleLabel = document.getElementById('people-label') as HTMLElement;
const confinementTrackBar = document.getElementById('confinement-range') as HTMLInputElement;
const confinementLabel = document.getElementById('confinement-label') as HTMLElement;

const app = new PIXI.Application({
  width: 800,
  height: 400,
  backgroundColor: 0x000000,
  antialias: true,
  resolution: 1,
});

app.view.style.marginTop = '2rem';
app.view.style.borderRadius = '3px';

document.body.appendChild(app.view);


// ------------------------------------------------------------------------------- SIMULATION

const graphics = new PIXI.Graphics();


let pointArray = new Array();
const widthFrame = app.renderer.width;
const heightFrame = app.renderer.height;
function createPeople(numberOfPeople:number) {
  pointArray = new Array();
  for (let i = 0; i < numberOfPeople; i++) {
    pointArray.push(new Person(graphics, 'normal', Math.random() * widthFrame, Math.random() * heightFrame, widthFrame, heightFrame));
  }
}

app.stage.addChild(graphics);
createPeople(10);

app.ticker.add((delta) => {
  graphics.clear();
  pointArray.forEach((element) => {
    element.update(delta);
    element.draw();
  });

});

// ------------------------------------------------------------------------------- EVENTs

peopleTrackBar.addEventListener('input', (event) => {
  peopleLabel.innerText = `(${peopleTrackBar.value}/600) People`;
});

peopleTrackBar.addEventListener('change', (event) => {
  graphics.clear();
  createPeople(parseInt(peopleTrackBar.value));
});

confinementTrackBar.addEventListener('input', (event) => {
  confinementLabel.innerText = `(${confinementTrackBar.value}%) confinement`;
});

confinementTrackBar.addEventListener('change', (event) => {
});
