/**
 * @author Zoho
 */

var ONE_PIXEL_OFFSET = 0.5;

var FSGame = ( function() {
	var FS = new FireStarter;
	FS.init();
	return FS;
}());

var bb = new BaseBlock(0, 0, FSGame);
var fib = new FireBlock(0, 0, FSGame);
var flb = new FlammableBlock(0, 0, FSGame);