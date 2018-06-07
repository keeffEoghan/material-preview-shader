Math.PIR = 180 / Math.PI;
Math.PID = Math.PI / 180;
Math.radiansToDegrees = function(radians) {
  return radians * Math.PIR;
};
Math.degreesToRadians = function(degrees) {
  return degrees * Math.PID;
};
