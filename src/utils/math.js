// src/utils/math.js

// Yeh function 3 points (p1, p2, p3) ke beech ka angle nikalega
// p2 woh point hai jahaan angle ban raha hai (jaise, knee)
export function calculateAngle(p1, p2, p3) {
  // Angle ka formula: atan2(y3 - y2, x3 - x2) - atan2(y1 - y2, x1 - x2)
  const angle =
    Math.atan2(p3.y - p2.y, p3.x - p2.x) -
    Math.atan2(p1.y - p2.y, p1.x - p2.x);

  // Angle ko radians se degrees mein convert karein
  let degrees = (angle * 180) / Math.PI;

  // Ensure angle is positive (0 to 360)
  degrees = Math.abs(degrees);

  if (degrees > 180) {
    degrees = 360 - degrees; // Humein hamesha chota waala angle chahiye
  }

  return degrees;
}