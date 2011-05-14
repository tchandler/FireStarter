/**
 * @author Zoho
 * A lot of this code is boilerplate and/or reused from various sources
 */

//Doug Crockford's Inheritance system for non-ecma5 browsers
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
// 
// if(typeof Math.clamp !== 'function') {
	// Math.clamp = function (value, min, max) {
		// return Math.max(0, Math.min(value, 100));
	// };
// }
