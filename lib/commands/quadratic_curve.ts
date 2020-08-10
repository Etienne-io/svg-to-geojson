import { addCubicBezierCurve } from '../geometry/bezier'
import Command from './command'
import Point from '../geometry/point'

export default class QuadraticCurveCommand implements Command {

  controlPoint: Point
  endPoint: Point
  absolute: boolean

constructor(controlPoint: Point, endPoint: Point, absolute: boolean) {
      this.controlPoint = controlPoint
      this.endPoint = endPoint
      this.absolute = absolute
  }

  execute(lastPoint: Point, previousPoints: Array<Point>): Array<Point> {
      let P0 = lastPoint
      let P1 = this.absolute ? this.controlPoint : this.controlPoint.addTo(P0)
      let P2 = this.absolute ? this.endPoint : this.endPoint.addTo(P0)
      this.controlPoint = P1
      this.endPoint = P2
      addCubicBezierCurve(previousPoints, P0, P1, P1, P2)
      return previousPoints
  }

}
