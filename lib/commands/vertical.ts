import Command from "./command"
import Point from "../geometry/point"

export default class VerticalCommand implements Command {

  y: number
  isAbsolute: boolean

  constructor(y: number, absolute: boolean) {
      this.y = y
      this.isAbsolute = absolute
  }

  execute(lastPoint: Point, previousPoints: Array<Point>): Array<Point> {
      if (this.isAbsolute) {
          previousPoints.push(new Point(lastPoint.x, this.y))
      } else {
          previousPoints.push(new Point(lastPoint.x, lastPoint.y + this.y))
      }
      return previousPoints
  }
}