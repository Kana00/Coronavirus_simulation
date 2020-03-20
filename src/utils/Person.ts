import * as PIXI from 'pixi.js';

type stateInfection = 'normal' | 'infected' | 'immunised';

export default class Person {
  currentColorOfTheTarget = 0xCC06BB;
  normalColor = 0xFFFFFF;
  infectedColor = 0xFF0606;
  immunisedColor = 0x31CC06;
  speed = 1;
  directionAngle = 0;
  isShowText = false;
  graphics = new PIXI.Graphics();
  text = new PIXI.Text('FIRST');

  constructor(
    private container: PIXI.Container,
    private state: stateInfection = 'normal',
    private x = 0,
    private y = 0,
    private maxWidth = 50,
    private maxHight = 50) {
    this.changeInfectionState(state);
    this.directionAngle = Math.random() * 360;
    this.container.addChild(this.graphics);
  }

  changeInfectionState(state: stateInfection) {
    switch (state) {
      case 'normal':
        this.currentColorOfTheTarget = this.normalColor;
        break;
      case 'infected':
        this.currentColorOfTheTarget = this.infectedColor;
        break;
      case 'immunised':
        this.currentColorOfTheTarget = this.immunisedColor;
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
    const right = this.x >= this.maxWidth && this.y >= 0;
    const top = this.x >= 0 && this.y <= 0;
    const bottom = this.x >= 0 && this.y >= this.maxHight;

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
      .drawCircle(this.x, this.y, 12)
      .endFill();

    if (this.isShowText) {
      this.text.x = this.x - 0;
      this.text.y = this.y - 20;
    }
  }
}
