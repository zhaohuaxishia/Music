let sound
let button
let fft,waveform
let stars = []
function preload(){
  sound = loadSound("music.mp3")
}
function setup() {
  createCanvas(windowWidth, windowHeight,WEBGL);
  colorMode(HSB)
  button = createButton('播放');
  button.position(width/2-30, height*0.9);
  button.mousePressed(playSound);

  button = createButton('暂停');
  button.position(width/2+30, height*0.9);
  button.mousePressed(stopSound);

  fft = new p5.FFT()
  waveform = fft.waveform()
  console.log(waveform)

}

function draw() {
  background(0);
  //鼠标切换视角
  orbitControl()
  waveform = fft.waveform()
  rotateX(PI/3)
  translate(0,height*0.1)

  let r = width*0.3
  for(let a=0; a<2*PI; a+=PI/25){
    let index = int(map(a,0,2*PI,0,1024))
    let curH = abs(300*waveform[index])
    let x = r*cos(a)
    let y = r*sin(a)
    push()
    translate(x,y,curH/2)
    rotateX(PI/2)
    let c1 = color(119, 139, 235)
    let c2 = color(248, 165, 194)
    let rate = map(a,0,2*PI,0,0.9)
    let col = lerpColor(c1,c2,rate)
    stroke(col)
     //圆柱体
    cylinder(10,5 + curH)
    pop()

    //创建粒子的数量随振幅的大小变化
    for(let k = 0; k<2; k++){
      if(random(0.01,1)<waveform[index]){
        stars.push(new star(x,y,5+curH,col))
      }
    }
  }
 
  for(let i=0; i<stars.length; i++ ){
    stars[i].move()
    stars[i].show()
    if(stars[i].z>300){
      stars.splice(i,1)
    }
  }

}

//创建粒子
function star(x,y,z,col){
  this.x = x+random(-2,2)
  this.y = y+random(-2,2)
  this.z = z
  this.col = col
  this.life = 500
  this.speedx = random(-0.3,0.3)
  this.speedy = random(-0.3,0.3)
  this.speedz = 0.05 + (z - 5)/15

  this.move = function(){
    this.z += this.speedz
    this.x += this.speedx
    this.y += this.speedy
    this.life -= 1
  }

  this.show = function(){
    push()
    let a = map(this.life,0,500,0,1)
    stroke(hue(this.col),saturation(this.col),brightness(this.col))
    // stroke(255,0,1)

    strokeWeight(1)
    point(this.x,this.y,this.z)
    pop()
  }
}


function playSound(){
  if(!sound.isPlaying()){
    sound.play()
  }
}

function stopSound(){
  if(sound.isPlaying()){
    sound.pause()
  }
}