import * as PIXI from 'pixi.js';

type stateInfection = 'normal' | 'infected' | 'immunised' | 'dead';

export default class Person {
  currentColorOfTheTarget = 0xCC06BB;
  normalColor = 0xFFFFFF;
  infectedColor = 0xFF0606;
  immunisedColor = 0x31CC06;
  deadColor = 0xCC00CC;
  speed = 1;
  infectionRayon = 4;
  directionAngle = 0;
  isShowText = false;
  graphics = new PIXI.Graphics();
  text = new PIXI.Text('FIRST');
  container: PIXI.Container;
  infectionTime = 12000;
  chanceOfDeath = 0.001;

  constructor(
    private app: PIXI.Application,
    private state: stateInfection = 'normal',
    private x = 0,
    private y = 0) {
    this.container = this.app.stage;
    this.x = Math.random() * this.app.renderer.width;
    this.y = Math.random() * this.app.renderer.height;
    this.changeInfectionState(state);
    this.directionAngle = Math.random() * 360;
    this.container.addChild(this.graphics);
  }

  changeInfectionState(state: stateInfection) {
    if(this.isDead()) return;
    switch (state) {
      case 'normal':
        this.state = 'normal';
        this.currentColorOfTheTarget = this.normalColor;
        break;
      case 'infected':
        this.state = 'infected';
        this.currentColorOfTheTarget = this.infectedColor;
        setTimeout(() => {
          this.changeInfectionState('immunised');
        }, this.infectionTime);
        break;
      case 'immunised':
        this.state = 'immunised';
        this.currentColorOfTheTarget = this.immunisedColor;

        // can be dead
        if(Math.random() < this.chanceOfDeath) { this.changeInfectionState('dead') }
        break;
      case 'dead':
        this.state = 'dead';
        this.currentColorOfTheTarget = this.deadColor;
        this.speed = 0;
      break;
      default:
        break;
    }
  }

  setConfinementRatio(ratio: number) {
    if (ratio > 100) { ratio = 100; }
    if (ratio < 0) { ratio = 0; }
    ratio = 100 - ratio;
    this.speed = 1 * (ratio / 100);
  }

  update(delta: number) {
    const angleRad = this.directionAngle * Math.PI / 180;
    const xDirection = Math.cos(angleRad);
    const yDirection = Math.sin(angleRad);
    const increment = this.speed * delta;
    this.x = this.x + increment * xDirection;
    this.y = this.y + increment * yDirection;

    // detection touching frame
    const left = this.x <= 0 && this.y >= 0;
    const right = this.x >= this.app.renderer.width && this.y >= 0;
    const top = this.x >= 0 && this.y <= 0;
    const bottom = this.x >= 0 && this.y >= this.app.renderer.height;

    if (left || right) {
      this.directionAngle = 180 - this.directionAngle;
    }

    if (top || bottom) {
      this.directionAngle = 360 - this.directionAngle;
    }
  }

  setName(name: string) {
    this.isShowText = true;
    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 14,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
    });
    this.text.style = style;
    this.container.addChild(this.text);
    this.text.text = name;
  }

  isInCollisionWith(particule: Person): boolean {
    let deltaX = this.x - particule.x;
    let deltaY = this.y - particule.y;

    if (Math.abs(deltaX) <= this.infectionRayon && Math.abs(deltaY) <= this.infectionRayon) {
      return true;
    }

    return false;
  }

  isInfected():boolean {
    if(this.state === 'infected') {
      return true;
    }
    return false;
  }

  isImmunised():boolean {
    if(this.state === 'immunised') {
      return true;
    }
    return false;
  }

  isDead():boolean {
    if(this.state === 'dead') {
      return true;
    }
    return false;
  }

  destroy() {
    this.container.removeChild(this.graphics);
    this.container.removeChild(this.text);
  }

  clear() {
    this.graphics.clear();
  }

  draw() {
    // poeple
    this.graphics.lineStyle(0)
      .beginFill(this.currentColorOfTheTarget, 1)
      .drawCircle(this.x, this.y, 2.5)
      .endFill();

    // infection zone
    this.graphics.lineStyle(1, this.currentColorOfTheTarget)
      .beginFill(0x000000, 0)
      .drawCircle(this.x, this.y, this.infectionRayon)
      .endFill();

    if (this.isShowText) {
      this.text.x = this.x - 0;
      this.text.y = this.y - 20;
    }
  }
}
