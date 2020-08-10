import Transform from './transform';
import Point from '../geometry/point';
import SimpleElement from '../elements/simple_element';
import ComplexElement from '../elements/complex_element';

export default class SkewY extends Transform {

  teta: number

  constructor(teta: number) {
    super()
    this.teta = teta;
  }

  applyOnPoint(_: Point) {
    throw new Error("Scale not implemented");
  }

  applyOnSimpleElement(_: SimpleElement) {
    throw new Error("Scale not implemented");
  }

  applyOnComplexElement(_: ComplexElement) {
    throw new Error("Scale not implemented");
  }

}
