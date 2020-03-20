type stateInfection = 'normal' | 'infected' | 'immunised';

export default class Person {
  currentColorOfTheTarget = 0xCC06BB;
  normalColor = 0xFFFFFF;
  infectedColor = 0xFF0606;
  immunisedColor = 0x31CC06;
  speed=1;
  directionAngle = 0;

  constructor(
    private graphics: PIXI.Graphics,
    private state: stateInfection = 'normal',
    private x = 0,
    private y = 0,
    private maxWidth=50,
    private maxHight=50) {
      this.changeInfectionState(state);
      this.directionAngle = Math.random() * 360;
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
    if(ratio > 100) { ratio = 100 }
    if(ratio < 0) { ratio = 0 }
    ratio = 100 - ratio;
    this.speed = 1 * (ratio/100);
  }

  update(delta:number) {
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

    if(left || right) {
      this.directionAngle = 180 - this.directionAngle;
    }

    if(top || bottom) {
      this.directionAngle = 360 - this.directionAngle;
    }
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
  }
}
