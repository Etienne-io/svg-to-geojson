import SimpleElement from './simple_element'
import Point from '../geometry/point'
import Style from './style'
import { makeClockwize } from '../utils/fill_improver'
import Transform from '../transforms/transform';

export default class Ellipse extends SimpleElement {

  constructor(points: Array<Point>, style: Style) {
      super(makeClockwize(points), style);
  }

}

class EllipseBuilder {

  _cx: number
  _cy: number
  _rx: number
  _ry: number
  _transforms: Array<Transform>
  _style: Style

  cx(cx: number): EllipseBuilder {
      this._cx = cx;
      return this;
  }

  cy(cy: number): EllipseBuilder {
    this._cy = cy;
    return this;
  }

  rx(rx: number): EllipseBuilder {
    this._rx = rx;
    return this;
  }

  ry(ry: number): EllipseBuilder {
    this._ry = ry;
    return this;
  }

  transforms(transforms: Array<Transform>): EllipseBuilder {
      this._transforms = transforms;
      return this;
  }

  style(style: Style): EllipseBuilder {
      this._style = style;
      return this;
  }

  build(): Ellipse {
      throw new Error("Ellipse not implemented")
  }

}

export { EllipseBuilder }