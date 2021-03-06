var Scene = function(gl) {
	this.vsQuad = new Shader(gl, gl.VERTEX_SHADER, "quad_vs.essl");
	this.fsTrace = new Shader(gl, gl.FRAGMENT_SHADER, "trace_fs.essl");
	this.program = new Program(gl, this.vsQuad, this.fsTrace);
	this.quadGeometry = new QuadGeometry(gl);

	this.timeAtLastFrame = new Date().getTime();

	this.background = new TextureCube(gl, [
		"media/posx.jpg",
		"media/negx.jpg",
		"media/posy.jpg",
		"media/negy.jpg",
		"media/posz.jpg",
		"media/negz.jpg"]);
	
	this.camera = new PerspectiveCamera();
	
	this.matcap = new Texture2D(gl, "media/matcap.jpg");
};

Scene.prototype.update = function(gl, keysPressed) {
	//jshint bitwise:false
	//jshint unused:false
	var timeAtThisFrame = new Date().getTime();
	var dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
	this.timeAtLastFrame = timeAtThisFrame;
	
	this.camera.move(dt, keysPressed);

	// clear the screen
	gl.clearColor(0.6, 0.0, 0.3, 1.0);
	gl.clearDepth(1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// uniform parameterek bekotese
	this.program.background.set(this.background);
	this.program.rayDirMatrix.set(this.camera.rayDirMatrix);
	this.program.viewMat.set(this.camera.viewMatrix);
	this.program.eye.set(this.camera.position);
	this.program.matcap.set(this.matcap);

	this.program.commit();
	this.quadGeometry.draw();
};


