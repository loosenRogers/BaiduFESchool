var $ = function(ele){
	return document.querySelector(ele);
}

var tagIn = $(".tagInput");
var tagUl = $(".tagsList");
var hobbiesIn = $("textarea");
var btn = $("button");
var hobbyUl = $(".hobbiesLIst");

var tagsQueue = [];
var hobbiesQueue = [];

function tagInsertHandler(event){
	var e = event || window.event;
	// 正则表达式 匹配逗号和空格(这边也匹配中文输入法下情况下逗号)
	var reg = /，|,| |\s/;
	var val = tagIn.value;
	if(reg.test(val))
	{
		//匹配出前面的输入值
		 var match = val.match(reg).input;
		 var matchedVal = match.slice(0,match.length-1)
		 // console.log(matchedVal);
		 pushToQueue(matchedVal);
		 
	}
	else if(e.keyCode === 13)
	{
		// Enter键不会有value值
		pushToQueue(val);
		
	}
}

function pushToQueue(tagNow){
	tagIn.value = '';
	// 先做重复判断
	if(tagsQueue.indexOf(tagNow) !== -1)
		return;
	// 在不超出10的情况下，再推入队列
	tagsQueue.push(tagNow);
	if(tagsQueue.length>10)
	{
		tagsQueue.shift();
	}
	render(tagUl,tagsQueue);
}

// 数组去重
function unique(arr) {
  var ret = []
  var hash = {}
 
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i]
    var key = typeof(item) + item
    if (hash[key] !== 1) {
      ret.push(item)
      hash[key] = 1
    }
  }
 
  return ret
}

function render(ulNow,arrayNow){
	ulNow.innerHTML = arrayNow.map(function(item){
		return '<li>'+item+'</li>';
	}).join('');
}

function btnCheck(){
	// console.log(hobbiesIn.value);
	var matchArray = hobbiesIn.value.split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/);
	hobbiesQueue = unique(matchArray);
	var count = hobbiesQueue.length;
	if(count>10)
	{
		hobbiesQueue.splice(0,count-10);
	}
	render(hobbyUl,hobbiesQueue);
}

function ListHandler(event,array){
	var queue = array;
	var event = event || window.event;
	var target = event.target || event.srcElement;
	if(target.nodeName == "LI")
	{
		switch(event.type){
			case "click":
				var index = Array.prototype.indexOf.call(target.parentNode.childNodes,target);
				queue.splice(index,1);
				target.parentNode.removeChild(target);
				break;
			case "mouseover":
				target.textContent = "删除 "+target.textContent;				
				break;
			case "mouseout":
				target.textContent = target.textContent.replace("删除 ",'');
				break;
		}
	}
}

function init(){
	// 事件绑定
	addEventHandle(tagIn,"keyup",tagInsertHandler);
	addEventHandle(btn,"click",btnCheck);

	addEventHandle(tagUl,"click",function(event){ListHandler(event,tagsQueue);});
	addEventHandle(tagUl,"mouseover",ListHandler);
	addEventHandle(tagUl,"mouseout",ListHandler);

	addEventHandle(hobbyUl,"click",function(event){ListHandler(event,hobbiesQueue);});
	addEventHandle(hobbyUl,"mouseover",ListHandler);
	addEventHandle(hobbyUl,"mouseout",ListHandler);
}

init();

// 通用的事件绑定函数
function addEventHandle(element,type,handler){
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