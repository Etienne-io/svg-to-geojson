import { addCubicBezierCurve } from '../geometry/bezier'
import Point from '../geometry/point'
import Command from './command'

export default class ArcCommand implements Command {

  rx: number
  ry: number
  x_axis_rotation: number
  large_arc_flag: boolean
  sweep_flag: boolean
  dx: number
  dy: number
  absolute: boolean

  public ArcCommand(rx: number, ry: number, x_axis_rotation: number, large_arc_flag: boolean, sweep_flag: boolean, dx: number, dy: number, absolute: boolean) {
      this.rx = Math.abs(rx)
      this.ry = Math.abs(ry)
      this.x_axis_rotation = x_axis_rotation / 180.0 * Math.PI
      this.large_arc_flag = large_arc_flag
      this.sweep_flag = sweep_flag
      this.dx = dx
      this.dy = dy
      this.absolute = absolute
  }

  execute(lastPoint: Point, previousPoints: Array<Point>): Array<Point> {
      
      var rx, ry, rotx: number
      var x1, y1, x2, y2, cx, cy, dx, dy, d: number
      var x1p, y1p, cxp, cyp, s, sa, sb: number
      var ux, uy, vx, vy, a1, da: number
      var x, y, tanx, tany, a, px = 0, py = 0, ptanx = 0, ptany = 0
      var t = new Array<number>(6)
      var sinrx, cosrx: number
      var fa, fs: number
      var i, ndivs: number
      var hda, kappa: number

      rx = Math.abs(this.rx)
      ry = Math.abs(this.ry)
      rotx = this.x_axis_rotation / 180.0 * Math.PI
      fa = this.large_arc_flag ? 1 : 0
      fs = this.sweep_flag ? 1 : 0
      x1 = lastPoint.x
      y1 = lastPoint.y
      if (!this.absolute) {
          x2 = x1 + this.dx
          y2 = y1 + this.dy
      } else {
          x2 = this.dx
          y2 = this.dy
      }

      dx = x1 - x2
      dy = y1 - y2
      d = Math.sqrt(dx * dx + dy * dy)
      if (d < 1e-6 || rx < 1e-6 || ry < 1e-6) {
          previousPoints.push(new Point(x2, y2))
          return previousPoints
      }

      sinrx = Math.sin(rotx)
      cosrx = Math.cos(rotx)

      x1p = cosrx * dx / 2.0 + sinrx * dy / 2.0
      y1p = -sinrx * dx / 2.0 + cosrx * dy / 2.0
      d = Math.pow(x1p, 2) / Math.pow(rx, 2) + Math.pow(y1p, 2) / Math.pow(ry, 2)
      if (d > 1) {
          d = Math.sqrt(d)
          rx *= d
          ry *= d
      }

      s = 0.0
      sa = Math.pow(rx, 2) * Math.pow(ry, 2) - Math.pow(rx, 2) * Math.pow(y1p, 2) - Math.pow(ry, 2) * Math.pow(x1p, 2)
      sb = Math.pow(rx, 2) * Math.pow(y1p, 2) + Math.pow(ry, 2) * Math.pow(x1p, 2)
      if (sa < 0.0) sa = 0.0
      if (sb > 0.0)
          s = Math.sqrt(sa / sb)
      if (fa == fs)
          s = -s
      cxp = s * rx * y1p / ry
      cyp = s * -ry * x1p / rx

      cx = (x1 + x2) / 2.0 + cosrx * cxp - sinrx * cyp
      cy = (y1 + y2) / 2.0 + sinrx * cxp + cosrx * cyp

      ux = (x1p - cxp) / rx
      uy = (y1p - cyp) / ry
      vx = (-x1p - cxp) / rx
      vy = (-y1p - cyp) / ry
      a1 = this.vectorAngle(1, 0.0, ux, uy)
      da = this.vectorAngle(ux, uy, vx, vy)

      if (fs == 0 && da > 0)
          da -= 2 * Math.PI
      else if (fs == 1 && da < 0)
          da += 2 * Math.PI

      t[0] = cosrx
      t[1] = sinrx
      t[2] = -sinrx
      t[3] = cosrx
      t[4] = cx
      t[5] = cy

      ndivs = Math.floor(Math.abs(da) / (Math.PI * 0.5) + 1.0)

      hda = (da / ndivs) / 2.0
      kappa = Math.abs(4.0 / 3.0 * (1.0 - Math.cos(hda)) / Math.sin(hda))
      if (da < 0.0)
          kappa = -kappa

      for (i = 0; i <= ndivs; i++) {
          a = a1 + da * (i / ndivs)
          dx = Math.cos(a)
          dy = Math.sin(a)
          var xy:Point = this.xformPoint(dx * rx, dy * ry, t); // position
          x = xy.x
          y = y
          var tanxy: Point = this.xformVec(-dy * rx * kappa, dx * ry * kappa, t); // tangent
          tanx = tanxy.x
          tany = tanxy.y
          if (i > 0) {
            addCubicBezierCurve(previousPoints, previousPoints[previousPoints.length - 1], new Point(px + ptanx, py + ptany), new Point(x - tanx, y - tany), new Point(x, y))
          }
          px = x
          py = y
          ptanx = tanx
          ptany = tany
      }

      return previousPoints
  }

  xformPoint(x: number, y: number, t: Array<number>): Point {
      var dx = x * t[0] + y * t[2] + t[4]
      var dy = x * t[1] + y * t[3] + t[5]
      return new Point(dx, dy)
  }

  xformVec(x: number, y: number, t: Array<number>): Point {
      var dx = x * t[0] + y * t[2]
      var dy = x * t[1] + y * t[3]
      return new Point(dx, dy)
  }

  vectorMagnetude(x: number, y: number): number{
      return Math.sqrt(x * x + y * y)
  }

  vectorRatio(ux: number, uy: number, vx: number, vy: number) {
      return (ux * vx + uy * vy) / (this.vectorMagnetude(ux, uy) * this.vectorMagnetude(vx, vy))
  }

  vectorAngle(ux: number, uy: number, vx: number, vy: number): number {
      var r = this.vectorRatio(ux, uy, vx, vy)
      if (r < -1.0) r = -1.0
      if (r > 1.0) r = 1.0
      return ((ux * vy < uy * vx) ? -1.0 : 1.0) * Math.acos(r)
  }

}