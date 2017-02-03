
	function clear() {
		ctx.clearRect(0,0,c.width, c.height); 
	}

	function drawImage(src){
		var img = new Image(); 
		img.src = src; 
		img.onload = function() {
			ctx.drawImage(img, 50, 60, c.width - 100, c.height - 100);
		}; 
		return img;
	}

	function drawExercises(){
		ctx.beginPath(); 
		ctx.moveTo(10,10); 
		ctx.lineTo(50,50); 
		ctx.lineTo(50,10); 
		ctx.lineTo(10,10); 
		ctx.fill(); 

		ctx.beginPath(); 
		ctx.moveTo(50,50); 
		ctx.lineTo(50,90); 
		ctx.lineTo(90,90); 
		ctx.lineTo(50,50); 
		ctx.stroke(); 
		ctx.strokeRect(90, 90, 10, 10);
		ctx.beginPath(); 
		ctx.moveTo(92,92); 
		ctx.lineTo(98,92); 
		ctx.lineTo(98,98); 
		ctx.lineTo(92,92); 
		ctx.fill(); 
	}

	function drawText(strokeColor, fillColor, font, text, lineWidth) {
		ctx.strokeStyle = strokeColor; 
		ctx.fillStyle = fillColor; 
		ctx.font = font;
		ctx.restore(); 
		ctx.lineWidth = lineWidth; 
		var cv = text; 
		var w = ctx.measureText(cv);
		ctx.fillText(cv, (c.width - w.width)/2, 50); 
		ctx.strokeText(cv, (c.width - w.width)/2, 50); 
	}
