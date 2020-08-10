import Command from "./command"
import Point from "../geometry/point"

export default class TerminationCommand implements Command {

  execute(_: Point, previousPoints: Array<Point>): Array<Point> {
      previousPoints.push(new Point(previousPoints[0].x, previousPoints[0].y))
      return previousPoints
  }

}