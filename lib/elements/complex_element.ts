import BaseElement from "./base_element";
import Point from "../geometry/point";
import Style from "./style";

export default class ComplexElement extends BaseElement {

  pointsLists: Array<Array<Point>> 

  constructor(pointsLists: Array<Array<Point>> , style: Style) {
      super(style);
      this.pointsLists = pointsLists;
  }

}

