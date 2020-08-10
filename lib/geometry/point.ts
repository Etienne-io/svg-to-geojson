export default class Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  static zero(){
    return new Point(0, 0)
  }

  addTo(point: Point): Point {
    return new Point(this.x + point.x, this.y + point.y)
  }
}