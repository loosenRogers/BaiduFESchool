// 需求
// 用户输入的城市名必须为中英文字符，空气质量指数必须为整数
// 用户输入的城市名字和空气质量指数需要进行前后去空格及空字符处理（trim）
// 用户输入不合规格时，需要给出提示（允许用alert，也可以自行定义提示方式）
// 用户可以点击表格列中的“删除”按钮，删掉那一行的数据

/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var nameIn = document.getElementById("aqi-city-input"); 
	var aqiValueIn = document.getElementById("aqi-value-input");
	var isNameRight = false;
	var isAqiRight = false;
	// 城市名称验证
	var nameValue = nameIn.value;
	if(nameValue.length>0){   //空字符串处理
		//去掉前后空格
		var nameTrim = nameValue.replace(/^\s*|\s*$/g,"");
		// 匹配英文输入 [a-zA-Z]+    匹配中文输入 [\u4E00-\u9FA5]+
		if(nameTrim.match(/[a-zA-Z]+|[\u4E00-\u9FA5]+/))    
		{
			isNameRight = true;
		}
		else{
			alert("Please input the city name in right way!")
		}
	}
	else{
		alert("Please input the city name!");
	}

	//空气质量指数验证
	var aqiValue = aqiValueIn.value;
	if(aqiValue.length>0){
		// 去掉前后空格
		var aqiValueTrim = parseInt(aqiValue,10);
		if(!isNaN(aqiValueTrim)){
			isAqiRight = true;
			// console.log("ok");
		}
		else{
			alert("Please input the right aqi value!");
		}
	}
	else{
		alert("Please input the aqi value!");
	}

	// 将正确的输入值，写入aqiData对象
	if(isAqiRight && isNameRight){
		aqiData[nameTrim] = aqiValueTrim;
		nameIn.value = "";
		aqiValueIn.value = "";
	}
	
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var aqiTable = document.getElementById("aqi-table");
	aqiTable.innerHTML = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
	// for(var i=0;i<aqiData)
	for(var i in aqiData)
	{
		aqiTable.innerHTML += '<tr><td>'+i+'</td><td>'+aqiData[i]+'</td><td><button class="del-btn">删除</button></td></tr>';
	}

	var delBtns = document.getElementsByClassName("del-btn");
	for(var i=0;i<delBtns.length;i++)
  	{
  		(function(index){
  			// eventBing(delBtns[index],"click",delBtnHandle(index));
  			delBtns[index].onclick = function(){
  				var nameNode = delBtns[index].parentNode.previousSibling.previousSibling;
  				// console.log(nameNode);
  				delete aqiData[nameNode.textContent];
  				renderAqiList();
  			}	
  		})(i);
  	}
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
  // console.log(aqiData)
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */

function init() {
	// 没有输入的情况下，input的value是空字符串，不是null
	var addBtn = document.getElementById("add-btn");
	
  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
	eventBing(addBtn,"click",addBtnHandle);
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  	

  	// addAqiData();
}


// 通用的事件绑定函数
function eventBing(element,type,handler){
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

window.onload = function(){
	init();
};
// 我晓得这边为什么错了，因为这是写在js文件里面，而js文件是在body的最后加载的;
// 不像之前的立即执行函数使直接写在HTML文档的script标签中
