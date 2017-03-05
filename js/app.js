var Modal = require('./modal');
var Util = require('./util');

/*
* 应用层组织各模块，以及页面逻辑的实现
*/
function Application(waterfall){
	this.waterfall = waterfall;
	this.bounce = $('#bounce');
	this.modal = new Modal();
	this.page = 0;
	this.loading = false;

	this.load();

	addEvent(window, 'scroll', this.scroll.bind(this));
	addEvent(document, 'click', this.click.bind(this));
}
//加载图片资源
Application.prototype.load = function(){
	this.bounce.classList.remove('hide');
	this.loading = true;
	Util.getPhotos(this.page++, this.loaded.bind(this));
}
//加载结束
Application.prototype.loaded = function(photos){
	this.bounce.className += ' hide';
	this.loading = false;
	this.waterfall.append(photos);
}
//滚动加载
Application.prototype.scroll = function(){
	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	//滚动走的高度＋浏览器窗口高度 >= body页面高度(其实就是高度最大的那一栏的高度) 时请求资源
	if(scrollTop + innerHeight + 200 >= document.body.clientHeight && !this.loading){
		this.load();
	}
}
//点击显示大图
Application.prototype.click = function(event){
	var target = event.target || event.srcElement;
	if(target && target.tagName === 'img'.toUpperCase()){
		this.modal.show(target.src, target.dataset.large, target.dataset.radio);
	}
}

module.exports = Application;