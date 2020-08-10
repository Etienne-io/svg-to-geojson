import SimpleElement from './simple_element'
import Point from '../geometry/point'
import Style from './style'
import { makeClockwize } from '../utils/fill_improver'
import Transform from '../transforms/transform';

export default class Polyline extends SimpleElement {

  constructor(points: Array<Point>, style: Style) {
      super(makeClockwize(points), style);
  }

}

class PolylineBuilder {

  _points: Array<Point>
  _transforms: Array<Transform>
  _style: Style

  points(points: Array<Point>): PolylineBuilder {
      this._points = points;
      return this;
  }

  transforms(transforms: Array<Transform>): PolylineBuilder {
      this._transforms = transforms;
      return this;
  }

  style(style: Style): PolylineBuilder {
      this._style = style;
      return this;
  }

  build(): Polyline {
      let polyline = new Polyline(this._points, this._style);
      this._transforms.forEach( t => t.applyOnSimpleElement(polyline) )
      return polyline;
  }

}

export { PolylineBuilder }