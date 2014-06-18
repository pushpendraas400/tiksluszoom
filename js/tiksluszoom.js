/*
TikslusZoom v 1.1.0 
Author: Pushpendra Singh Chouhan @ pushpendra.as400@gmail.com
http://tikslus.com
added dynamic big image loading 
*/
(function($){
   var TikslusZoom = function(element, options)
   {
       var element = $(element),obj=this,loaded=false,moving=false,big_image_width=0,big_image_height=0,coord=new Object(),document=$(document),zoom_preview_window=0,body=$("body");
     /*  var obj = this;

	   var loaded=false;
	   var moving=false;
	   var big_image_width=0;
	   var big_image_height=0;
	   var coord=new Object();//small image coordinates
	   var body=$("body");
	   var document=$(document);
	   var zoom_preview_window=0;//hidden by default
	  */
	   var defaults=
					{
					delay:18,
						lensWidth:100,
						lensHeight:100,
					lensBackgroundColor:'#fff',
					lensOpacity:0.5,
					previewWidth:200,
					previewHeight:200,
					lensBorder:1,
					lensBorderColor:'#000',
					showLens:true,
					loaderImage:'loader.gif',
					zoomAnimation:false,
					zoomAnimationInterval:80,
					annotationsBorderColor:'#000',
					annotationBackgroundColor:'#fff',
					zoomPreviewWindowEffect:'default',//can be default,fade
					annotationOpacity:0.3,
					annotations:new Array(),
					
					
					
					};

	   var small_img=element.find("img.tiksluszoom"),big_img=element.find("img.tiksluszoom").attr("data-big-image"),lens;
	   //var big_img=element.find("img.tiksluszoom").attr("data-big-image");
	 
	 //  var lens;
 // Extend our default options with those provided.
   options = $.extend(defaults, options);
	   
	   //private fucntion to create a zoom wrapper
	  var createZoomWrapper=function(){
	   element.append("<div class='zoom-preview-wrapper'><div class='zoom-preview'></div><div class='annotation'></div></div>");
	   }
	   
	   this.getCoord=function(){
		coord.left=small_img.position().left;
		coord.top=small_img.position().top;
		coord.right=small_img.width();
		coord.bottom=small_img.height();
		return coord;
				}
	   
	   //create lens
	 var  createLens=function(){
	   element.append("<div class='lens'></div>");
	   lens=element.find(".lens");
	   
	   if(options.showLens==true){
		lens.css({width:options.lensWidth,height:options.lensHeight,opacity:options.lensOpacity,backgroundColor:options.lensBackgroundColor,border:options.lensBorder,borderTopStyle:'solid',borderLeftStyle:'solid',borderRightStyle:'solid',borderBottomStyle:'solid',borderTopColor:options.lensBordercolor,borderLeftColor:options.lensBordercolor,borderBottomColor:options.lensBordercolor});
			}
				else{
					lens.find(".lens").css({width:options.lensWidth,height:options.lensHeight,cursor:'crosshair'});

					}
					return lens;
			}
			//ends create lens
			
			var hideLens=function(){
			lens.css({visibility:'hidden'});
			}
			
			var showLens=function(){
			lens.css({visibility:'visible'});
			}
			
				/******************Create annotations rectangles on the image ******************/
				//private method
					var createAnnotations=function(){
				var sm_coord=obj.getCoord();
				  for(var i=0;i<options.annotations.length;i++){
					var tx=0,ty=0;
					tx=sm_coord.left+options.annotations[i].x;
					ty=sm_coord.top+options.annotations[i].y;
  
					element.append("<div  style='border:1px solid ;border-color:"+options.annotationsBorderColor+";background-color:"+options.annotationBackgroundColor+";position:absolute;left:"+tx+ "px;top:"+ty + "px;width:"+options.lensWidth+"px;height:"+options.lensHeight+"px;border:1px solid #eee;z-index:0;opacity:"+options.annotationOpacity+"'></div>"); 
 
						}					
				
				}
				/*******************ends createAnnotations************************/
				
				/*********************show annotations on lens hovering on hot spot*************************/
				
				var showAnnotation=function(x,y){
 
				if(options.annotations.length>0){
  
				for(var i=0;i<options.annotations.length;i++){
	
				var tx=0,ty=0;
				var sm_coord=obj.getCoord();
				tx=sm_coord.left+options.annotations[i].x;
				ty=sm_coord.top+options.annotations[i].y;
				if(x>=tx && x<=tx+options.lensWidth && y>=ty && y<=ty+options.lensHeight){
				element.find(".zoom-preview-wrapper .annotation").show().html(options.annotations[i].annotation);
							}
	
						}	
					}
				}
				
				/******************eds show annotations*********************/
				
				/****************hide show zoom preview window ***************/
				
				var zoomPreviewWindowIsHidden=function(){
				if(zoom_preview_window==0)
				return true;
				else
				return false;
				}
				
				var hideZoomPreview=function(){
				element.find(".zoom-preview-wrapper").hide();
				zoom_preview_window=0;
				}
				
				var showZoomPreview=function(){
				
			var zoom_preview_left=small_img.position().left + small_img.width() + 20;
			var zoom_preview_top=small_img.position().top;
			var zoom_preview_bottom=small_img.height()+zoom_preview_top;
			
			
			if(zoom_preview_bottom>$(window).height() + $(window).scrollTop()  || zoom_preview_left>$(window).width()+$(window).scrollLeft()){
			zoom_preview_top=zoom_preview_top-small_img.height();
			zoom_preview_left=small_img.position().left;
			
			
			}
			
			
			
			element.find(".zoom-preview-wrapper").css({left:zoom_preview_left + "px",top:zoom_preview_top + "px"});
			
			
				switch(options.zoomPreviewWindowEffect){
				case 'fade':
				element.find(".zoom-preview-wrapper").fadeIn("slow");
				break;
				case 'default':
				element.find(".zoom-preview-wrapper").show();
				break;
				
				default:
				element.find(".zoom-preview-wrapper").show();
				
				}
				zoom_preview_window=1;
				}
				
				
				
				var clearAnnotation=function(){
					element.find(".zoom-preview-wrapper .annotation").html("").hide();
				}
				
			  //create annotations if available
			  //initialize plugin and create html elements and append them to body
	   createAnnotations();
	   createZoomWrapper();
		createLens();
			
			//private method to get small image coordinates
		
		/***************Load big image in the zoom preview pan *********************/		
		//public method can be called from outside
		this.loadBigImage=function(bimg){
			
		var img_object=new Image();
		var sm_coord=obj.getCoord();
		img_object.src=bimg || big_img;
		//img_object.src=big_img;
		 big_img=img_object.src;
		var left=element.find(".zoom-preview").width()/2;
		var top=element.find(".zoom-preview").height()/2;
		var sm_left=sm_coord.left+sm_coord.right/2;
		var sm_top=sm_coord.top+sm_coord.bottom/2;
		//var sm_top=small_img.position().top+small_img.height()/2;
		//var sm_left=small_img.position().left + small_img.width()/2;
		if(element.find(".zoom-loading").length<=0){
		element.append("<div class='zoom-loading'></div>");
		element.find(".zoom-loading").append("<img src='"+options.loaderImage+"' border='0'>");
		}
		small_img.addClass('fade');
		element.find(".zoom-loading").css({position:'absolute',left:sm_left+"px",top:sm_top+"px",zIndex:1000});
		$("body").css("cursor","none");//hide cursor;
		hideLens();//hide lens
		small_img.css({opacity:0.3});
		//try to load the big image into the zoom wrapper
		img_object.onload = function() {
			big_image_width=img_object.width;
			big_image_height=img_object.height;
			//create a zoom preview pan
						
			element.find(".zoom-preview").css({"background-image":"url('"+img_object.src+"')",visibility:"visible"});
			element.find(".zoom-loading").remove();
			showZoomPreview();
			small_img.removeClass('fade');
			$("body").css("cursor","haircross");//show cursor;
			loaded=true;
			showLens();
			small_img.css({opacity:1});
				}
		
		
				}
				/****************end loadBigImage ***************/
				
				
			
				
				var attachLens=function(X,Y){
				var sm_coord=obj.getCoord();
				ctop=Y-options.lensHeight/2-sm_coord.top;// is magnifier width/2
				cleft=X-options.lensWidth/2-sm_coord.left;//// is magnifier height/2
				lens.css({top:Y-options.lensHeight/2 + "px",left:X-options.lensWidth/2+"px",visibility:'visible',width:options.lensWidth + "px",height:options.lensHeight + "px"});
				moving=true;
				}
				
				var moveLens=function(X,Y){
				//var sm_coord=obj.getCoord();
				ctop=Y-options.lensHeight/2;// is magnifier width/2
				cleft=X-options.lensWidth/2;//// is magnifier height/2
				lens.css({top:Y-options.lensHeight/2 + "px",left:X-options.lensWidth/2+"px",width:options.lensWidth + "px",height:options.lensHeight + "px"});
				}
				
				var detachLens=function(){
				lens.css({top:0,left:0,widht:0,height:0,visibility:'hidden'});
				body.css({cursor:'default'});
				}
				
				var lensIsHidden=function(){
				if(lens.is(":visible")){
				return false;
				}
				else{
				return true;
				}
				}
				
				
				 var zoom=function(X,Y){
				var sm_coord=obj.getCoord();
				/*if(loaded==false){
				loadBigImage();
					}	*/		
				if(loaded==true && moving==true){
				var img_ratio_height=0; //ratio of large image height / small image height
				var img_ratio_width=0; // ratio of large image width / small image width
				
				img_ratio_width=parseFloat(big_image_width/small_img.width()).toFixed(1);
				img_ratio_height=parseFloat(big_image_height/small_img.height()).toFixed(1);
				
				img_ratio_width=parseFloat(big_image_width/small_img.width()).toFixed(1);
				img_ratio_height=parseFloat(big_image_height/small_img.height()).toFixed(1);
				
				var ctop=Y-options.lensHeight/2-sm_coord.top;// is magnifier width/2
				var cleft=X-options.lensWidth/2-sm_coord.left;//// is magnifier height/2
				
				
				
				if(options.zoomAnimation==true){
				var bckpos1=-(cleft*img_ratio_width) 
				var bckpos2=-(ctop*img_ratio_height) ;
				
				//element.find(".zoom-preview").animate({backgroundPosition:  bckpos1 + "px"  bckpos2 + "px" },35);
				element.find(".zoom-preview").animate({'background-position-x': bckpos1 + "px",'background-position-y':bckpos2+"px"},options.zoomAnimationInterval);
				

				}else{
				element.find(".zoom-preview").css({backgroundPosition:-(cleft*img_ratio_width ) + "px "+ (-(ctop*img_ratio_height) +"px")});
					}
				
				element.find(".zoom-preview").css("width",options.lensWidth*img_ratio_width + "px");
				element.find(".zoom-preview").css("height",options.lensHeight*img_ratio_height + "px");


				element.find(".zoom-preview-wrapper").css("width",options.lensWidth*img_ratio_width + "px");
				element.find(".zoom-preview-wrapper").css("height",options.lensHeight*img_ratio_height + "px");
				}
				
				}
				
				/*************************overlay and lightbox********************/
				
				var createOverlay=function(){
				var screen_width;
				var screen_height;
				screen_width=screen.width;
				screen_height=$(document).height();
				var bk="<div id='tiksluszoom_overlay'></div>";
			
				if($("#tiksluszoom_overlay").length==0)
				{
				body.append(bk);
				}
				$("#tiksluszoom_overlay").css({left:0,top:0,width:screen_width+"px",height:screen_height+"px",position:'absolute'}).fadeIn("fast");
				}
				
				var createLightBox=function(width,height){
				
				var left=($(window).width() - width)/2 +$(window).scrollLeft();
				var top=($(window).height() - height)/2 + $(window).scrollTop();
				$("#tiksluszoom_lightbox").remove();
				var lightbox="<div id='tiksluszoom_lightbox' style='width:"+width+"px;left:"+left+"px;top:"+top+"px;height:"+height+"px;position:absolute'><div class='tiksluszoom_lightbox_inner'><ul class='operations'><li><a href='#' class='tiksluszoom_lightbox_close'>X</a></li></ul></div></div>";
				body.append(lightbox);
				$("#tiksluszoom_lightbox").fadeIn("slow");
				}
				
				this.destroyLightbox=function(){
				$("#tiksluszoom_lightbox").fadeOut("slow").find("img").remove();
				//body.css({cursor:'crosshair'});
				}
				this.destroyOverlay=function(){
				$("#tiksluszoom_overlay").fadeOut("fast").css({width:0,height:0});
				}
				
				var lightboxShowImage=function(){
				var screen_width=$(window).width();
				var screen_height=$(window).height();
				var new_width=0;
				var new_height=0;
				new_width=big_image_width;
				new_height=big_image_height;
				//adjust big image size if it's dimensions is greater than screen's
				if(big_image_width>=screen_width ){
				new_width=screen_width*90/100; //make image with 15% less of screen
				}
				if(big_image_height>=screen_height ){
				new_height=screen_height*90/100; //make image with 15% less of screen
				}
				
				
				
			
				
				element.find("div").hide(); // hide all div's lens, zoom wrapper
				createLightBox(new_width,new_height);
				//hide preview window
			//	element.find(".zoom-preview-wrapper").hide();
				$(".tiksluszoom_lightbox_inner").find(".preview").remove();
				$(".tiksluszoom_lightbox_inner").prepend("<img  class='preview' src='"+big_img+"' style='max-width:100%;max-height:100%;'/>").fadeIn("slow");
				body.css({cursor:'default'});
				
				$("a.tiksluszoom_lightbox_close").click(function(e){
		
				e.preventDefault();
				obj.destroyLightbox();
				obj.destroyOverlay();
			//	$(".zoom-preview-wrapper").show();
				});
				
				
				$("#tiksluszoom_overlay").click(function(e){
				e.preventDefault();
			
				obj.destroyLightbox();
				obj.destroyOverlay();
			//	$(".zoom-preview-wrapper").show();
				});
		
				$(".preview").click(function(e){
				obj.destroyLightbox();
				obj.destroyOverlay();
		//$(".zoom-preview-wrapper").show();
					});
				
				
				}
				
				//if user scrolls the document ajust the lightbox position
				var adjustLighboxPosition=function(){

				if($("#tiksluszoom_lightbox").is(':visible'))
				{
				var toheight=$("#tiksluszoom_lightbox").height();
				var towidth=$("#tiksluszoom_lightbox").width();
				$("#tiksluszoom_lightbox").animate({
				top:($(window).height() - toheight)/2 + $(window).scrollTop(),
				left:($(window).width() - towidth)/2 + $(window).scrollLeft()
						},5);
					}
				}
				
				
				
				small_img.mouseenter(function(e){
				if(moving==false){
				attachLens(e.pageX,e.pageY);
				
				}
				if(loaded==false){obj.loadBigImage();}
				if(!zoomPreviewWindowIsHidden()){
				showZoomPreview();
				}
				
				if(lensIsHidden()==true){ //lens was hidden during lightbox show
				element.find("div").show(); //unhide all the divs inside element (includeing lens,zoom wrapper,annotations divs)
				}
				
				});
	
				
				small_img.mousemove(function(e){
				if(moving){
				zoom(e.pageX,e.pageY);
				moveLens(e.pageX,e.pageY);
				}
				
				
				});
			
				
	
	 
		
	   	lens.mousemove(function(e){
	if(e.pageX>=small_img.position().left && e.pageX<=(small_img.width() + small_img.position().left) && e.pageY>=small_img.position().top && (e.pageY<=small_img.height()+small_img.position().top) && moving==true){
	clearAnnotation();
	if(lensIsHidden()==true){
	attachLens();
showLens();
	}
	if(zoomPreviewWindowIsHidden()){
				showZoomPreview();
				}
	moveLens(e.pageX,e.pageY);
	zoom(e.pageX,e.pageY);
	showAnnotation(e.pageX,e.pageY);
	}else{
	detachLens();
	body.css({cursor:'default'})
	moving=false;
	hideZoomPreview();
	}
				});
				
		lens.click(function(e){
		createOverlay();
		lightboxShowImage();
		e.preventDefault();
		});
		
		

		document.scroll(function(){
		if($("#tiksluszoom_lightbox").is(":visible")){
		adjustLighboxPosition();
		}
		});
		
		
	   
   };

   $.fn.tiksluszoom = function(options)
   {
       return this.each(function()
       {
           var element = $(this);
          
           // Return early if this element already has a plugin instance
           if (element.data('tiksluszoom')) return;

           // pass options to plugin constructor
           var tiksluszoom = new TikslusZoom(this, options);

           // Store plugin object in this element's data
           element.data('tiksluszoom', tiksluszoom);
       });
   };
})(jQuery);
