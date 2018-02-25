var gravity = -0.3;
var flaps;
var pipes = [];
var earrubs = [];
var terminalVelocity = 10;
var canvasHeight = 600;
var canvasWidth = 1200;
var debug = false;
var score = 0;

var earimg;
var sweat;
var earsimgs=[];
var flapsimgs = [];
var title;
var mainMenu = true;

function preload() {
  earimg = loadImage('ear.png');
  sweat = loadImage('sweat.png');
  flapsimgs['normal'] = loadImage('normal.png');
  flapsimgs['happy'] = loadImage('happy.png');
  flapsimgs['oof'] = loadImage('oof.png');
  earsimgs['up'] = loadImage('earsup.png');
  earsimgs['down'] = loadImage('earsdown.png');
  title = loadImage('title.png');
}
function Flaps()
{
	this.iframes = false;
	this.x = 200;
	this.y = windowHeight/2;	
	this.w = 45;
	this.h = 50;
	this.velocity = 0;
	this.lift = 10;
	this.stamina = 100;
	this.img = flapsimgs['normal'];
	this.ears = earsimgs['down'];
	this.happy = false;

	this.draw = function()
	{
		if (this.iframes)
		{
			this.img = flapsimgs['oof'];
		}
		else if (this.happy)
		{
			this.img = flapsimgs['happy'];
		}
		else
		{
			this.img = flapsimgs['normal'];
		}
		if (this.flapping)
		{
			this.ears = earsimgs['down'];
		}
		else
		{
			this.ears = earsimgs['up'];
		}
		strokeWeight(3);
		stroke("black");
		image(this.img, this.x,this.y,this.w,this.h);
		image(this.ears, this.x,this.y,this.w,this.h);
		if (this.stamina < 60)
		{
			image(sweat,this.x,this.y,this.w,this.h);
		}
		if (this.stamina < 0)
		{
			this.stamina = 0;
		}
		noFill();
		rect(canvasWidth/2-200, 50,100*4,40);
		//Draw the stamina bar
		if (this.stamina > 0)
		{			
			if (this.stamina > 60)
			{
				fill('#97E658');
			}
			else if (this.stamina > 10)
			{
				fill('#CAFF3A');
			}
			else if (this.stamina >0)
			{
				fill('#FF2E2E');
			}
			noStroke();
			rect(canvasWidth/2-200+3, 52,this.stamina*4 -5,37);
			fill("black")
			noStroke();
			textAlign(CENTER);
			textFont("Helvetica");
			textSize(28);
			text("Flap Energy",canvasWidth/2,80);
		}
		else
		{
			fill("black")
			noStroke();
			textAlign(CENTER);
			textFont("Helvetica");
			textSize(28);
			text("Too tired to flap!", canvasWidth/2,80);
		}
	}
	this.flap = function()
	{		
		if (this.stamina > 60)
		{
			this.velocity+=this.lift;
			this.stamina-=2;	
			this.flapping = true;
		}
		else if (this.stamina > 0)
		{
			//Tired flap
			this.velocity+=this.lift-3;
			this.stamina-=1;
			this.flapping = true;
		}
		else
		{
			//Too tired to flap ;-;
			this.iframes = true;
		}
		
		setTimeout(function(){
			flaps.flapping = false;
		},200);
	}
	this.hurt = function()
	{
		if (!this.iframes)
		{
			this.stamina -= 20;
		}		
	}
}
function Pipe()
{
	this.x = canvasWidth;
	this.velocity = -5;
	this.gapSize = random(100,200);
	this.pipeSize = 50;
	this.gap = random(canvasHeight - this.gapSize);
	this.draw= function(){
		this.x+=this.velocity;
		fill('#2CC230');
		stroke("black");
		rect(this.x,0,this.pipeSize,this.gap);
		rect(this.x,this.gap+this.gapSize,this.pipeSize,canvasHeight-this.gap);
	}
	this.pushBack = function()
	{
		this.velocity = 20;		
		flaps.iframes = true;
	}
	this.pushForward = function()
	{
		this.velocity = -15;
		flaps.iframes = true;
	}
	this.pushStop = function()
	{
		this.velocity = -5;
		flaps.iframes = false;		
	}
	pipes.push(this);
}
function setup()
{
	createCanvas(canvasWidth,canvasHeight);		
	//Init the flappy boye
	flaps = new Flaps();
	//init a pipe
	new Pipe();
	new Pipe();
	pipes[0].x=canvasWidth*1.5
}
var pipeCount = 0;
var mainWingDown = false;
function draw()
{
	clear();
	background('#7676F2');	
	if (mainMenu)
	{		
		image(title,canvasWidth/2-title.width/2,canvasHeight/4 - title.height/2)		
		var img;
		if (frameCount %6 == 0)
		{
			mainWingDown = !mainWingDown;
		}
		img = mainWingDown?earsimgs['up']:earsimgs['down'];

		image(flapsimgs['happy'],canvasWidth/2 - flapsimgs['happy'].width/2,canvasHeight-35-flapsimgs['happy'].height)		
		//Ground
		fill('#48CD00');
		strokeWeight(3);
		rect(-5,canvasHeight-50,canvasWidth+5,50)
		//Wings
		image(img,canvasWidth/2 - flapsimgs['happy'].width/2,canvasHeight-35-flapsimgs['happy'].height);
		//Start
		var str = "Press SPACE to start";
		textFont('monospace');
		textAlign(CENTER);
		fill('white');
		noStroke();
		textSize(22);
		text(str,canvasWidth/2,canvasHeight/2+50);
	}
	else
	{
		for (i in pipes)
		{
			pipes[i].draw();
		}
		for (i in earrubs)
		{
			earrubs[i].draw();
		}
		if (!debug)
		{
			//Gravity
			flaps.velocity+=gravity
			//Step
			flaps.y-=flaps.velocity; //Velocity - Up is positive.
			//Air resistance
			flaps.velocity *0.7;
		}
		else
		{
			flaps.x = mouseX;
			flaps.y = mouseY;
			stroke("red");
			noFill();
			rect(flaps.x,flaps.y,flaps.w,flaps.h);
		}
		flaps.draw();
		//Stop the birdy from leaving the screen unless he's out of stamina
		if (flaps.y <0)
		{
			flaps.y = 0
			flaps.velocity = 0;		
		}
		if (flaps.y >= height  && flaps.stamina > 0)
		{
			flaps.y = height-5;
			flaps.velocity =10;
			flaps.hurt();
		}
		else if (flaps.stamina == 0 && flaps.y >= height)
		{
			gameover();
		}
		//Collision check!
		for (i in earrubs)
		{
			var earrub = earrubs[i];		
			var xrange = valueInRange(flaps.x,earrub.x,earrub.x+earrub.w) || valueInRange(earrub.x,flaps.x,flaps.x+flaps.w);
			var yrange = valueInRange(flaps.y,earrub.y,earrub.y+earrub.h) || valueInRange(earrub.y,flaps.y,flaps.y+flaps.h);
			if (xrange && yrange && !earrub.collected)
			{
				//Remove the earrub
				earrub.collected = true;
				score+=5;
				setTimeout(function(){
					earrub.end();
					flaps.happy = false;
				},1000);
				//Restore some stamina
				flaps.stamina+=25;
				if (flaps.stamina >100)
				{
					flaps.stamina = 100;
				}
				flaps.happy = true;
			}
		}
		for (i in pipes)
		{
			var pipe = pipes[i];
			var xrange = valueInRange(flaps.x,pipe.x,pipe.x+pipe.pipeSize) || valueInRange(pipe.x,flaps.x,flaps.x+flaps.w);
			var inGap = (flaps.y > pipe.gap && flaps.y+flaps.h < pipe.gap+pipe.gapSize);
			if (xrange && !inGap)
			{
				flaps.hurt();
				if (flaps.x+flaps.w/2 >= pipe.x+pipe.pipeSize/2)
				{
					for (j in pipes)
					{
						pipes[j].pushForward();
					}
					for (j in earrubs)
					{
						earrubs[j].pushForward();
					}
					if (flaps.y < pipe.gap+flaps.h)
					{
						flaps.velocity = -5;
					}
					else
					{
						flaps.velocity = 5;
					}
				}
				else
				{	
					if (flaps.x+flaps.w/2 > pipe.x)
					{
						if (flaps.y < pipe.gap+flaps.h)
						{
							flaps.velocity = -5;
						}
						else
						{
							flaps.velocity = 5;
						}
					}
					for (j in pipes)
					{
						pipes[j].pushBack();
					}
					for (j in earrubs)
					{
						earrubs[j].pushBack();
					}
				}
				setTimeout(function(){
					for (j in pipes)
					{
						pipes[j].pushStop();
					}
					for (j in earrubs)
					{
						earrubs[j].pushStop();
					}
				},300);
				break;
			}
		}
		//Add a pipe every time one goes off the edge.
		for (j in pipes)
		{
			if (pipes[j].x+pipes[j].pipeSize<0)
			{
				pipes.splice(j,1);
				new Pipe();
				pipeCount++;
				break;
			}	
		}
		//Add an earrub every second pipe.
		if (pipeCount % 4 == 0 && pipeCount != 0)
		{
			new EarRub(canvasWidth+300);
			pipeCount++;
		}
		//Score
		fill('white')
		stroke("black");
		text("Score: "+score,canvasWidth/2,40);
	}
}
function keyPressed()
{
	if (key == ' ')
	{
		if (mainMenu)
		{
			mainMenu = false;
		}
		else
		{		
			//Space was pressed.
			flaps.flap();	
		}
	}
	else if (key =='q')
	{		
		debug= !debug;
	}
}
function valueInRange(val,a,b)
{
	return (val > a && val < b);
}
function gameover()
{
	mainMenu = true;
	pipes = [];
	earrubs = [];
	flaps = new Flaps();
	//init a pipe
	new Pipe();
	new Pipe();
	pipes[0].x=canvasWidth*1.5
	score = 0;
}
function EarRub(x)
{
	this.finished = false;
	this.text="Got ear rubs!"
	this.x = x;
	this.w = 64;
	this.h = 64;
	this.collected = false;
	var padding = 50; //Prevent it from spawning on the extremes of the screen.
	this.y = random(padding, canvasHeight-padding);
	this.velocity = -5;

	this.draw = function(){
		this.x += this.velocity;

		if (!this.collected)
		{
			image(earimg,this.x,this.y);	
		}
		else if (!this.finished)
		{
			this.velocity = 0;
			fill('#FFE972');
			textSize(18)
			textFont('Helvetica');
			text(this.text, this.x,this.y);
		}
	}
	this.pushBack = function()
	{
		this.velocity = 20;		
		flaps.iframes = true;
	}
	this.pushForward = function()
	{
		this.velocity = -15;
		flaps.iframes = true;
	}
	this.pushStop = function()
	{
		this.velocity = -5;
		flaps.iframes = false;
	}
	this.end = function()
	{
		this.finished = true;
	}
	earrubs.push(this);
}