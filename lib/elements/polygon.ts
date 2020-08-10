import SimpleElement from './simple_element'
import Point from '../geometry/point'
import Style from './style'
import { makeClockwize } from '../utils/fill_improver'
import Transform from '../transforms/transform';

export default class Polygon extends SimpleElement {

  constructor(points: Array<Point>, style: Style) {
      super(makeClockwize(points), style);
  }

}

class PolygonBuilder {

  _points: Array<Point>
  _transforms: Array<Transform>
  _style: Style

  points(points: Array<Point>): PolygonBuilder {
      this._points = points;
      return this;
  }

  transforms(transforms: Array<Transform>): PolygonBuilder {
      this._transforms = transforms;
      return this;
  }

  style(style: Style): PolygonBuilder {
      this._style = style;
      return this;
  }

  build(): Polygon {
      let polygon = new Polygon(this._points, this._style);
      this._transforms.forEach( t => t.applyOnSimpleElement(polygon) )
      return polygon;
  }

}

export { PolygonBuilder }