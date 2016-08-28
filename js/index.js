var demo = angular.module('weChat',['ngRoute']);
demo.controller('mainCtrl',['$scope',function($scope){
	$scope.change = function(){
		$('.nav .nav-inner li').on('click',function(){
			$('.nav .nav-inner li').removeClass('aa');
			$(this).addClass('aa');
		});
	}
}]);
demo.directive('ngHeader',[function(){
	return {
		restrict:'AE',
		replace:true,
		templateUrl:'content/header.html'
	}
}]);
demo.directive('ngFooter',[function(){
	return {
		restrict:'AE',
		replace:true,
		templateUrl:'content/footer.html'
	}
}]);
demo.directive('contact',[function(){
	return {
		restrick:'AE',
		replace:true,
		templateUrl:'content/contact.html',
		link:function(){
			$(function(){
				var toplist;
				var contacts;
				var fixedHeight = $('.header').height()+$('.sub-header').height();
				console.log(fixedHeight);
				$.ajax({
					url:'http://jwbcontact.duapp.com/getalluser',
					dataType:'jsonp'
				}).done(function(data){
					contacts = data;
//					console.log(data);
					render( contacts );
				}).fail(function(){
					console.log('fail');
				});

				function render(userlist){
					$('.fixed span , .userlist , .zimulist').empty();
//					console.log($('.fixed'));
					var obj = {};
					for(var i=0; i<userlist.length; i++){
						var v = userlist[i];
						var index = v.pinyin[0].toUpperCase();
						if(!obj[index]){
							obj[index] = [];
						}
						obj[index].push(v);		
					}
					var words = Object.keys(obj).sort();
					$('.fixed span').text(words[0]);
					for(var i=0; i<words.length; i++){
						$('<li>').text(words[i]).appendTo('.zimulist');
						$('<dt>').text(words[i]).appendTo('.userlist');
						for(var j=0; j<obj[words[i]].length; j++){
							var value = obj[words[i]][j];
							$('<dd>').text(value.name).appendTo('.userlist');
						}
					}
					$('dd').wrapInner('<a href="tel:'+value.phone+'"></a>');
					toplist = $('.userlist dt').map(function(i,v){
						return {top:$(v).offset().top,name:words[i]};
					}).get();
					$('.zimulist').css({
						top:( $(window).height()-fixedHeight-$('.zimulist').height() )/2 + fixedHeight
					});
					$('.userlist dt').prev().css({
						border:'none',
					});
				}
				$(window).on('scroll',function(){
					var top = $(document).scrollTop() + 114;
					for(var i=0; i<toplist.length;i++){
						if(top > toplist[i].top){
							$('.fixed span').text(toplist[i].name);
						}	
					}
				});
				
				$('.zimulist').on('touchstart touchmove',function(e){
					e.preventDefault();
					var y = e.originalEvent.changedTouches[0].clientY;
					var off = y - $(this).position().top;
					var index = Math.floor(off/$('.zimulist li').height());
					console.log(index);
					if(index < 0 || index > toplist.length){
						return;
					}
					$(window).scrollTop( toplist[ index ].top - fixedHeight) ;
				});
				
				$(window).on('resize',function(){
					render(contacts);
				});
				
				$('.zimulist').on('click','li',function(){
					$(window).scrollTop( toplist[ $(this).index() ].top - fixedHeight) ;
				});
				
				$('.sub-header input').on('touchstart',function(){
					$(window).scrollTop(0);
				});
				
				$('.sub-header input').on('input',function(){
					var key = $(this).val().trim();
					var arr = [];
					$.each(contacts,function(i,v){
						var py = contacts[i].pinyin;
						var phone = contacts[i].phone;
						var name = contacts[i].name;
						if( py.indexOf(key) !== -1 || phone.indexOf(key)!==-1 || name.indexOf(key) !== -1){
							arr.push(contacts[i]);
						}
					});
					render(arr);
				});
			});
		}
	}
}]);
demo.config([
	'$routeProvider',
	function($routeProvider){
		$routeProvider.when('/',{
			templateUrl:'content/a.html'
		});
		$routeProvider.when('/liaotian',{
			templateUrl:'content/a.html'
		});
		$routeProvider.when('/lianxiren',{
			templateUrl:'content/b.html'
		});
		$routeProvider.when('/pengyouquan',{
			templateUrl:'content/c.html'
		});
		$routeProvider.when('/wo',{
			templateUrl:'content/d.html'
		});
}]);


