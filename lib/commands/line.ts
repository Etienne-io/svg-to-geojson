import Command from "./command"
import Point from "../geometry/point"

export default class LineCommand implements Command {

  coordinate: Point
  absolute: boolean

  public LineCommand(coordinate: Point, absolute: boolean) {
      this.coordinate = coordinate
      this.absolute = absolute
  }

  execute(lastPoint: Point, previousPoints: Array<Point>): Array<Point> {
      if (this.absolute) {
          previousPoints.push(this.coordinate)
      } else { 
          previousPoints.push(new Point(lastPoint.x + this.coordinate.x, lastPoint.y + this.coordinate.y))
      }
      return previousPoints
  }
}
