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
    peopleArray.push(new Person(app, 'normal', Math.random() * widthFrame, Math.random() * heightFrame));
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

app.ticker.add((delta) => {
  peopleArray.forEach((particle, index1) => {
    particle.clear();
    particle.update(delta);



    particle.draw();


    peopleArray.forEach((particleToTest, index2) => {
      if(index1 !== index2) {
        if(particle.isInCollisionWith(particleToTest) && index1 !== index2) {
          if(particle.isInfected()) {
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
