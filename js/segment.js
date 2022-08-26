


class Point {

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

}

class Segment {

	constructor(startPoint, endPoint) {
		this.startPoint = startPoint;
		this.endPoint = endPoint;
	}

	getStartPoint() {
		return this.startPoint;
	}

	getEndPoint() {
		return this.endPoint;
	}

	setStartPoint(newStartPoint) {
		this.startPoint = newStartPoint;
	}

	setEndPoint(newEndPoint) {
		this.endPoint = newEndPoint;
	}

	dX() {
		return Math.abs(this.getEndPoint().x - this.getStartPoint().x);
	}

	dY() {
		return Math.abs(this.getEndPoint().y - this.getStartPoint().y);
	}

	getLength() {
 		return Math.sqrt(Math.pow((this.dX()), 2) + Math.pow((this.dY()), 2));
	}

	// - Max value = 180 degrees
	getAngle() {
		if (this.getLength() === 0) { return 0 };
		if (this.getEndPoint().y >= this.getStartPoint().y) {
			const arcsin = Math.asin((this.dX() / this.getLength()));
			return 180 / (Math.PI / arcsin);
		} else {
			const arcsin = Math.asin((this.dY() / this.getLength()));
			return 90 + (180 / (Math.PI / arcsin));
		}
	}

	// - Only for x >= 0, y >= 0
	getMiddlePoint() {
		const smallestY = this.getAngle() > 0 ? this.getStartPoint().y : this.getEndPoint().y;
		return new Point(this.getStartPoint().x + (this.dX() / 2), smallestY + (this.dY() / 2));
	}

}







































