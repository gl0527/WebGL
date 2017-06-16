var Scene = function(gl) {
	this.vsQuad = new Shader(gl, gl.VERTEX_SHADER, "quad_vs.essl");
	this.fsTrace = new Shader(gl, gl.FRAGMENT_SHADER, "trace_fs.essl");
	this.program = new Program(gl, this.vsQuad, this.fsTrace);
	
	this.fsShow = new Shader(gl, gl.FRAGMENT_SHADER, "show_fs.essl"); 
	this.showProgram = new Program(gl, this.vsQuad, this.fsShow);
	
	this.frameBuffers = [gl.createFramebuffer(), gl.createFramebuffer()];
    this.rtts = [gl.createTexture(), gl.createTexture()];
    for(var i=0; i<2; i++) {
		gl.bindTexture(gl.TEXTURE_2D, this.rtts[i]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, canvas.width, canvas.height, 0, gl.RGB, gl.UNSIGNED_BYTE, null);

		gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers[i]);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.rtts[i], 0);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
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
	this.randomTex = new Texture2D(gl, "media/rnd.png");
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

	// uniform parameterek bekotese: gomb elvagva ellipszoiddal
	this.program.quadrics[0].set(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -1);
	
	this.program.quadrics[1].set( // paratlan indexek: clipperek
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, -1).scale(0.5, 2, 0.9);
		
	// padlo
	this.program.quadrics[2].set(
		0.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.5,
		0.0, 0.0, 0.0, 0.0,
		0.0, 0.5, 0.0, 0.0);
	 this.program.quadrics[3].set(
		1.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, -10.0);
	
	// oldalso falak
	this.program.quadrics[4].set(
		1.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, -10.0);
		
	this.program.quadrics[5].set(
		0.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, -10.0);
		
	this.program.quadrics[6].set(
		0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, -10.0);
		
	this.program.quadrics[7].set(
		0.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 0.0, 0.0,
		0.0, 0.0, 0.0, -10.0);
	
	this.program.materials[0].set(0.3, 0.3, 0.3, 0.0);
	this.program.materials[1].set(0.3, 0.3, 0, 0);
	this.program.materials[2].set(0, 0.3, 0.3, 0);
	this.program.materials[3].set(0.3, 0, 0.3, 0);	
	
	this.program.background.set(this.background);
	this.program.rayDirMatrix.set(this.camera.rayDirMatrix);
	this.program.eye.set(this.camera.position);
	this.program.randomTex.set(this.randomTex);
	this.program.frameCount.set(this.camera.frameCount);
	
	this.camera.frameCount += 1.0;
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers[0]);
	this.program.prevImage.set(this.rtts[1]);
	
	this.program.commit();
	this.quadGeometry.draw();
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	this.showProgram.texture.set(this.rtts[0]);
	this.showProgram.commit(); 
	this.quadGeometry.draw();
	
	this.frameBuffers.reverse();
	this.rtts.reverse();
};


