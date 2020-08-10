import LatLng from './latlng';
import Point from '../geometry/point'
export default class Georeference {

  bottomLeft: Point;
  topRight: Point;
  southWest: LatLng;
  northEast: LatLng;

  public Georeference(bottomLeft: Point, topRight: Point, southWest: LatLng, northEast: LatLng) {
      this.bottomLeft = bottomLeft;
      this.topRight = topRight;
      this.southWest = southWest;
      this.northEast = northEast;
  }
}