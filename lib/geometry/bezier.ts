import Point from '../geometry/point'

function addQuadraticBezierCurve(points: Array<Point>, fromPoint: Point, toPoint: Point, controlPoint: Point) {
    var P0 = fromPoint
    var P1 = controlPoint
    var P2 = toPoint
    for (var t = 0; t <= 10; t += 1) {
        let T = t / 10
        let x1 = (1 - T) * (1 - T) * P0.x + 2 * (1 - T) * T * P1.x + T * T * P2.x
        let y1 = (1 - T) * (1 - T) * P0.y + 2 * (1 - T) * T * P1.y + T * T * P2.y
        points.push(new Point(x1, y1))
    }
}

function addCubicBezierCurve(points: Array<Point>, P0: Point, P1: Point, P2: Point, P3: Point) {
    for (var T = 0; T <= 10; T += 1) {
        let t = T / 10
        let x = P0.x * Math.pow(1 - t, 3)
                + 3 * P1.x * t * Math.pow(1 - t, 2)
                + 3 * P2.x * Math.pow(t, 2) * (1 - t)
                + P3.x * Math.pow(t, 3)
        let y = P0.y * Math.pow(1 - t, 3)
                + 3 * P1.y * t * Math.pow(1 - t, 2)
                + 3 * P2.y * Math.pow(t, 2) * (1 - t)
                + P3.y * Math.pow(t, 3)
        points.push(new Point(x, y))
    }
}

export { addQuadraticBezierCurve, addCubicBezierCurve }