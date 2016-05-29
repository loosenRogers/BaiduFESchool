window.onload = function(){
	// 进行事件绑定
	addEventHandler(leftIn,'click',leftInhandler);
	addEventHandler(rightIn,'click',rightInhandler);
	addEventHandler(leftOut,'click',leftOuthandler);
	addEventHandler(rightOut,'click',rightOuthandler);
	// addEventHandler(randomSet,'click',randomSethandler);
	addEventHandler(bubbSort,'click',bubbleSortHandler);
	addEventHandler(initLoad,'click',loadQueue);
	addEventHandler(queueBox,'click',delHandler);
}

var textIn = document.querySelector("input"),
	btnGrp = document.querySelectorAll("button"),
	queueBox = document.querySelector(".showWindow");

var leftIn = btnGrp[0],
	rightIn = btnGrp[1],
	leftOut = btnGrp[2],
	rightOut = btnGrp[3],
	bubbSort = btnGrp[4],
	initLoad = btnGrp[5];

// 全局数组
var numArr = []; 
var framesArray = [];


// 渲染
function render(arr){
	textIn.value = '';
	queueContent = '';
	// 如果传入数组，则render传入的而数组，否则render numArr数组
	var arrTmp = arr || numArr;
	// 不能使用for in 输出数组，它会输出排序后的数组
	for(var i=0;i<arrTmp.length;i++){
		queueContent += '<div style="height: '+arrTmp[i]*2+'px;"><span>'+arrTmp[i]+'</span></div>';
	}
	queueBox.innerHTML = queueContent;
}

// 输入检测
function inputCheck(){
	var textValue = textIn.value;
	if(textValue.length>0)
	{
		// 去掉前后空格
		var valueTrim = parseInt(textValue,10);
		if(!isNaN(valueTrim))
		{
			if(valueTrim>=10 && valueTrim<=100)
				return valueTrim;
		}
	}
	else
	{
		alert("Please input the number!");
		return false;
	}
}

function bubbleSort(){
	var tmp;
	for(var i=0;i<numArr.length-1;i++)
		for(var j=0;j<numArr.length-1-i;j++)
		{
			if(numArr[j]>numArr[j+1])
			{
				tmp = numArr[j];
				numArr[j] = numArr[j+1];
				numArr[j+1] = tmp;
				// 每次发生交换，都去存一个当前的数组
				framesArray.push(numArr.concat());
			}
		}
}

function loadQueue(){
	numArr = [];
	var num = 30;
	for(var i=0;i<40;i++){
		// 随机产生10~100之间的数字
		numArr.push(Math.floor(Math.random()*90 + 10));
	}
	render();
}

// 点击事件
function leftInhandler(){
	var result = inputCheck();
	if(result){
		if(numArr.length<60){
			numArr.unshift(result);
		render();
		}
		else
			alert("Reach Max Capacity!");
	}
}

function rightInhandler(){
	var result = inputCheck();
	if(result){
		if(numArr.length<60){
			numArr.push(result);
		render();
		}
		else
			alert("Reach Max Capacity!");
	}
}

function leftOuthandler(){
	if(numArr.length>0)
	{
		numArr.shift();
		render();
	}
}

function rightOuthandler(){
	if(numArr.length>0)
	{
		numArr.pop();
		render();
	}
}

function delHandler(event){
	var e = event || window.event;
	// 获取目标节点
	var target = e.target || e.srcElement;
	console.log(target);
	if(target.className !== "showWindow"){
		var index = Array.prototype.indexOf(target.parentNode.childNodes,target);
		numArr.splice(index,1);
		target.parentNode.removeChild(target);
	}
}

function bubbleSortHandler(){
	bubbleSort();
	if(framesArray.length == 0)
		return;
	// 开启定时器，间歇性的render
	var timer = setInterval(repaint,40);
	// 如果数组为空，则shift返回undefined，则frame为空数组
	function repaint(){
		var frame = framesArray.shift() || [];
		if(frame.length>0){
			render(frame);
		}
		else
		{
			clearInterval(timer);
			return;
		}			
	}

}

// 通用的事件绑定函数
function addEventHandler(element,type,handler){
  if(element.addEventListener){ 
    element.addEventListener(type,handler,false);
  }
  else if(element.attachEvent){
    element.attachEvent("on"+type,handler);
  }
  else
  {
    element["on"+type] = handler;
  }
}