import Point from "../geometry/point";
import LatLng from "./latlng";
import Georeference from "./georeference";

let D2R = Math.PI / 180;
let R2D = 180 / Math.PI;
let A = 6378137.0;
let MAXEXTENT = 20037508.342789244;

function getPerpendicular(point: Point): Point {
    return new Point(point.y, -point.x);
}

function scalarProduct(a: Point, b: Point): number {
    return (a.x * b.x) + (a.y * b.y);
}

function add(a: Point, b: Point): Point {
    return new Point(a.x + b.x, a.y + b.y);
}

function subtract(a: Point, b: Point): Point {
    return new Point(a.x - b.x, a.y - b.y);
}

function length(a: Point): number {
    return Math.hypot(a.x, a.y);
}

function multiplyBy(point: Point, scalar: number): Point {
    return new Point(point.x * scalar, point.y * scalar);
}

function projectPoint(point: Point, georeference: Georeference): LatLng {
    let point0 = point;
    let point1 = georeference.bottomLeft;
    let point2 = georeference.topRight;
    let latLng1 = georeference.southWest;
    let latLng2 = georeference.northEast;
    let point12 = subtract(point2, point1);
    let point10 = subtract(point0, point1);
    let point12Perpendicular = getPerpendicular(point12);

    let projectParallel = scalarProduct(point12, point10) / (length(point12) * length(point12));
    let projectPerpendicular = scalarProduct(point12Perpendicular, point10) / (length(point12Perpendicular) * length(point12Perpendicular));

    let pxLatLng1 = forward(latLng1);
    let pxLatLng2 = forward(latLng2);
    let pxLatLng0 = add(add(pxLatLng1, multiplyBy(subtract(pxLatLng2, pxLatLng1), projectParallel)), multiplyBy(getPerpendicular(subtract(pxLatLng2, pxLatLng1)), projectPerpendicular));
    return inverse(pxLatLng0);
}

/**
 * Convert a LatLng into a Point in Cartesian coordinate
 *
 * @param latLng to convert
 * @return the converted Point
 */
function forward(latLng: LatLng): Point {
    var x = A * latLng.longitude * D2R;
    var y = A * Math.log(Math.tan((Math.PI * 0.25) + (0.5 * latLng.latitude * D2R)));

    if (x > MAXEXTENT) x = MAXEXTENT;
    if (x < -MAXEXTENT) y = -MAXEXTENT;
    if (y > MAXEXTENT) y = MAXEXTENT;
    if (y < -MAXEXTENT) y = -MAXEXTENT;

    return new Point(x, y);
}

/**
 * Convert a Point in Cartesian coordinate to LatLng
 *
 * @param point to convert
 * @return the converted LatLng
 */
function inverse(point: Point): LatLng {
  let longitude = point.x * R2D / A;
  let latitude = ((Math.PI * 0.5) - 2.0 * Math.atan(Math.exp(-point.y / A))) * R2D;
  return new LatLng(latitude, longitude);
}

export { projectPoint }