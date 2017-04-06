/**
 *   动画营销--九宫格2.0
 *   sudoku
 *   made by：zheng
 *   Production in：2016-9-28
 *   Last updated：2016-9-28
 */
(function($){

  var flag = true,
    winTime = 0,
    speed,
    setTimeRun,
    relNumber,
    callNumber;

  function init(target){

    var opts = $.data(target, 'sudoku').options;

    var $target = $(target);

    $.get(opts.url,function(data){

      $.data(target, 'sudoku').data=data.data;

      var html = "",
        length = data.data.length;


      //3种情况
      for(var j = 0; j < 4; j++){
        if(length == 1){
          html = html +'<div class="sudoku-item"><img src="'+data.data[0].imgUrl+'"></div><div class="sudoku-item"><img src="'+opts.root+opts.failUrl+'"></div>';
        }else if(j < length){
          html = html +'<div class="sudoku-item"><img src="'+data.data[j].imgUrl+'"></div><div class="sudoku-item"><img src="'+opts.root+opts.failUrl+'"></div>';
        }else {
          html = html +'<div class="sudoku-item"><img src="'+data.data[j-length].imgUrl+'"></div><div class="sudoku-item"><img src="'+opts.root+opts.failUrl+'"></div>';
        }
      }

      html = html +'<div class="sudoku-item"><img src="'+opts.root+opts.btnUrl+'"></div>';

      //给当前项添加css，并且将拼接出来的html写入到当前项
      $(target).append(html).css("position","relative");

      //给8张商品图与一张按钮图设置定位
      $target.children().eq(0).css({
        "left":"0"+opts.unit,
        "top":"0"+opts.unit,
        "width":opts.width+opts.unit,
        "height":opts.height+opts.unit,
        "margin-top":opts.marginTop+opts.unit,
        "margin-left":opts.marginLeft+opts.unit
      }).addClass("sudoku-active");

      $target.children().eq(1).css({
        "left":opts.groundWidth+opts.unit,
        "top":"0"+opts.unit,
        "width":opts.width+opts.unit,
        "height":opts.height+opts.unit,
        "margin-top":opts.marginTop+opts.unit,
        "margin-left":opts.marginLeft+opts.unit
      });

      $target.children().eq(2).css({
        "left":opts.groundWidth*2+opts.unit,
        "top":"0"+opts.unit,
        "width":opts.width+opts.unit,
        "height":opts.height+opts.unit,
        "margin-top":opts.marginTop+opts.unit,
        "margin-left":opts.marginLeft+opts.unit
      });

      $target.children().eq(3).css({
        "left":opts.groundWidth*2+opts.unit,
        "top":opts.groundHeight+opts.unit,
        "width":opts.width+opts.unit,
        "height":opts.height+opts.unit,
        "margin-top":opts.marginTop+opts.unit,
        "margin-left":opts.marginLeft+opts.unit
      });

      $target.children().eq(4).css({
        "left":opts.groundWidth*2+opts.unit,
        "top":opts.groundHeight*2+opts.unit,
        "width":opts.width+opts.unit,
        "height":opts.height+opts.unit,
        "margin-top":opts.marginTop+opts.unit,
        "margin-left":opts.marginLeft+opts.unit
      });

      $target.children().eq(5).css({
        "left":opts.groundWidth+opts.unit,
        "top":opts.groundHeight*2+opts.unit,
        "width":opts.width+opts.unit,
        "height":opts.height+opts.unit,
        "margin-top":opts.marginTop+opts.unit,
        "margin-left":opts.marginLeft+opts.unit
      });

      $target.children().eq(6).css({
        "left":"0"+opts.unit,
        "top":opts.groundHeight*2+opts.unit,
        "width":opts.width+opts.unit,
        "height":opts.height+opts.unit,
        "margin-top":opts.marginTop+opts.unit,
        "margin-left":opts.marginLeft+opts.unit
      });

      $target.children().eq(7).css({
        "left":"0"+opts.unit,
        "top":opts.groundHeight+opts.unit,
        "width":opts.width+opts.unit,
        "height":opts.height+opts.unit,
        "margin-top":opts.marginTop+opts.unit,
        "margin-left":opts.marginLeft+opts.unit
      });

      $target.children().eq(8).css({
        "left":opts.groundWidth+opts.unit,
        "top":opts.groundHeight+opts.unit,
        "width":opts.width+opts.unit,
        "height":opts.height+opts.unit,
        "margin-top":opts.marginTop+opts.unit,
        "margin-left":opts.marginLeft+opts.unit
      }).addClass("sudokuBtn");

      $(opts.winTimeDom).html(opts.maxWinTime);
      //绑定事件
      BindEvent(target);
    });
  }

  function BindEvent(target){

    var opts = $.data(target, 'sudoku').options;

    $(target).find(".sudokuBtn").click(function(){

      if(opts.disabled)return;
      if(flag){

        if(winTime >= opts.maxWinTime)return $.alert("已用尽抽奖次数");
        winTime++;

        //ajax
        $.get(opts.winUrl,function(data){

          if(!data.success){
            $.alert(data.text);
            return
          }

          $.data(target, 'sudoku').price=data;

          //执行动画，即begin方法
          begin($(target));
        });

      }
    });
  }

  function begin(target){

    var opts = $.data(target[0], 'sudoku').options;
    var getData = $.data(target[0], 'sudoku').data;
    var price = $.data(target[0], 'sudoku').price;

    speed = opts.initSpeed;

    var length = getData.length;

    var $winTimeDom = $(opts.winTimeDom);

    $winTimeDom.html($winTimeDom.html()-1);

    //算法
    if(price.data.hasPrice){

      //算法，得出中奖的下标
      var pickPrice;

      for(var i = 0;i<length;i++){
        if(price.data.id == getData[i].id){
          pickPrice = i;
          break;
        }
      }

      if(length==1){
        relNumber = parseInt(3*Math.random())*2
      }else if(length == 2){
        relNumber = parseInt(2*Math.random())*4+2*pickPrice
      }else if(length == 3){
        if(pickPrice == 1 || pickPrice == 2){
          relNumber = 2*pickPrice
        }else{
          relNumber = parseInt(2*Math.random())*6
        }
      }else if(length == 4){
        relNumber = parseInt(4*Math.random())*2
      }
    }else{
      relNumber = parseInt(4*Math.random())*2+1
    }

    //执行动画转动方法
    run(target);
  }

  function run(target){


    //获取当前选中项的dom
    var $nowActive=$(target).find(".sudoku-active");


    //假若当前项为最后一项，则将当前样式传给第一项
    if($nowActive.next().next().length){
      $nowActive.next().addClass("sudoku-active");
      $nowActive.removeClass("sudoku-active");
    }else{
      $(target).find(".sudoku-item").eq(0).addClass("sudoku-active");
      $nowActive.removeClass("sudoku-active");
    }


    //假若第一次执行，则执行加速度speedUp函数
    if(flag){


      //执行加速度函数
      speedUp(target);


      //将flag改为false，防止再次执行，同时表示动画进行中
      flag=false;

    }


    //在一定时间后，再次回调本身，循环执行函数
    setTimeRun = setTimeout(function(){


      //执行本身run函数
      run(target);


      //speed表示调用速度
    },speed);

  }

  function speedUp(target){


    //绑定初始化的数据
    var opts = $.data(target[0], 'sudoku').options;


    //速度达到速度最大值时
    if(speed<=opts.fastSpeed){


      //调用恒定速度函数
      speedContinue(target);


      //否则
    }else{


      //速度增加加速度值
      speed -= opts.addSpeed;


      //在一定时间speed内调用本身，再次增加加速度
      setTimeout(function(){

        speedUp(target);

      },speed);

    }

  }

  function speedContinue(target){


    //绑定初始化的数据
    var opts = $.data(target[0], 'sudoku').options;


    //在恒定速度时间后，执行减速函数
    setTimeout(function(){

      speedDown(target);

    },opts.durationTime)

  }

  function speedDown(target){


    //绑定初始化的数据
    var opts = $.data(target[0], 'sudoku').options;
    var price = $.data(target[0], 'sudoku').price;

    //当速度达到最小值时
    if(speed>=opts.endSpeed){


      //减小速度，为了存在还可能的未达到指定地点的运行
      speed+=opts.suSpeed;


      //当当前项不是指定的值
      if($(target).find(".sudoku-active").index()!=relNumber){


        //再次回调自己
        setTimeout(function(){

          speedDown(target);

        },speed)

      }else {


        //改变flag值，表示可以再次执行click时间
        flag = true;


        //停止run方法
        clearTimeout(setTimeRun);


        //回调函数，再此时执行
        if(opts.callback){

          opts.callback(price.data);

        }
      }
    }else{


      //减小速度
      speed+=opts.suSpeed;


      //回调本身
      setTimeout(function(){

        speedDown(target);

      },speed);

    }

  }

  $.fn.sudoku=function(options){


    //如若string执行方法
    if (typeof options == 'string') {

      return $.fn.sudoku.methods[options](this);

    }

    options = options || {};


    //绑定数据
    return this.each(function () {


      //合并传入数据，初始化数据
      $.data(this, 'sudoku', {
        options: $.extend({},
          $.fn.sudoku.defaults,
          options)
      });


      //执行初始化方法
      init(this);

    });

  };

  $.fn.sudoku.defaults={

    //方块宽
    width:3.5,

    //方块高
    height:3.75,

    //外层宽
    groundWidth:3.775,

    //外层高
    groundHeight:3.975,

    //间隔
    marginLeft:0.275,

    marginTop:0.275,

    //单位
    unit:"rem",

    //加速度（单位毫秒，此加速度是setTimeout的后面时间减少值）
    addSpeed:20,

    //减速度
    suSpeed:20,

    //开始速度
    initSpeed:200,

    //结束速度
    endSpeed:300,

    //峰值速度
    fastSpeed:40,

    //最高速度持续时间（单位毫秒）
    durationTime:1000,

    //每个方块的概率
    probability:[1,0,0,0,0,0,0,0],

    //url
    url:"",

    //回调函数
    callback:function(){},

    directProportion:true,

    maxWinTime:3,

    failUrl:"sudoku-images/commodity_00.png",

    btnUrl:"sudoku-images/commodity_btn.png",

    root:"",

    disabled:false,

    winUrl:"price.json"

    //若页面有显示抽奖次数，则需传入抽奖次数的dom
    //winTimeDom:".winTimeDom"
  }

})(jQuery);