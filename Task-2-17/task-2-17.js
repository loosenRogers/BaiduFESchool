/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/


// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}

//更改数据格式为
// var aqiSourceData = {
//   "北京": [
//       {
//         date:"2016-01-01",
//         aqiData:10
//       },
//       {
//         date:"2016-01-02",
//         aqiData:102
//       },
//   ]
// };
function randomBuildData(seed) {
  // var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  var dataArr = [];
  for (var i = 1; i < 92; i++) {
    var returnData = {};
    datStr = getDateStr(dat);
    returnData.date = datStr;
    returnData.aqiData = Math.ceil(Math.random() * seed);
    // console.log(returnData);
    dataArr.push(returnData);
    dat.setDate(dat.getDate() + 1);
  }
  return dataArr;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(150),
  "广州": randomBuildData(100),
  "深圳": randomBuildData(50),
  "成都": randomBuildData(150),
  "西安": randomBuildData(250),
  "福州": randomBuildData(50),
  "厦门": randomBuildData(50),
  "沈阳": randomBuildData(250),
  "江苏": randomBuildData(500)
};

// console.log(aqiSourceData);

// 获取选择日期的radio控件
var dateGran = document.getElementsByName("gra-time");
// console.log(dateGran);
var selCity = document.getElementById("city-select");
// console.log(selCity);
var cityName = document.getElementsByClassName("city-name");
// console.log(cityName);
var granName = document.getElementsByClassName("show-style");

var liArr = document.getElementsByTagName("li");
// console.log(liArr);

var liShow = liArr[0];
// console.log(liShow);

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: "--请选择城市--",
  nowGraTime: "day"
}

// 针对不同的时间粒度，加载响应的数据
// 根据aqi数据，对li中每个div进行属性设置
// 包括：title,height,span的innerHTML和transition
function chartDataLoader(liShow) {
  switch(liShow.dataset.value)
  {
    // 日数据
    case "day":
    console.log(liArr);
    // console.log("GetInDay");
    for(var i=0;i<liShow.children.length;i++)
    {
      // 动画效果，显示时间间隔
      liShow.children[i].style.transition = "0.2s " + i * 0.05 + "s";//后面一段是延时
      liShow.children[i].title = "城市："+ pageState.nowSelectCity + ";时间：" + aqiSourceData[pageState.nowSelectCity][i].date + ";AQI值：" + aqiSourceData[pageState.nowSelectCity][i].aqiData;
      // 将aqi值写入span中
      liShow.children[i].children[0].innerHTML = aqiSourceData[pageState.nowSelectCity][i].aqiData;
      liShow.children[i].style.height = aqiSourceData[pageState.nowSelectCity][i].aqiData + "px";
    }
    break;

    // 周数据
    case "week":
    console.log(liArr);
    // console.log("GetInWeek");
    var countWeek = 0;
    var sumWeek = 0;
    var avgWeek = [];
    for(var i=0;i<91;i++)
    {
      sumWeek += aqiSourceData[pageState.nowSelectCity][i].aqiData;
      countWeek++;
      if(countWeek%7 == 0)
      {
        avgWeek.push(Math.ceil(sumWeek/7));
        sumWeek = 0;
      }
    }

    for(var i=0;i<liShow.children.length;i++)
    {
      // 动画效果，显示时间间隔
      liShow.children[i].style.transition = "0.2s " + i * 0.05 + "s";//后面一段是延时
      liShow.children[i].title = "城市："+ pageState.nowSelectCity + ";时间：第" + (i+1) + "周;AQI值：" + avgWeek[i];
      // 将aqi值写入span中
      liShow.children[i].children[0].innerHTML = avgWeek[i];
      liShow.children[i].style.height = avgWeek[i] + "px";
    }
    break;

    // 月数据
    case "month":
    console.log(liArr);
    // console.log("GetInMonth");
    var indexMonth = 1;
    var sumMonth = 0;
    var avgMonth = [];
    for(var i=0;i<91;i++)
    {
      nowDate = aqiSourceData[pageState.nowSelectCity][i].date.split('-');
      sumMonth += aqiSourceData[pageState.nowSelectCity][i].aqiData;
      if(i<90)
      {
        nextDate = parseInt(aqiSourceData[pageState.nowSelectCity][i+1].date.split('-')[1],10);
        // console.log(nextDate);
      }
      if(nextDate != indexMonth || i == 90){
        indexMonth = nextDate;
        avgMonth.push(Math.ceil(sumMonth/(parseInt(nowDate[2],10))))
        sumMonth = 0;
      }      
    }

    for(var i=0;i<liShow.children.length;i++)
    {
      // 动画效果，显示时间间隔
      liShow.children[i].style.transition = "0.2s " + i * 0.05 + "s";//后面一段是延时
      liShow.children[i].title = "城市："+ pageState.nowSelectCity + ";时间：" + (i+1) + "月;AQI值：" + avgMonth[i];
      // 将aqi值写入span中
      liShow.children[i].children[0].innerHTML = avgMonth[i];
      liShow.children[i].style.height = avgMonth[i] + "px";
    }
    break;

    default:
    break;
  }
}


/**
 * 渲染图表
 * 此处图标的渲染，只是对应的li(日、周和月)中加入柱状图div，并为每个每个div设颜色
 * 而其与aqi值关联的height以及title，会在select城市触发的事件中渲染
 */
function renderChart() {
 
  //填充day列表(91天数据)
  var htmlContent = '';
  for(var i=1;i<92;i++)
  {
    var color = '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
    htmlContent += '<div style="background: '+color+';margin-left: 5px;"><span class="Day-Data"></span></div>';
  }
  liArr[0].innerHTML = htmlContent;

  // 填充week列表(13周)
  var htmlContent = '';
  for(var i=1;i<=13;i++)
  {
    var color = '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
    htmlContent += '<div style="background: '+color+';margin-left: 25px;"><span class="Week-Data"></span></div>';
  }
  liArr[1].innerHTML = htmlContent;

  // 填充month列表(3个月)
  var htmlContent = '';
  for(var i=1;i<=3;i++)
  {
    var color = '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
    htmlContent += '<div style="background: '+color+';margin-left: 45px;"><span class="Month-Data"></span></div>';
  }
  liArr[2].innerHTML = htmlContent;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(date) {
  // 时间粒度发生变化
  if(date.value !== pageState.nowGraTime && pageState.nowSelectCity != "--请选择城市--")
  {
    granName[0].innerHTML = date.value;
    pageState.nowGraTime = date.value;
    for(var i=0;i<liArr.length;i++)
    {
      liArr[i].id = '';
      // 匹配对应的li进行显示
      if(date.value == liArr[i].dataset.value)
      {
        liArr[i].id = 'show';
        liShow = liArr[i];
      }
    }
    chartDataLoader(liShow);
  }
  
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // console.log(this.value);
  if(this.value != pageState.nowSelectCity && this.value != "--请选择城市--")
  {
    cityName[0].innerHTML = this.value;
    pageState.nowSelectCity = this.value;
    //如果时间粒度发生改变
    if(liShow.dataset.value != pageState.nowGraTime)
    {
      for(var i=0;i<liArr.length;i++)
      {
        liArr[i].id = '';
        // 匹配对应的li进行显示
        if(liArr[i].dataset.value == pageState.nowGraTime)
        {
          liArr[i].id = 'show';
          liShow = liArr[i];
        }
      }
    }
    // 城市改变，重新渲染
    chartDataLoader(liShow);
  }
  else{
    cityName[0].innerHTML = '';
    liShow.children[i].children[0].innerHTML = '';
    liShow.children[i].style.height = 0 + "px";
  }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() 
{
  for(var i=0;i<dateGran.length;i++){
    (function(m){
      addEventHandle(dateGran[m],'click',function(){graTimeChange(dateGran[m])});
    })(i);
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var Options = "<option>--请选择城市--</option>";
  for(var i in aqiSourceData)
  {
     Options += "<option>" + i + "</option>";
  }
  selCity.innerHTML = Options;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  addEventHandle(selCity,'change',citySelectChange)
}


/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  renderChart();
  // console.log(parseInt("01",10));
}

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

init();