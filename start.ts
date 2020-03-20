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

document.body.appendChild(app.view);


// ------------------------------------------------------------------------------- SIMULATION

let peopleArray: Array<Person> = new Array();
const widthFrame = app.renderer.width;
const heightFrame = app.renderer.height;

function createPeople(numberOfPeople:number) {
  peopleArray = new Array();
  for (let i = 0; i < numberOfPeople; i++) {
    peopleArray.push(new Person(app, 'normal', Math.random() * widthFrame, Math.random() * heightFrame));
  }

  // random infected
  let randomSelected = Math.floor(Math.random()*(peopleArray.length-1));
  peopleArray[randomSelected].changeInfectionState('infected');
  peopleArray[randomSelected].setName('First');
}


createPeople(parseInt(peopleTrackBar.value));

app.ticker.add((delta) => {
  peopleArray.forEach((particle, index1) => {
    particle.clear();
    particle.update(delta);



    particle.draw();


    peopleArray.forEach((particleToTest, index2) => {
      if(index1 !== index2) {
        if(particle.isInCollisionWith(particleToTest) && index1 !== index2) {
          if((particle.isInfected() || particleToTest.isInfected()) && !particleToTest.isImmunised() && !particle.isImmunised()) {
            particle.changeInfectionState('infected');
            particleToTest.changeInfectionState('infected');
          }
        }
      }
    });
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

// ------------------------------------------------------------------------------- GRAPHICS TIME

const graphicInfectionApp = new PIXI.Application({
  width: 800,
  height: 100,
  backgroundColor: 0x111111,
  antialias: true,
  resolution: 1,
});

document.body.appendChild(graphicInfectionApp.view);

const charGraphic = new PIXI.Graphics();

graphicInfectionApp.stage.addChild(charGraphic);

graphicInfectionApp.stage.position.y = graphicInfectionApp.renderer.height / graphicInfectionApp.renderer.resolution
graphicInfectionApp.stage.scale.y = -1;

let initial = 0.001;
let lastPointX = 0;
let lastPointY = 0;
const timer = setInterval(() => {
  const numberOfInfected = peopleArray.filter((element) => (element.isInfected()));

  lastPointX = graphicInfectionApp.renderer.width * initial;

  const pixelPerInfected = peopleArray.length / graphicInfectionApp.renderer.height;
  const infectedPeople = peopleArray.filter((element) => (element.isInfected()));

  charGraphic.lineStyle(1, 0xFF0606)
  .moveTo(lastPointX, lastPointY)
  .lineTo(lastPointX, infectedPeople.length * pixelPerInfected);
  initial += 0.001;
}, 50);
