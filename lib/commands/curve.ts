import { addCubicBezierCurve } from '../geometry/bezier'
import Point from '../geometry/point'
import Command from './command'

export default class CurveCommand implements Command {
  
  firstControlPoint: Point
  secondControlPoint: Point
  endPoint: Point
  absolute: boolean

  constructor(firstControlPoint: Point, secondControlPoint: Point, endPoint: Point, absolute: boolean) {
    this.firstControlPoint = firstControlPoint
    this.secondControlPoint = secondControlPoint
    this.endPoint = endPoint
    this.absolute = absolute
  }

  execute(lastPoint: Point, previousPoints: Array<Point>): Array<Point> {
    let P0 = lastPoint
    let P1 = !this.absolute ? this.firstControlPoint.addTo(P0) : this.firstControlPoint
    let P2 = !this.absolute ? this.secondControlPoint.addTo(P0) : this.secondControlPoint
    let P3 = !this.absolute ? this.endPoint.addTo(P0) : this.endPoint

    this.firstControlPoint = P1
    this.secondControlPoint = P2
    this.endPoint = P3

    addCubicBezierCurve(previousPoints, P0, P1, P2, P3)
    return previousPoints
  }

}