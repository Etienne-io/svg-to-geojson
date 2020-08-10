import SimpleElement from './simple_element'
import Point from '../geometry/point'
import Style from './style'
import { makeClockwize } from '../utils/fill_improver'
import Transform from '../transforms/transform';
import { addQuadraticBezierCurve } from '../geometry/bezier'

export default class Rectangle extends SimpleElement {

  constructor(points: Array<Point>, style: Style) {
      super(makeClockwize(points), style);
  }

}

class RectangleBuilder {

  _x = 0.0
  _y = 0.0
  _width = 0.0
  _height = 0.0
  _rx = -1.0
  _ry = -1.0
  _transforms: Array<Transform>
  _style: Style

  x(x: number): RectangleBuilder {
      this._x = x;
      return this;
  }

  y(y: number): RectangleBuilder {
    this._y = y;
    return this;
}

width(width: number): RectangleBuilder {
  this._width = width;
  return this;
}

height(height: number): RectangleBuilder {
  this._height = height;
  return this;
}

rx(rx: number): RectangleBuilder {
  this._rx = rx;
  return this;
}

ry(ry: number): RectangleBuilder {
  this._ry = ry;
  return this;
}

  transforms(transforms: Array<Transform>): RectangleBuilder {
      this._transforms = transforms;
      return this;
  }

  style(style: Style): RectangleBuilder {
      this._style = style;
      return this;
  }

  build(): Rectangle {
    var points: Array<Point> = []
    if (this._rx < 0.0 && this._ry > 0.0) this._rx = this._ry;
    if (this._ry < 0.0 && this._rx > 0.0) this._ry = this._rx;
    if (this._rx < 0.0) this._rx = 0.0;
    if (this._ry < 0.0) this._ry = 0.0;
    if (this._rx > this._width / 2.0) this._rx = this._width / 2.0;
    if (this._ry > this._height / 2.0) this._ry = this._height / 2.0;

    if (this._rx < 0.00001 || this._ry < 0.0001) {
        points.push(new Point(this._x, this._y));
        points.push(new Point(this._x + this._width, this._y));
        points.push(new Point(this._x + this._width, this._y + this._height));
        points.push(new Point(this._x, this._y + this._height));
        points.push(new Point(this._x, this._y));
    } else {
        points.push(new Point(this._x + this._rx, this._y));
        points.push(new Point(this._x + this._width - this._rx, this._y));
        addQuadraticBezierCurve(points, points[points.length - 1], new Point(this._x + this._width, this._y + this._ry), new Point(this._x + this._width, this._y));
        points.push(new Point(this._x + this._width, this._y + this._height - this._ry));
        addQuadraticBezierCurve(points, points[points.length - 1], new Point(this._x + this._width - this._rx, this._y + this._height), new Point(this._x + this._width, this._y + this._height));
        points.push(new Point(this._x + this._rx, this._y + this._height));
        addQuadraticBezierCurve(points, points[points.length - 1], new Point(this._x, this._y + this._height - this._ry), new Point(this._x, this._y + this._height));
        points.push(new Point(this._x, this._y + this._ry));
        addQuadraticBezierCurve(points, points[points.length - 1], new Point(this._x + this._rx, this._y), new Point(this._x, this._y));
    }

    let rectangle = new Rectangle(points, this._style);
    this._transforms.forEach( t => t.applyOnSimpleElement(rectangle) )
    return rectangle;
  }

}

export { RectangleBuilder }