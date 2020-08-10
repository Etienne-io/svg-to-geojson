import SimpleElement from './simple_element'
import Point from '../geometry/point'
import Style from './style'
import { makeClockwize } from '../utils/fill_improver'
import Transform from '../transforms/transform';

export default class Circle extends SimpleElement {

  constructor(points: Array<Point>, style: Style) {
      super(makeClockwize(points), style);
  }

}

class CircleBuilder {

  _center: Point
  _radius: number
  _transforms: Array<Transform>
  _style: Style

  center(center: Point): CircleBuilder {
      this._center = center;
      return this;
  }

  radius(radius: number): CircleBuilder {
      this._radius = radius;
      return this;
  }

  transforms(transforms: Array<Transform>): CircleBuilder {
      this._transforms = transforms;
      return this;
  }

  style(style: Style): CircleBuilder {
      this._style = style;
      return this;
  }

  build(): Circle {
      var points: Array<Point> = []
      let nbPoints = Math.floor(10 + this._radius * 2)
      let angle = 2 * Math.PI / nbPoints;
      for (var i = 0; i < nbPoints; i++) {
          points.push(new Point(this._center.x + this._radius * Math.cos(i * angle), this._center.y + this._radius * Math.sin(i * angle)));
      }
      points.push(new Point(points[0].x, points[0].y));
      let circle = new Circle(points, this._style);
      this._transforms.forEach( t => t.applyOnSimpleElement(circle) )
      return circle;
  }

}

export { CircleBuilder }