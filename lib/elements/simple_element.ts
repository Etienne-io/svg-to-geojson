import BaseElement from './base_element'
import Style from './style';
import Point from '../geometry/point'

export default class SimpleElement extends BaseElement {

  points: Array<Point>

  constructor(points: Array<Point>, style: Style) {
      super(style);
      this.points = points;
  }

}