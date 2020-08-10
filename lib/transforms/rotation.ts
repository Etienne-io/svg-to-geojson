import Transform from './transform';
import Point from '../geometry/point';

export default class Rotation extends Transform {

  teta: number
  center: Point

  constructor(teta: number, center: Point) {
    super()
    this.teta = teta;
    this.center = center;
  }

  applyOnPoint(point: Point) {
      let tetaRadian = this.teta * Math.PI / 180;
      let s = Math.sin(tetaRadian);
      let c = Math.cos(tetaRadian);

      // translate point back to origin:
      let px = point.x - this.center.x;
      let py = point.y - this.center.y;

      // rotate point
      let xnew = px * c - py * s;
      let ynew = px * s + py * c;

      point.x = this.center.x + xnew;
      point.y = this.center.y + ynew;
  }

}
