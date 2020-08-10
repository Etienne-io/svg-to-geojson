import { addCubicBezierCurve } from '../geometry/bezier'
import Command from './command'
import Point from '../geometry/point'

export default class ShortCurveCommand implements Command {

  firstControlPoint: Point
  secondControlPoint: Point
  endPoint: Point
  absolute: boolean

  public ShortCurveCommand(firstControlPoint: Point, secondControlPoint: Point, endPoint: Point, absolute: boolean) {
      this.firstControlPoint = firstControlPoint
      this.secondControlPoint = secondControlPoint
      this.endPoint = endPoint
      this.absolute = absolute
  }

  execute(lastPoint: Point, previousPoints: Array<Point>, lastControlPoint: Point): Array<Point> {
      if (lastControlPoint) {
        return this.executeAfterCurve(lastPoint, previousPoints, lastControlPoint)
      }
      return this.executeDefault(lastPoint, previousPoints)
  }

  executeDefault(lastPoint: Point, previousPoints: Array<Point>): Array<Point> {
    let P0 = lastPoint
    let P1
    let P2 = !this.absolute ? this.secondControlPoint.addTo(P0) : this.secondControlPoint
    let P3 = !this.absolute ? this.endPoint.addTo(P0) : this.endPoint

    if (this.firstControlPoint == null) {
        P1 = P0
    } else {
        P1 = new Point(2 * (lastPoint.x + this.firstControlPoint.x) - P2.x, 2 * (lastPoint.y + this.firstControlPoint.y) - P2.y)
    }

    this.firstControlPoint = P1
    this.secondControlPoint = P2
    this.endPoint = P3

    addCubicBezierCurve(previousPoints, P0, P1, P2, P3)
    return previousPoints
  }

  executeAfterCurve(lastPoint: Point, previousPoints: Array<Point>, lastSecondControlPoint: Point) {

      let x1 = lastPoint.x
      let y1 = lastPoint.y

      var x2, y2, cx1, cy1, cx2, cy2: number

      if (!this.absolute) {
          cx2 = lastPoint.x + this.secondControlPoint.x
          cy2 = lastPoint.y + this.secondControlPoint.y
          x2 = lastPoint.x + this.endPoint.x
          y2 = lastPoint.y + this.endPoint.y
      } else {
          cx2 = this.secondControlPoint.x
          cy2 = this.secondControlPoint.y
          x2 = this.endPoint.x
          y2 = this.endPoint.y
      }

      cx1 = 2 * x1 - lastSecondControlPoint.x
      cy1 = 2 * y1 - lastSecondControlPoint.y

      let P0 = new Point(x1, y1)
      let P1 = new Point(cx1, cy1)
      let P2 = new Point(cx2, cy2)
      let P3 = new Point(x2, y2)

      this.firstControlPoint = P1
      this.secondControlPoint = P2
      this.endPoint = P3

      addCubicBezierCurve(previousPoints, P0, P1, P2, P3)
      return previousPoints
  }
}