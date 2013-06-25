window.addEventListener("load",function() {
	
	if (!navigator.battery)
		return alert("Sorry, your browser doesn't support the battery API.");
	
	var canvas = document.createElement("canvas"),
		context = canvas.getContext("2d");
		batteryHistory = [],
		startTime = Date.now();
	
	document.body.appendChild(canvas);
	canvas.style.position = "absolute";
	canvas.style.top = "0px";
	canvas.style.left = "0px";
	canvas.width = window.innerWidth;
	canvas.height = window.innerWidth;
	
	function getBatteryStatus() {
		batteryHistory.push({
			"level": navigator.battery.level,
			"charging": navigator.battery.charging,
			"chargingtime": navigator.battery.chargingTime,
			"dischargingtime": navigator.battery.dischargingTime,
			"time": Date.now() - startTime
		});
		
		renderCanvas();
	}
	
	getBatteryStatus();
	setInterval(renderCanvas,33);
	navigator.battery.addEventListener("levelchange",getBatteryStatus);
	
	window.addEventListener("resize",renderCanvas);
	
	function renderCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		var tickWidth = canvas.width/10,
			tickHeight = canvas.height/10;
		
		context.strokeStyle = "rgba(0,0,0,0.2)";
		context.strokeWidth = 1;
		
		var x, y;
		
		for (var tick = 0; tick <= 10; tick ++) {
			x = (tick*tickWidth|0)+0.5;
			y = (tick*tickHeight|0)+0.5;
			
			context.beginPath();
			context.moveTo(x,0);
			context.lineTo(x,canvas.height);
			context.stroke();
			
			context.beginPath();
			context.moveTo(0,y);
			context.lineTo(canvas.width,y);
			context.stroke();
			
		}
		
		context.strokeStyle = "red";
		context.strokeWidth = 2;
		context.beginPath();
		
		var totalTime = Date.now()-startTime;
		batteryHistory.forEach(function(dataPoint) {
			context.lineTo(
				(dataPoint.time/totalTime) * canvas.width,
				canvas.height - (dataPoint.level * canvas.height)
			);
		});
		
		context.lineTo(
			canvas.width,
			canvas.height - (batteryHistory[batteryHistory.length-1].level * canvas.height)
		);
		
		context.stroke();
	}
});