import Transform from './transform';
import Point from '../geometry/point';

export default class Matrix extends Transform {

  matrix: Array<Array<number>>

  constructor(matrix: Array<Array<number>>) {
    super()
    this.matrix = matrix
  }

  applyOnPoint(point: Point) {
    let x = this.matrix[0][0] * point.x + this.matrix[0][1] * point.y + this.matrix[0][2];
    let y = this.matrix[1][0] * point.x + this.matrix[1][1] * point.y + this.matrix[1][2];
    point.x = x;
    point.y = y;
  }

}
