var CANVAS_WIDTH = Math.min( 800 , $(window).width() - 20)
var CANVAS_HEIGHT = CANVAS_WIDTH
var MAX_LINEWIDTH = Math.round(CANVAS_WIDTH / 30);
var MIN_LINEWIDTH = 1
var MAX_SPEED = 10
var MIN_SPEED = 1
var isMouseDown = false
var lastLoc = {x:0, y: 0}
var lastTimestamp = 0
var lastLineWidth = -1
let strokeColor = 'black'

var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

// 清除内容
$("#clear").on('click' , function(){
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  drawGrid()
})

// 选择颜色
$(".color_btn").on('click' , function(){
  $(".color_btn").removeClass('active')
  $(this).addClass('active')
  strokeColor = $(this).css('background-color')
})

$('.controller').css('width', CANVAS_WIDTH + "px")
canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT

drawGrid()

function beginStorke(point){
  isMouseDown = true
  // console.log('onmousedown')
  lastLoc = windwoToCanvas(point.x, point.y)
  lastTimestamp = new Date().getTime()
}

function endStorke() { 
  isMouseDown = false
 }

function moveStorke(point){
  var curLoc = windwoToCanvas(point.x, point.y)
  var curTimestamp = new Date().getTime()
  var s = calcDistance(lastLoc , curLoc )
  var t = curTimestamp - lastTimestamp 
  var lineWidth = calcLineWidth(t, s)


  // draw
  context.beginPath()
  context.moveTo( lastLoc.x, lastLoc.y)
  context.lineTo( curLoc.x, curLoc.y)
  context.strokeStyle = strokeColor
  context.lineWidth = lineWidth

  // 去掉粗线条引起线段之前的空白
  context.lineCap = 'round' 
  context.lineJoin = 'round'
  context.stroke()

  lastLoc = curLoc
  lastTimestamp = curTimestamp
  lastLineWidth = lineWidth

}

canvas.onmousedown = function(e) {
  e.preventDefault();
  beginStorke({x: e.clientX, y: e.clientY})
}

canvas.onmouseup = function(e) {
  e.preventDefault();
  // console.log('onmouseup')
  endStorke()
}

canvas.onmousemove = function(e) {
  e.preventDefault();
  if( isMouseDown ){
    // console.log('onmousemove')
    moveStorke({x: e.clientX , y: e.clientY})
  }
}

canvas.onmouseout = function(e) {
  e.preventDefault();
  endStorke()
  // console.log('onmouseout')
}

// 添加移动端触碰事件

canvas.addEventListener('touchstart', function(e){
  e.preventDefault();
  var touch  = e.touches[0]
  beginStorke({x: touch.pageX, y: touch.pageY})
})
canvas.addEventListener('touchmove', function(e){
  e.preventDefault();
  if( isMouseDown ){
    // console.log('touchmove')
    var touch  = e.touches[0]
    moveStorke({x: touch.pageX, y: touch.pageY})
  }
})
canvas.addEventListener('touchend', function(e){
  e.preventDefault();
  endStorke()
})

// 绘制米字格
function drawGrid() {

  context.save()

  context.beginPath()
  context.strokeStyle = 'rgb(230, 11 ,9)'
  context.moveTo(3, 3)
  context.lineTo(CANVAS_WIDTH - 3, 3)
  context.lineTo(CANVAS_WIDTH - 3, CANVAS_HEIGHT - 3)
  context.lineTo(3, CANVAS_HEIGHT - 3)

  context.lineWidth = 6
  context.closePath()
  context.stroke()


  context.beginPath()
  context.moveTo(0 , 0)
  context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT)


  context.moveTo(CANVAS_WIDTH , 0)
  context.lineTo(0, CANVAS_HEIGHT)


  context.moveTo(0 , CANVAS_HEIGHT / 2)
  context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2)


  context.moveTo(CANVAS_WIDTH / 2 , 0)
  context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)

  context.lineWidth = 1 
  context.stroke()


  
  context.restore()
}


// 计算鼠标点击位置相对于 canvas的距离
function windwoToCanvas(x, y){
  var bbox = canvas.getBoundingClientRect()
  return {x: Math.round(x - bbox.left), y: Math.round(y - bbox.top)}
}

// 计算两个点之间的路程
function calcDistance(loc1, loc2){
  return Math.sqrt( (loc1.x - loc2.x) * (loc1.x -loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y) )
}

// 根据时间路程计算 lineWidth

function calcLineWidth(t, s){
  var v = s/t
  var resultLineWidth 
  if( v <= MIN_LINEWIDTH){
    resultLineWidth = MAX_LINEWIDTH
  } else if(v >= MAX_SPEED){
    resultLineWidth = MIN_LINEWIDTH
  } else{
    resultLineWidth = MAX_LINEWIDTH - (v-MIN_SPEED)/(MAX_SPEED-MIN_SPEED)*(MAX_LINEWIDTH - MIN_LINEWIDTH)
  }
  if(lastLineWidth == -1){
    return resultLineWidth
  }else{
    return lastLineWidth*2/3 + resultLineWidth*1/3
  }
  
}