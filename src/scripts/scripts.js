
if(document.querySelector('.main')){
	jQuery(function(){
		let header = $('.header__bg');
		let main = $('.main');
		let mainTop = main.offset().top;
		header.css({'opacity' : '0'});
		$(window).bind('scroll', function(){
			let windowTop = $(this).scrollTop();
			if( windowTop > mainTop)
			{
				header.css({'opacity': '1'});
			} else {
				header.css({'opacity': '0'});
			}
		});
	})
}
if(document.querySelector('.cases-list__main')){
	jQuery(function(){
		let header = $('.header__bg');
		let main = $('.cases-list__main');
		let mainTop = main.offset().top;
		header.css({'opacity' : '0'});
		$(window).bind('scroll', function(){
			let windowTop = $(this).scrollTop();
			if( windowTop > mainTop)
			{
				header.css({'opacity': '1'});
			} else {
				header.css({'opacity': '0'});
			}
		});
	})
}
if(document.querySelector('.case-main')){
	jQuery(function(){
		let header = $('.header__bg');
		let main = $('.case-main');
		let mainTop = main.offset().top;
		header.css({'opacity' : '0'});
		$(window).bind('scroll', function(){
			let windowTop = $(this).scrollTop();
			if( windowTop > mainTop)
			{
				header.css({'opacity': '1'});
			} else {
				header.css({'opacity': '0'});
			}
		});
	});
	
}
if(!(document.querySelector('.main'))||!(document.querySelector('.cases-list__main'))||!(document.querySelector('.case-main'))){
	jQuery(function(){
		let header = $('.header__bg');
		header.css({'opacity': '1'});
	});
}
if(document.querySelector('.reviews__slider')){
	var flkty = new Flickity('.reviews__slider', {
			cellAlign: 'left',
			fade: true,
			contain: true,
			pageDots: false
		});
		
	jQuery(function(){
		$('.reviews__nav--prev').on('click', function(){
			flkty.previous();
		})
		
		$('.reviews__nav--next').on('click', function(){
			flkty.next();
		})
	});
}
if(document.querySelector('.case-main-slider')){
	var flick = new Flickity('.case-main-slider', {
		cellAlign: 'center',
		fade: true,
		contain: true,
		pageDots: false,
		wrapAround: true
	});
	$('.case-main__prev').on('click',()=>{
		flick.previous();		
	});
	$('.case-main__next').on('click',()=>{
		flick.next();		
	});
}
if(document.querySelector('.case-main-slider-two')){
	var flick1 = new Flickity('.case-main-slider-two',{
		cellAlign: 'center', 
		fade: true,
		contain: true,
		wrapAround: true,
		pageDots: false
	});
}
if(document.querySelector('.contactus__file')){
	let fileInput = document.querySelector('#contactusFile');
	fileInput.addEventListener('change',()=>{
		let file = fileInput.value;
		file = file.replace (/\\/g, '/').split('/').pop();
		//console.log(file);
		let value = document.querySelector('.contactusFile__name')
		value.innerHTML = file;
	});
	
}