// cubic-bezier-spring.js

/**
 * Cubic Bezier Spring easing function
 * Equivalent to cubic-bezier(0.175, 0.885, 0.32, 1.275)
 * @param {number} t - The time parameter (0 to 1)
 * @returns {number} The eased value
 */
export function cubicBezierSpring(t) {
	// Implementation of cubic-bezier(0.175, 0.885, 0.32, 1.275)
	const x1 = 0.175;
	const y1 = 0.885;
	const x2 = 0.32;
	const y2 = 1.275;

	function sampleCurveX(t) {
		return (
			(1 - t) ** 3 * 0 + 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3 * 1
		);
	}

	function sampleCurveY(t) {
		return (
			(1 - t) ** 3 * 0 + 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3 * 1
		);
	}

	function solveCurveX(x) {
		let t0 = 0;
		let t1 = 1;
		let t2 = x;
		let x2;
		const epsilon = 1e-7;

		for (let i = 0; i < 8; i++) {
			x2 = sampleCurveX(t2) - x;
			if (Math.abs(x2) < epsilon) return t2;
			let d2 =
				(3 * (1 - t2) ** 2 * (x1 - 0) +
					6 * (1 - t2) * t2 * (x2 - x1) +
					3 * t2 ** 2 * (1 - x2)) /
				6;
			if (Math.abs(d2) < 1e-6) break;
			t2 = t2 - x2 / d2;
		}

		while (t0 < t1) {
			x2 = sampleCurveX(t2);
			if (Math.abs(x2 - x) < epsilon) return t2;
			if (x > x2) t0 = t2;
			else t1 = t2;
			t2 = (t1 - t0) * 0.5 + t0;
		}

		return t2;
	}

	return sampleCurveY(solveCurveX(t));
}
