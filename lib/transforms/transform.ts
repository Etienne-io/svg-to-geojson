import Point from "../geometry/point";
import SimpleElement from "../elements/simple_element";
import ComplexElement from "../elements/complex_element";

export default class Transform {

  applyOnPoint(_: Point) {

  }

  applyOnSimpleElement(element: SimpleElement) {
    element.points.forEach( p => this.applyOnPoint(p) )
  }

  applyOnComplexElement(element: ComplexElement) {
    element.pointsLists.forEach( pl => pl.forEach( p => this.applyOnPoint(p) ) )
  }

}