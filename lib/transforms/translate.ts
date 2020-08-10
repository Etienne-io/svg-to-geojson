import Transform from './transform';
import Point from '../geometry/point';

export default class Translate extends Transform {

  x: number
  y: number

  constructor(x: number, y: number) {
    super()
    this.x = x;
    this.y = y;
  }

  applyOnPoint(point: Point) {
    point.x = point.x + this.x
    point.y = point.y + this.y
  }

}
