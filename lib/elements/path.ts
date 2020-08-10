import Point from '../geometry/point'
import Style from './style'
import { makePathClockwize } from '../utils/fill_improver'
import Transform from '../transforms/transform';
import ComplexElement from './complex_element';

export default class Path extends ComplexElement {

  constructor(points: Array<Array<Point>>, style: Style) {
      super(makePathClockwize(points), style);
  }

}

class PathBuilder {

  _points: Array<Array<Point>>
  _transforms: Array<Transform>
  _style: Style

  points(points: Array<Array<Point>>): PathBuilder {
      this._points = points;
      return this;
  }

  transforms(transforms: Array<Transform>): PathBuilder {
      this._transforms = transforms;
      return this;
  }

  style(style: Style): PathBuilder {
      this._style = style;
      return this;
  }

  build(): Path {
      let path = new Path(this._points, this._style);
      this._transforms.forEach( t => t.applyOnComplexElement(path) )
      return path;
  }

}

export { PathBuilder }