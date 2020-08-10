import Point from '../geometry/point'
import Command from './command'

export default class HorizontalCommand implements Command {

  x: number
  isAbsolute: boolean

  constructor(x: number, absolute: boolean) {
      this.x = x
      this.isAbsolute = absolute
  }

  execute(lastPoint: Point, previousPoints: Array<Point>): Array<Point> {
      if (this.isAbsolute) {
          previousPoints.push(new Point(this.x, lastPoint.y))
      } else {
          previousPoints.push(new Point(lastPoint.x + this.x, lastPoint.y))
      }
      return previousPoints
  }
}
