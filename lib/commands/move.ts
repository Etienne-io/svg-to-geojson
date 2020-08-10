import Command from "./command"
import Point from "../geometry/point"

export default class MoveCommand implements Command {
  
  coordinate: Point
  absolute: boolean

  constructor(coordinate: Point, absolute: boolean) {
    this.coordinate = coordinate
    this.absolute = absolute
  }

  execute(lastPoint: Point, _: Array<Point>): Array<Point> {
    let points: Array<Point> = []
    if (this.absolute || lastPoint == null) {
      points.push(this.coordinate)
    }
    else {
      points.push(new Point(lastPoint.x + this.coordinate.x, lastPoint.y + this.coordinate.y))
    }
    return points
  }

}
