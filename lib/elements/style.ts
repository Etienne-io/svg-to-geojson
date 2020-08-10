export default class Style {

  fillColor: String
  strokeColor: String
  fillOpacity: number
  strokeOpacity: number
  strokeWidth: number
  strokeLineCap: String
  strokeLineJoin: String

  constructor () {
      
  }

  validate() {
      if (this.strokeColor != null) {
        if (this.strokeOpacity == null) {
          this.strokeOpacity = 1.0
        }
        if (this.strokeWidth == null) {
          this.strokeWidth = 1.0
        }
      } else {
        this.strokeColor = "#ffffff"
        this.strokeOpacity = 0.0
        this.strokeWidth = 0.0
      }
      if (this.fillColor != null) {
        if (this.fillOpacity == null) {
          this.fillOpacity = 1.0
        }
      }
  }

  merge(style: Style): Style {
      let builder = new StyleBuilder()
              .fillColor(this.fillColor)
              .fillOpacity(this.fillOpacity)
              .strokeColor(this.strokeColor)
              .strokeOpacity(this.strokeOpacity)
              .strokeWidth(this.strokeWidth)
              .strokeLineCap(this.strokeLineCap)
              .strokeLineJoin(this.strokeLineJoin)
      if (style.fillColor != null) {
          builder.fillColor(style.fillColor)
      }
      if (style.fillOpacity != null) {
          builder.fillOpacity(style.fillOpacity)
      }
      if (style.strokeColor != null) {
          builder.strokeColor(style.strokeColor)
      }
      if (style.strokeOpacity != null) {
          builder.strokeOpacity(style.strokeOpacity)
      }
      if (style.strokeWidth != null) {
          builder.strokeWidth(style.strokeWidth)
      }
      if (style.strokeLineCap != null) {
          builder.strokeLineCap(style.strokeLineCap)
      }
      if (style.strokeLineJoin != null) {
          builder.strokeLineJoin(style.strokeLineJoin)
      }

      return builder.build()
  }

}

class StyleBuilder {

  private _style: Style

  constructor() {
    this._style = new Style()
  }

  fillColor(fillColor: String): StyleBuilder {
      this._style.fillColor = fillColor
      return this
  }

  strokeColor(strokeColor: String): StyleBuilder {
      this._style.strokeColor = strokeColor
      return this
  }

  fillOpacity(fillOpacity: number): StyleBuilder {
      this._style.fillOpacity = fillOpacity
      return this
  }

  strokeOpacity(strokeOpacity: number): StyleBuilder {
      this._style.strokeOpacity = strokeOpacity
      return this
  }

  strokeWidth(strokeWidth: number): StyleBuilder {
      this._style.strokeWidth = strokeWidth
      return this
  }

  strokeLineCap(strokeLineCap: String): StyleBuilder {
      this._style.strokeLineCap = strokeLineCap
      return this
  }

  strokeLineJoin(strokeLineJoin: String): StyleBuilder {
      this._style.strokeLineJoin = strokeLineJoin
      return this
  }

  build(): Style {
      return this._style
  }

}

export { StyleBuilder }