/**
 *工具类
 *@file easy.js
 *@package easy_framework
 *@version 1.0
 *@author yuanjun<simpleyuan@gmail.com>
 *@copyright 2013 imoowi.com
 */
typeof(domain) == "undefined" ? domain = '' : '';
var Easy = {
	Utility:{
        isSupportHtml5Video : function(){
            if (!!document.createElement('video').canPlayType) {
                var vidtest = document.createElement('video');
                oggtest = vidtest.canPlayType('video/ogg; codecs=theora, vorbis');
                if (!oggtest) {
                    h264test = vidtest.canPlayType('video/mp4; codecs=avc1.42e01e, mp4a.40.2');
                    if (!h264test) {
                        return false;
                    }
                    else {
                        if (h264test == 'probably') {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
                else {
                    if (oggtest == 'probably') {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                return false;
            }
        },
        browser : {
            versions : function() {
                var u = navigator.userAgent, app = navigator.appVersion;
                return {
                    android : u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                    iPhone : u.indexOf('iPhone') > -1,
                    iPad : u.indexOf('iPad') > -1
                }
            }()
        },
        getStrLen : function(str){
            return str.replace(/[^\x00-\xff]/g, '__').length;
        },
		getBrowserWidthandHeight:function(){
			var winWidth = 0; 
			var winHeight = 0; 
			//获取窗口宽度 
			if (window.innerWidth) 
			winWidth = window.innerWidth; 
			else if ((document.body) && (document.body.clientWidth)) 
			winWidth = document.body.clientWidth; 
			//获取窗口高度 
			if (window.innerHeight) 
			winHeight = window.innerHeight; 
			else if ((document.body) && (document.body.clientHeight)) 
			winHeight = document.body.clientHeight; 
			//通过深入Document内部对body进行检测，获取窗口大小 
			if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) 
			{ 
				winHeight = document.documentElement.clientHeight; 
				winWidth = document.documentElement.clientWidth; 
			} 
			return {width:winWidth,height:winHeight};
		},
		getElementPos : function (elementId){    

		    var ua = navigator.userAgent.toLowerCase();    

		    var isOpera = (ua.indexOf('opera') != -1);    

		    var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof    

		    var el = document.getElementById(elementId);    

		    if (el.parentNode === null || el.style.display == 'none') {    

		        return false;    

		    }    

		    var parent = null;    

		    var pos = [];    

		    var box;    

		    if (el.getBoundingClientRect) //IE    

		    {    

		        box = el.getBoundingClientRect();    

		        var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);    

		        var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);    

		        return {    

		            x: box.left + scrollLeft,    

		            y: box.top + scrollTop    

		        };    

		    }    

		    else    

		        if (document.getBoxObjectFor) // gecko        

		        {    

		            box = document.getBoxObjectFor(el);    

		            var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;    

		            var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;    

		            pos = [box.x - borderLeft, box.y - borderTop];    

		        }    

		        else // safari & opera        

		        {    

		            pos = [el.offsetLeft, el.offsetTop];    

		            parent = el.offsetParent;    

		            if (parent != el) {    

		                while (parent) {    

		                    pos[0] += parent.offsetLeft;    

		                    pos[1] += parent.offsetTop;    

		                    parent = parent.offsetParent;    

		                }    

		            }    

		            if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && el.style.position == 'absolute')) 

		 

		{    

		                pos[0] -= document.body.offsetLeft;    

		                pos[1] -= document.body.offsetTop;    

		            }    

		        }    

		    if (el.parentNode) {    

		        parent = el.parentNode;    

		    }    

		    else {    

		        parent = null;    

		    }    

		    while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled 
		        pos[0] -= parent.scrollLeft;    

		        pos[1] -= parent.scrollTop;    

		        if (parent.parentNode) {    

		            parent = parent.parentNode;    

		        }    

		        else {    

		            parent = null;    

		        }    

		    }    

		    return {    

		        x: pos[0],    

		        y: pos[1]    

		    };    

		},
        isMobileDevice : {
            Android: function () {
                return navigator.userAgent.match(/Android/i) ? true : false;
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i) ? true : false;
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i) ? true : false;
            },
            any: function () {
                return (Easy.Utility.isMobileDevice.Android() || Easy.Utility.isMobileDevice.BlackBerry() || Easy.Utility.isMobileDevice.iOS() || Easy.Utility.isMobileDevice.Windows());
            }
        },
		historyGoBack : function(curbakurl){
			typeof(curbakurl) == "undefined" ? curbakurl = '' : '';
			if(curbakurl){
				window.location.href = curbakurl;
				return
			}
			if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){ // IE  
		        if(history.length > 0){  
		            window.history.go( -1 );  
		        }else{  
		        	window.location.href = window.location.origin;
//		            window.opener=null;window.close();  
		        }  
		    }else{ //非IE浏览器  
		        if (navigator.userAgent.indexOf('Firefox') >= 0 ||  
		            navigator.userAgent.indexOf('Opera') >= 0 ||  
		            navigator.userAgent.indexOf('Safari') >= 0 ||  
		            navigator.userAgent.indexOf('Chrome') >= 0 ||  
		            navigator.userAgent.indexOf('WebKit') >= 0){  
		  
		            if(window.history.length > 1){  
		                window.history.go( -1 );  
		            }else{
		            	window.location.href = window.location.origin;
//		                window.opener=null;window.close();  
		            }  
		        }else{ //未知的浏览器  
		            window.history.go( -1 );  
		        }  
		    }  
		},
        getAge : function(birthday){
        	var   r   =   birthday.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);     
            if(r==null)return   false;     
            var   d=   new   Date(r[1],   r[3]-1,   r[4]);     
            if   (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4])   
            {   
                  var   Y   =   new   Date().getFullYear();  
                  return (Y-r[1])
//                  return("年龄   =   "+   (Y-r[1])   +"   周岁");   
            }
            return("输入的日期格式错误！");
        }
	},
	Validate : {
		_exp : {
			'integer' : /^(-|\+)?\d+$/,// 整数
			'float' : /^[-\+]?\d+(\.\d+)?$/,// 浮点数
			'time' : /^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/,// 时间
			'date' : /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/,// 日期
			'datetime' : /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/,//日期+时间
			'string_cn' : /^[\u0391-\uFFE5]+$/,// 中文字符串
			'string_en' : /^[a-zA-Z0-9_\-]+$/,// 英文字符串
			'url': /^(((ht|f)tp(s?))\:\/\/)[a-zA-Z0-9]+\.[a-zA-Z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,//url
			'email' : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,// 邮箱
			'post' : /^[1-9]{1}(\d){5}$/,// 邮编
			'mobile' : /[1][3-9][0-9]{9,9}/,// 手机
			'tel' : /^0(([1-9]\d)|([3-9]\d{2}))\d{8}$/,// 座机
			'idcard' : /(^\d{15}$)|(^\d{17}[0-9Xx]$)/,// 身份证
			'qq' : /^\d{5,9}$/ // QQ
		},
		isInteger : function(v){
			return Easy.Validate._exp.integer.test(v);
		},
		isFloat : function(v){
			return Easy.Validate._exp.float.test(v);
		},
		isTime : function(v){
			return Easy.Validate._exp.time.test(v);
		},
		isDate : function(v){
			return Easy.Validate._exp.date.test(v);
		},
		isDatetime : function(v){
			return Easy.Validate._exp.datetime.test(v);
		},
		isChinese : function(v){
			return Easy.Validate._exp.string_cn.test(v);
		},
		isEnglish : function(v){
			return Easy.Validate._exp.string_en.test(v);
		},
		isUrl : function(v){
			return Easy.Validate._exp.url.test(v);
		},
		isString : function(v){
			return (v+"").replace(/(^\s*)|(\s*$)/g, "")!="";
		},
		isEmail : function(v){
			return Easy.Validate._exp.email.test(v);
		},
		isPost : function(v){
			return Easy.Validate._exp.post.test(v);
		},
		isMobile : function(v){
			return Easy.Validate._exp.mobile.test(v);
		},
		isTel : function(v){
			return Easy.Validate._exp.tel.test(v);
		},
		isIdcard : function(code){
			var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
            var tip = "";
            var pass= true;
            
            if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
                tip = "身份证号格式错误";
                pass = false;
            }
            
           else if(!city[code.substr(0,2)]){
                tip = "地址编码错误";
                pass = false;
            }
            else{
                //18位身份证需要验证最后一位校验位
                if(code.length == 18){
                    code = code.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                    //校验位
                    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++)
                    {
                        ai = code[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if(parity[sum % 11] != code[17]){
                        tip = "校验位错误";
                        pass =false;
                    }
                }
            }
//            if(!pass) alert(tip);
            return pass;
		},
		isPassword : function(v){
	        var $strength = 0;
	        // 小写字母
	        var testreg = /([a-z]+)/;
	        if(testreg.test(v)) {
	            $strength++;
	        }
	        // 大写字母
	        testreg = /([A-Z]+)/;
	        if(testreg.test(v)) {
	            $strength++;
	        }
	        // 数字
	        testreg = /([0-9]+)/;
	        if(testreg.test(v)) {
	            $strength++;
	        }
	        // 非任意(文字和数字)字母和下滑线的字符
	        testreg = /(\W+)/;
	        if(testreg.test(v)) {
	            $strength++;
	        }
	        // 密码的长度
	        if (v.length < 7) $strength--;
	        else $strength++;

	        switch($strength) {
	            case 0:
	            case 1:
	                //echo '密码强度太弱';
	                break;
	            case 2:
	                //echo '密码强度弱';
	                break;
	            case 3:
	                //echo '密码强度高';
	                break;
	            case 4:
	            case 5:
	                //echo '密码强度很高';
	                break;
	        }
	        
	        if($strength<3){
	            return false;
	        }
	        return true;
	    },
		isQQ : function(v){
			return Easy.Validate._exp.qq.test(v);
		},
	    chkFormInput:function(form){
			for(var i=0; i<form.elements.length; i++){
				if(form.elements[i].required){
					var tagName = form.elements[i].tagName;
					tagName = tagName.toLowerCase()
					switch(tagName){
						case 'input' :
							if(!form.elements[i].value){
//								alert('input');
								alert(form.elements[i].getAttribute('placeholder'));
								form.elements[i].focus()
								return false;
							}
							break;
						case 'select' :
							var value = form.elements[i].options[form.elements[i].options.selectedIndex].value;
							if(!value){
//								alert('select');
								var placeholder = form.elements[i].getAttribute('placeholder') ? form.elements[i].getAttribute('placeholder') : '请选择';
								alert(placeholder);
								form.elements[i].focus()
								return false;
							}
							break;
						case 'textarea':
							if(!form.elements[i].value){
								alert(form.elements[i].getAttribute('placeholder'));
								form.elements[i].focus();
								return false;
							} 
							break;
					}
				}
				var easy_format = form.elements[i].getAttribute('easy_format');
				var cur_value = form.elements[i].value
				if(easy_format){
					switch(easy_format){
						case 'email':
							if(!Easy.Validate.isEmail(cur_value)){
								alert('请输入正确的邮箱');
								form.elements[i].select();
								return false;
							}
							break;
						case 'mobile':
							if(!Easy.Validate.isMobile(cur_value)){
								alert('请输入正确的手机号');
								form.elements[i].select();
								return false;
							}
							break;
						case 'integer':
						case 'number':
							if(!Easy.Validate.isInteger(cur_value)){
								alert('请输入数字');
								form.elements[i].select();
								return false;
							}
							break;
					}
				}
			}
			return true;
	    }
	},
    Cookie : {
        setCookie : function(name, value){
            var Days = 30
            var exp = new Date()
            exp.setTime(exp.getTime() + Days*24*60*60*1000)
            document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
        },
        getCookie : function(name){
            var arr,reg = new RegExp('(^|)' + name + '=([^;*](;|$))')
            if(arr = document.cookie.match(reg)){
                return unescape(arr[2])
            }else{
                return null
            }
        },
        delCookie : function(name){
            var exp = new Date()
            exp.setTime(exp.getTime() - 1)
            var cval = Easy.Cookie.getCookie(name)
            if(cval != null){
                document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
            }
        }
    }
} 
