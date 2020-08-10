import BaseElement from '../elements/base_element'
import SimpleElement from '../elements/simple_element'
import ComplexElement from '../elements/complex_element'
import Georeference from './georeference'
import Style, { StyleBuilder } from '../elements/style'
import Point from '../geometry/point'
import { projectPoint}  from './projection'

function convert(elements: Array<BaseElement>, georeference: Georeference): Array<any> {
  var featureNumber = 0
  var allFeatures: Array<any> = []
  elements.forEach( e => {
    var newFeatures: Array<any> = []
    if (e instanceof SimpleElement) {
      newFeatures = convertSimpleElement(e, georeference)
    }
    else if (e instanceof ComplexElement) {
      newFeatures = convertComplexElement(e, georeference)
    }
    newFeatures.forEach( f => f.properties.featureNumber = featureNumber )

    allFeatures = allFeatures.concat(newFeatures)
    featureNumber += 1
  })

  return allFeatures
}

function convertSimpleElement(element: SimpleElement, georeference: Georeference): Array<object> {
  invertYCoordinate(element, georeference);
  var returnedFeatures: Array<any> = [];
  element.style.validate();
  returnedFeatures = returnedFeatures.concat(extractSimpleElementPolygons(element, georeference));
  returnedFeatures = returnedFeatures.concat(extractSimpleElementLineString(element, georeference));
  return returnedFeatures;
}

function convertComplexElement(element: ComplexElement, georeference: Georeference): Array<object> {
  invertYCoordinate(element, georeference);
  var returnedFeatures: Array<any> = [];
  element.style.validate();
  returnedFeatures = returnedFeatures.concat(extractComplexElementPolygons(element, georeference));
  returnedFeatures = returnedFeatures.concat(extractComplexElementLineString(element, georeference));
  return returnedFeatures;
}

function extractSimpleElementLineString(element: SimpleElement, georeference: Georeference) {
  var jsonObjects: Array<any> = []
  if (isLineStringStyle(element.style)) {
      jsonObjects = jsonObjects.concat(buildGeoJSONLineString(element.points, element.style, georeference));
  }
  return jsonObjects;
}

function extractComplexElementLineString(element: ComplexElement, georeference: Georeference) {
  var jsonObjects: Array<any> = [];
  element.pointsLists.forEach( subpath => {
    if (isLineStringStyle(element.style)) {
      jsonObjects = jsonObjects.concat(buildGeoJSONLineString(subpath, element.style, georeference));
    }
  })
  return jsonObjects;
}

function extractSimpleElementPolygons(element: SimpleElement, georeference: Georeference) {
  var jsonObjects: Array<any> = [];
  if (!isPolygonStyle(element.style)) {
    return jsonObjects;
}
if (element.points.length > 2) {
  var pointsCopy: Array<Point> = []
  element.points.forEach( p => pointsCopy.push(new Point(p.x, p.y)) )
  pointsCopy.push(pointsCopy[0])
  var style = new StyleBuilder()
    .fillColor(element.style.fillColor)
    .fillOpacity(element.style.fillOpacity)
    .build()
  style.validate()  
  jsonObjects.push(buildGeoJSONPolygon(pointsCopy, style, georeference));
}
  return jsonObjects;
}

function extractComplexElementPolygons(element: ComplexElement, georeference: Georeference) {
  var jsonObjects: Array<any> = [];
  if (!isPolygonStyle(element.style)) {
    return jsonObjects;
  }
  jsonObjects.push(buildGeoJSONPolygon(element.pointsLists[0], element.style, georeference));
  for (var i = 1; i < element.pointsLists.length; i++) {
      var subpath: Array<Point> = element.pointsLists[i];
      if (element.style.fillColor != null) {
          if (subpath.length > 2) {
            var pointsCopy: Array<Point> = []
            subpath.forEach( p => pointsCopy.push(new Point(p.x, p.y)) )
            pointsCopy.push(pointsCopy[0])
            addToGeoJSONPolygon(jsonObjects[jsonObjects.length - 1], pointsCopy, georeference);
          }
      }
  }
  return jsonObjects;
}

function addToGeoJSONPolygon(polygon: any, subpath: Array<Point>, georeference: Georeference) {
  var coordinates: Array<any> = [];
  subpath.forEach( p => {
    let latLng = projectPoint(p, georeference)
    let coordinate = [latLng.longitude, latLng.latitude]
    coordinates.push(coordinate)
  })
  polygon.geometry.coordinates.push(coordinates);
}

function buildGeoJSONPolygon(subpath: Array<Point>, style: Style, georeference: Georeference): Array<any> {
  var returnedObjects: Array<any> = []
  var jsonObject: any = {};
  jsonObject.type = "Feature";
  var geometry: any = {};
  geometry.type = "Polygon";
  var allCoordinates: Array<any> = [];
  var coordinates: Array<any> = [];
  subpath.forEach( p => {
    let latLng = projectPoint(p, georeference)
    let coordinate = [ latLng.longitude, latLng.latitude ]
    coordinates.push(coordinate)
  })
  allCoordinates.push(coordinates)
  geometry.coordinates = allCoordinates;
  let properties = buildGeoJSONPolygonStyle(style);
  jsonObject.geometry = geometry;
  jsonObject.properties = properties;
  returnedObjects.push(jsonObject);
  return returnedObjects;
}

function buildGeoJSONLineString(subpath: Array<Point>, style: Style, georeference: Georeference): Array<any> {
  var returnedObjects: Array<any> = []
  var jsonObject: any = {};
  jsonObject.type = "Feature";
  var geometry: any = {};
  geometry.type = "LineString";
  var coordinates: Array<any> = [];
  subpath.forEach( p => {
    let latLng = projectPoint(p, georeference)
    let coordinate = [ latLng.longitude, latLng.latitude ]
    coordinates.push(coordinate)
  })
  geometry.coordinates = coordinates;
  let properties = buildGeoJSONLineStringStyle(style);
  jsonObject.geometry = geometry;
  jsonObject.properties = properties;
  returnedObjects.push(jsonObject);
  return returnedObjects;
}

function buildGeoJSONPolygonStyle(style: Style): any {
  var jsonObject: any = {}
  if (style.fillColor == null || style.fillColor === "none") {
      jsonObject.fillColor = "white";
      jsonObject.fillOpacity = 0.0;
  } else {
      jsonObject.fillColor = style.fillColor;
      jsonObject.fillOpacity = style.fillOpacity;
  }
  return jsonObject;
}

function buildGeoJSONLineStringStyle(style: Style): any {
  var jsonObject: any = {}
  jsonObject.strokeColor = style.strokeColor;
  jsonObject.strokeOpacity = style.strokeOpacity;
  jsonObject.strokeWidth = style.strokeWidth;
  jsonObject.strokeLineCap = style.strokeLineCap;
  jsonObject.strokeLineJoin = style.strokeLineJoin;
  return jsonObject;
}

function isLineStringStyle(style: Style): boolean {
  return style.strokeColor != null && "none" !== style.strokeColor
          && style.strokeOpacity != null && style.strokeWidth != null
          && style.strokeOpacity != 0.0 && style.strokeWidth != 0.0;
}

function isPolygonStyle(style: Style): boolean {
  return style.fillColor != null && "none" !== style.fillColor && style.fillOpacity != 0.0;
}

function invertYCoordinate(element: BaseElement, georeference: Georeference) {
  if (element instanceof SimpleElement) {
    element.points.forEach( p => p.y = georeference.bottomLeft.y - p.y )
  }
  if (element instanceof ComplexElement) {
    element.pointsLists.forEach( pl => pl.forEach( p => p.y = georeference.bottomLeft.y - p.y ) )
  }
}



export default convert