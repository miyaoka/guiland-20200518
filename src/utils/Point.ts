export class Point {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  getDistance(pt: Point): number {
    return (this.x - pt.x) ** 2 + (this.y - pt.y) ** 2
  }
}
