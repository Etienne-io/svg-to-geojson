import Point from '../geometry/point'

export default interface Command {

  execute(lastPoint: Point, previousPoints: Array<Point>, lastControlPoint: Point): Array<Point>

}
