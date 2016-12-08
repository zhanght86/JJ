// 引导页start
$(function(){
    var answerIn={"0":"A","1":"B","2":"C","3":"D","4":"E","5":"F","6":"G","7":"H","8":"I","9":"J","10":"K","11":"L","12":"M","13":"N","14":"O","15":"P","16":"Q","17":"R","18":"S","19":"T","20":"U","21":"V","22":"W","23":"X","24":"Y","25":"Z"};
    var isexercise=API.localStorage('exercise'),isexerciseScore=API.localStorage('exerciseScore');
    API.localStorage('exercise','');
    //alert(isexercise);
    //console.log(isexerciseScore.length);
    if(isexerciseScore.length>0){
        API.localStorage('exerciseScore','');
        window.history.go(-1);
        return;
    }
    var exercise=function(){
        var self=this;
        self.init();
        self.index=0;
        self.selectClass='select';
        self.params ={
            paperID:API.getQueryString('paperID'),
            phaseID:API.getQueryString('phaseID'),
            subjectID:API.getQueryString('subjectID'),
            paperResource:API.getQueryString('paperResource'),
            qidResource:API.getQueryString('qidResource'),
            questionStartTime:''
        };
        self.getData();
    }
    exercise.prototype={
        init:function(){
            var self=this;
            self.jdom={
                topTotal:$("#topTotal"),
                lookAll:$("#lookAll"),
                //questionIframe:$("#questionIframe"),
                questionDiv:$("#questionDiv"),
                questionImg:$("#questionDiv img"),
                questionTypeName:$("#questionTypeName"),
                answerArea:$(".slideBox .bd ul"),
                allExercise:$("#allExercise"),
                allExerciseModal:$('.allExercise-modal')
            };
            self.bindUI();
        },
        bindUI:function(){
            var self=this;
            self.jdom.lookAll.click(function(){
                self.jdom.allExercise.fadeIn(300);
                self.setAllHeight();
                //layer.open({
                //   content: '查看全部试题'
                //   ,btn: '我知道了'
                //});
            });

            $(".slideBox").on('click','.bd ul .questionSelect',function(){
                var _this=$(this),li=_this.closest('li'),mcsn=li.attr('mcsn'),one=self.questions[mcsn];
                if(_this.hasClass(self.selectClass)){
                    _this.removeClass(self.selectClass);
                }else{
                    _this.addClass(self.selectClass);
                    //var one=self.questions[qid];
                    if(one.dataType==2){//单选
                        //跳转到下一题
                        //var index=parseInt(_this.attr('index'));
                        _this.parent().siblings().find('.questionSelect').removeClass(self.selectClass);
                        if(one.index<self.data.count-1){
                            self._touchSlide.next();
                        }else{//已经是最后一题目,提交
                            self.jdom.allExercise.fadeIn(300);
                            self.setAllHeight();
                            //self.getAllAnswer();
                        }
                    }
                }
                if(li.find('.questionSelect.'+self.selectClass).length>0){
                    self.jdom.allExercise.find('.main label:eq('+one.index+')').find('em').addClass('btn_selected');
                }else{
                    self.jdom.allExercise.find('.main label:eq('+one.index+')').find('em').removeClass('btn_selected');
                }

            });
            self.jdom.allExercise.click(function(e){
                self.jdom.allExercise.fadeOut(300);
                API.stopPropagation(e);
            })
            self.jdom.allExercise.on('click','.main label em',function(){
                //self.touchSlide(parseInt($(this).html())-1);
                self._touchSlide.setIndex(parseInt($(this).html())-1);
                self.jdom.allExercise.fadeOut(300);
                //layer.open({
                //   content: '查看全部试题'
                //   ,btn: '我知道了'
                //});
            });
            self.jdom.allExerciseModal.click(function(e){
                if(e.target.tagName!='EM'){
                    API.stopDefaultAndPropagation(e);
                }
            });
            $('.btn-submit').click(function(e){
                self.getAllAnswer();
                API.stopDefaultAndPropagation(e);
            });
            $('.btn-return').click(function(){
                self.jdom.allExercise.fadeOut(300);
            });
            self.jdom.questionDiv.click(function(){
                var originImage=new Image(),bigImg=$('.divImg .bigimg '),path=self.jdom.questionImg.attr('src');
                originImage.src=path;
                var Height = originImage.height;
                var zmtop = (window.innerHeight-Height)/2;
                var height=window.innerHeight-80,top=40+'px';
                if(zmtop<0){
                    zmtop=20;
                }
                if(Height<height){
                    height=Height+10;
                    top=zmtop;
                }
                bigImg.attr('src',path);
                $('.divImg').css({width:window.innerWidth,height:height}).css('margin-top',top);
                $('.modalImg').show();
                $('.divImg').scrollLeft(0).scrollTop(0);
            });
            $('.modalImg').click(function(){
                $(this).hide();
            });
        },
        setAllHeight:function(){
            var self=this;
            self.jdom.allExerciseModal.css('height','auto');
            self.jdom.allExercise.find('div.main').css('height','auto');
            var height1=self.jdom.allExerciseModal.height();
            self.jdom.allExerciseModal.css('height',height1);
            self.jdom.allExercise.find('div.main').css('height',height1-103);
        },
        changeOrient:function(){
            var self=this;
            if(self.jdom.allExercise.css('display')!='none'){
                self.setAllHeight();
            }
            if($('.modalImg').css('display')=='none'){return;}
            var originImage=new Image(),bigImg=$('.divImg .bigimg '),path=bigImg.attr('src');
            originImage.src=path;
            var Height = originImage.height;
            var zmtop = (window.innerHeight-Height)/2;
            var height=window.innerHeight-80,top=40+'px';
            if(zmtop<0){
                zmtop=20;
            }
            if(Height<height){
                height=Height+10;
                top=zmtop;
            }
            $('.divImg').css({width:window.innerWidth,height:height}).css('margin-top',top);
        },
        getData:function(){
            var self=this;
            layer.open({
                type: 2
                ,content: '加载数据中....'
                ,shadeClose:false
            });
            API.ajax('getExericse',{paperID:self.params.paperID,phaseID:self.params.phaseID,subjectID:self.params.subjectID,paperResource:self.params.paperResource,qidResource:self.params.qidResource,questionStartTime:self.params.questionStartTime},function(result){
                layer.closeAll();
                if(result&&result.status==0&&result.paperID){
                    if(result.isPractice==0){
                        //if(result.count>0){
                        self.render(result);
                        // }else{
                        //信息框
                        //   layer.open({
                        //      content: '该练习还没有添加题目，请联系管理员'
                        //      ,btn: '我知道了'
                        //  });
                        // }

                    }else{
                        //您已经做过该练习，自动跳转至继续成绩页面...
                        layer.open({
                            content: '您已经做过该练习，自动跳转至练习成绩页面'
                            ,skin: 'msg'
                            ,time: 2 //2秒后自动关闭
                            ,end:function(){
                                API.localStorage('exercise','1');
                                window.location.href='ExerciseScore.html?paperID='+self.params.paperID+'&phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&paperResource='+self.params.paperResource+'&qidResource='+self.params.qidResource;
                                //window.close();
                            }
                        });
                    }
                }else{
                    layer.open({
                        content: '没有获取到数据'
                        ,btn: '我知道了'
                    });
                }

            });
        },
        render:function(data){
            var self=this;
            self.data=data;
            self.questions={};
            if(data&&data.paperID) {
                self.jdom.topTotal.html(data.paperName);
                self.params.questionStartTime=data.questionStartTime;
                if (data.guidePage == 0) {
                    $('.guidInfo').addClass('guide2modal');
                }
                if(data.questions.length>0){
                    //self.jdom.questionIframe.attr('src',data.questions[0].url);
                    var html='',allhtml='';
                    for(var i in data.questions){
                        var type=0,type1='请作答<i>',one=data.questions[i],ii=one.mcsn,isSub='';
                        if(one.isSub>1){
                            isSub='【'+one.subQuestionID+'】';
                        }
                        if(one.type==0){
                            if(one.oneSelect==0){
                                type=3;
                                type1+='（多选题）';
                            }else{
                                type=2;
                                type1+='（单选题）';
                            }
                        }else if(one.type==1){//主观题
                            type=1;
                        }
                        type1+=isSub+'</i>';
                        one.dataType=type;
                        one.index=parseInt(i);
                        //var one=data.questions[i], type1='请作答<i>'+(one.type==0?(one.oneSelect==0?'（多选题）':'（单选题）'):'')+'</i>',ii=parseInt(i)+1;
                        html+='<li class="'+(type==3?'check':'')+'"  mcsn="'+one.mcsn+'" ><div class="table-top cf"><span>'+type1+'</span><span><em>'+ii+'</em>/'+data.count+'</span></div>';
                        if(one.type==1){
                            html+='<div class="table-tip cf">该题不支持在线作答，可在提交后查看答案和解析</div>';
                        }else{
                            html+='<div class="table-tip cf">';
                            for(var j=0;j<one.selects;j++){
                                html+='<div class="questionSelect_div cf"><span index="'+(j)+'" class="questionSelect">'+answerIn[j]+'</span></div>';
                            }
                            html+='</div>';
                        }
                        html+='</li>';
                        allhtml+='<label class="radio_btn"> <input type="radio"><em>'+ii+'</em> </label>';
                        self.questions[one.mcsn]=one;
                        /*<li>
                         <div class="table-top cf">
                         <span>请作答<i>（单选题）</i></span>
                         <span><em>03</em>/20</span>
                         </div>
                         <div class="table-tip cf">
                         该题不支持在线作答，可在提交后查看答案和解析
                         </div>
                         </li>*/
                    }
                    self.jdom.answerArea.html(html);
                    self.touchSlide();
                    self.jdom.allExercise.find('div.main').append(allhtml);
                    orient();

                }else{
                    layer.open({
                        content: '该练习还没有分配题目，请联系管理员'
                        ,btn: '我知道了'
                    });
                }
            }
        },
        touchSlide:function(index){
            var self=this;
            index=index||0;
            self.jdom.questionImg.attr('src',self.data.questions[index].url);
            //self.jdom.questionIframe.attr('src',self.data.questions[index].url);
            self._touchSlide=new TouchSlide({
                slideCell:"#slideBox",
                titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell:".bd ul",
                effect:"left",
                delayTime:600,
                autoPage:true,//自动分页
                defaultIndex:index,
                startFun:function(i,c){
                    //var self=this;
                    self.index=i;
                    if(self.isLast&&(i+1==c)){
                        // self.getAllAnswer();
                        self.jdom.allExercise.fadeIn(300);
                        self.setAllHeight();
                    }else
                    {
                        if(i+1==c){
                            self.isLast=true;

                        }else {
                            self.isLast=false;
                        }
                        var questionIframe=$("#questionIframe");
                        if(questionIframe.attr('src')!=self.data.questions[i].url) {
                            //questionIframe.attr('src', self.data.questions[i].url);
                            self.jdom.questionImg.attr('src',self.data.questions[i].url);

                        }
                    }
                }

            });
        },
        next:function(index){

        },
        getAllAnswer:function(iscontinue){
            iscontinue=iscontinue||1;
            var self=this,answerArr=[];
            $(".slideBox .bd ul").find('li').each(function(i,v){
                var _this=$(this),mcsn=_this.attr('mcsn'),one=self.questions[mcsn],oneArr=[];
                //if(one.dataType==1){
                // return true;
                //}
                _this.find('.questionSelect.'+self.selectClass).each(function(){
                    oneArr.push(answerIn[$(this).attr('index')]);
                });
                if(iscontinue!=3&&oneArr.length==0&&one.dataType!=1){
                    iscontinue=2;
                    layer.open({
                        content: '您尚有未作答试题，提交后不可修改，确定提交？'
                        ,btn: ['继续提交','返回']
                        ,btn2:function(index){
                            layer.close(index);
                        },yes:function(index){
                            layer.close(index);
                            self.getAllAnswer(3);
                        }
                    });
                    success=false;
                    return false;
                }
                answerArr.push(one.mcsn + '-' +one.qid+'-'+one.subQuestionID+'-'+ oneArr.join(''));
            });
            if(iscontinue==1) {
                layer.open({
                    content: '提交后不可修改，确定提交？'
                    ,btn: ['继续提交','返回']
                    ,btn2:function(index){
                        layer.close(index);
                    },yes:function(index){
                        layer.close(index);
                        self.getAllAnswer(3);
                    }
                });
            }else if(iscontinue==3){
                self.submitAnswer(answerArr.join(','));
            }
        },
        submitAnswer:function(data){
            var self=this;
            if(data&&data.length>0){
                layer.open({
                    type: 2
                    ,content: '提交答案中'
                    ,shadeClose:false
                });
                //setTimeout(function(){layer.closeAll();},2000);return;
                setTimeout(function(){
                    API.ajax('submitAnswer',{paperID:self.params.paperID,phaseID:self.params.phaseID,subjectID:self.params.subjectID,questionStartTime:self.params.questionStartTime,paperResource:self.params.paperResource,qidResource:self.params.qidResource, answers:data},function(result){
                        layer.closeAll();
                        if(result&&result.status==0){
                            API.localStorage('exercise','1');
                            API.localStorage('defaultTree','');
                            window.location.href='ExerciseScore.html?paperID='+self.params.paperID+'&phaseID='+self.params.phaseID+'&subjectID='+self.params.subjectID+'&paperResource='+self.params.paperResource+'&qidResource='+self.params.qidResource;
                            //window.close();
                        }else{
                            layer.open({
                                content:result.msg
                                ,btn: '我知道了'
                            });
                        }
                    });
                },200);

            }
        }
    }
    //$('.questioniframediv .stem').html('<iframe id="questionIframe" width="100%" height="600px;"></iframe>');
    var exer=new exercise();

    function orient() {
        if (window.orientation == 0 || window.orientation == 180) {
            $("body").attr("class", "portrait");
            orientation = 'portrait';
            //$('.allExercise-modal').css({'width':'320px','background':'pink'});

            //如果是竖屏给内容区赋值高度
            var w_h=$(window).height();
            var w_w=$(window).width();
            $('.container').width(w_w);

            $('.slideBox').css('max-height','190px');
            var s_h=$('.slideBox').height();
            var top_h=$('.top').height();
            $('.stem').height(w_h-top_h-s_h-32);
            $("iframe").height(w_h-top_h-s_h+100);
            $(".modal-content").width(w_w);
            $(".modal-content").css("left",(w_w-$('.modal-content').width())/2+"px");
            exer.isLast=false;
            exer.touchSlide(exer.index);
            exer.changeOrient();
            $('.check_btn').css('width','20%');
            $('.radio_btn').css('width','20%');
            $('.btn-submit,#allExercise').width(w_w);
            return false;
        }else if (window.orientation == 90 || window.orientation == -90) {
            $("body").attr("class", "landscape");
            orientation = 'landscape';
            // $('.allExercise-modal').css({'width':'620px','background':'pink'});
            //如果是横屏
            var w_h=$(window).height();
            var w_w=$(window).width();
            var s_h=$('.slideBox').height();
            var top_h=$('.top').height();

            $('.slideBox').css('max-height','120px');
            $('.stem').height(w_h-top_h-s_h+35);
            $("iframe").height(w_h-top_h-s_h+100);
            $('.container').width(w_w*0.66);
            $('.btn-submit,#allExercise').width(w_w*0.66);
            $(".modal-content").width(w_w*0.66);
            $(".modal-content").css("left",(w_w-$('.modal-content').width())/2+"px");
            $("modal-body").css("height","90px");
            exer.isLast=false;
            exer.touchSlide(exer.index);
            exer.changeOrient();
            $('.check_btn').css('width','20%');
            return false;
        }
    }
    //当屏幕方向发生变化时调用
    $(window).bind( 'orientationchange', function(e){
        orient();
    });

    var flag=0;
    function guide(){
        if(flag==0){
            $(".guide2modal").find(".modal-head").css("display","none");
            $(".guide2modal").find(".modal-body").css("display","block");
            flag=1;
        }else{
            modal_hide("guide2modal");
            flag=0;
        }
    }
    $(".guidInfo").children(".modal-content").click(function(){
        guide();
    });
    $(".guidInfo").children(".modal-mask").click(function(){
        guide();
    });


    //当页面中所有资源加载完毕时调用
    //$(function(){
    //orient();
    //});
    // 解决页面底部固定问题end
});


// 引导页end
