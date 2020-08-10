import { addCubicBezierCurve } from '../geometry/bezier'
import Command from './command'
import Point from '../geometry/point'

export default class ShortQuadraticCurveCommand implements Command {

  controlPoint: Point
  endPoint: Point
  absolute: boolean

  public ShortQuadraticCurveCommand(controlPoint: Point, endPoint: Point, absolute: boolean) {
      this.controlPoint = controlPoint
      this.endPoint = endPoint
      this.absolute = absolute
  }

  execute(lastPoint: Point, previousPoints: Array<Point>): Array<Point> {
      let P0 = lastPoint
      let P1
      let P2 = !this.absolute ? this.endPoint.addTo(P0) : this.endPoint

      if (this.controlPoint == null) {
          P1 = P0
      } else {
          P1 = new Point(2 * (this.controlPoint.x + P0.x) - P2.x, 2 * (this.controlPoint.y + P0.y) - P2.y)
      }

      this.controlPoint = P1
      this.endPoint = P2

      addCubicBezierCurve(previousPoints, P0, P1, P1, P2)
      return previousPoints
  }
}