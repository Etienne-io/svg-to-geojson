import Point from '../geometry/point'

function isClockwise(path: Array<Point>): boolean {
    var counter = 0
    let endIndex = path.length
    if (path[0].x == path[path.length - 1].x
            && path[0].y == path[path.length - 1].y) {
        endIndex -= 1
    }
    for (var i = 0; i < endIndex; i++) {
        let P1 = path[i]
        var P2: Point
        if (endIndex != path.length) {
            P2 = path[i + 1]
        } else {
            P2 = path[(i + 1) % path.length]
        }
        counter += (P2.x - P1.x) * (P2.y + P1.y)
    }
    return counter > 0
}

function makeClockwize(path: Array<Point>): Array<Point> {
    cleanPath(path)
    if (isClockwise(path)) {
        return path
    }
    var clockwisePath: Array<Point> = []
    path.forEach( p => {
        clockwisePath.splice(0, 0, p)
    })
    return clockwisePath
}

function cleanPath(path: Array<Point>) {
    var indexToRemove: Array<number> = []
    for (var i = 0; i < path.length - 2; i++) {
        if (path[i].x == path[i + 2].x
                && path[i].y == path[i + 2].y) {
            indexToRemove.push(i+1)
        }
    }
    for (var i = indexToRemove.length - 1; i >= 0; i--) {
        path.splice(i, 1)
    }
}

function makePathClockwize(path: Array<Array<Point>>) {
    return makeLargestPathClockwize(path)
}

function getLargestPathIndex(path: Array<Array<Point>>) {
    var boundsArea = 0
    var index = 0
    for (var i = 0; i < path.length; i++) {
        let subpath = path[i]
        var minX = Number.MAX_VALUE
        var minY = Number.MAX_VALUE
        var maxX = Number.MIN_VALUE
        var maxY = Number.MIN_VALUE
        subpath.forEach( p => {
            if (p.x < minX) minX = p.x
            if (p.x > maxX) maxX = p.x
            if (p.y < minY) minY = p.y
            if (p.y > maxY) maxY = p.y
        })
        let area = Math.abs((maxX - minX) * (maxY - minY))
        if (area > boundsArea) {
            boundsArea = area
            index = i
        }
    }
    return index
}

function makeLargestPathClockwize(path: Array<Array<Point>>): Array<Array<Point>> {
    let index = getLargestPathIndex(path)
    if (isClockwise(path[index])) {
        return path
    }
    var clockwiseSubpath: Array<Array<Point>> = []
    path.forEach( subpath => {
        clockwiseSubpath.push([])
        subpath.forEach( sp => {
            clockwiseSubpath[clockwiseSubpath.length - 1].splice(0, 0, sp)
        })
    })
    
    return clockwiseSubpath
}

export { makeClockwize, makePathClockwize }