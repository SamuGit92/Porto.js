/**
 * Porto.js - Image and video portfolio plugin for your bootstrap website
 * 
 * Copyright 2016, Samu Abeynayake
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */

(function ($) {
    
    $.porto = function (element,options){ 
        
        var defaults = {
            columns        : 4,
            mode           : "image",           //image, video
            margin         : 2,
            caption        : true,
            captionMode    : "icon",            //title, text, icon, title|text        
            background     : "rgba(255,0,0,0.7)",        
            textColor      : "#fff",  
            captionFit     : false,
            animateCaption : false,   
            animation      : "pf-fade",            
            clickEventOn   : "box",             //box, caption, icon 
            onclickAction  : "popup",           //url, popup, none   
            linkTarget     : "new",             //same, new
            backdropColor  : "rgba(0,0,0,0.7)",
            popupSize      : "medium",          //small, medium, large	
            controls       : true,
            closeController: true,
            navController  : true,
            fixedNavigation: true,
            backdropClose  : true,
            closeOnEsc     : true,
            responsive     : true            
        }        
        
		var pf = this;   
        pf.settings = {};
    
        var $element = $(element), element = element;    

        var $thisElement; 

        var getImage = function() {              
            return $thisElement.data('pf-image');
        } 

        var getVideo = function() {        
            return $thisElement.data('pf-video');
        } 

        var getTitle = function() {        
            return $thisElement.data('pf-title');
        }

        var getText  = function() {        
            return $thisElement.data('pf-caption');
        }

        var getUrl   = function($this) { 
            return $this.data('pf-onclick');
        }   
        
        var setThis = function($this){
            $thisElement = $this;
        }
        
        var getThis = function(){
            return $thisElement;
        }        
        
         /**
		 * Initializes plugin
		 */
		var init = function(){
            pf.settings = $.extend({}, defaults, options);   
            $element.addClass("row");
            $element.find('.pf').each(function (index, value) { 
                $(this).addClass("pf-wrapper");
                $(this).addClass(setColumns());
                $(this).css("padding", setBoxMargin());
                
                setThis($(this));
                setup();
                setCaptionBackground();        
                setCaptionTextColor();
                setCaptionFit();
                setCaptionAnimation();
                setAnimation();
                setOnclickAction();
                
                
            });
        }
        
        var setColumns = function() { 
            var max = 12, min = 1, numOfColumns = pf.settings.columns, col = 0;
            var columnClass = "";
            
            if(numOfColumns <= max && numOfColumns >= 1){                
                var remainder = 12 % numOfColumns;
                if (remainder == 0){
                    col = 12/numOfColumns;
                } 
                else {
                    col = 3;
                }                
            }
            else{
                col = 3;
            }
            
            if(pf.settings.responsive){
                columnClass = " col-xs-12 col-pf-6 col-sm-6 "+"col-md-"+col+" col-lg-"+col;
            }
            else{
                columnClass = " col-xs-"+col+" col-sm-"+col+" col-md-"+col+" col-lg-"+col;
            }
               
            
            return columnClass;        
        } 
        
        var setBoxMargin = function() { 
            var boxmargin = pf.settings.margin+"px";
            
            return boxmargin;   
        }       
        
        var setup = function(){            
            switch (pf.settings.mode) {
            case "image":   
                setupImagePorto();                
                break;
            case "video": 
                setupVideoPorto();        
                break;
            }
        }
        
        var setupImagePorto = function(){            
            var pf_image   = $("<img />").addClass("pf-img pf-anim").attr("src", getImage()); 
            
            setupBase(pf_image);            
        }
        
        var setupVideoPorto = function(){            
            var pf_video   = $("<iframe />")
                         .addClass("pf-vid pf-anim")
                         .attr("frameborder", "0")
                         .attr("allowfullscreen", "true")
                         .attr("src", getVideo());   
            setupBase(pf_video);            
        }
        
        var setupBase = function(pf_media){            
            var pf_container = $("<a />").addClass("pf-container");

            pf_container.append(pf_media); 
            pf_container.append(appendCaption());
            
            $thisElement.append(pf_container);                       
        }
        
        var appendCaption = function() { 
            var pf_caption       = $("<div />").addClass("pf-caption");
        
            var pf_caption_inner = $("<div />").addClass("pf-caption-inner");

            var pf_caption_title = $("<h3 />").addClass("pf-caption-title").html(getTitle());

            var pf_caption_text  = $("<p />")
                                   .addClass("pf-caption-text hidden-xs hidden-sm hidden-md")
                                   .html(getText());

            var pf_caption_icon_a= $("<center />");  

            var pf_caption_icon  = $("<div />").addClass("pf-icon-btn pf-icon"); 
            
            if(!pf.settings.responsive){
                pf_caption.addClass("hidden-xs hidden-sm");
            }
            
            if(pf.settings.caption){
                switch (pf.settings.captionMode) {
                case "title":                    
                    pf_caption_inner.append(pf_caption_title);
                    break;
                case "text": 
                    pf_caption_inner.append(pf_caption_text);
                    pf_caption_icon_a.addClass("hidden-lg");
                    pf_caption_icon_a.append(pf_caption_icon);
                    pf_caption_inner.append(pf_caption_icon_a);                    
                    break;
                case "icon":                    
                    pf_caption_icon_a.append(pf_caption_icon);
                    pf_caption_inner.append(pf_caption_icon_a);
                    break;  
                case "title|text":                    
                    pf_caption_inner.append(pf_caption_title);
                    pf_caption_inner.append(pf_caption_text);
                    break;                
                default: 
                    pf_caption_icon_a.append(pf_caption_icon);
                    pf_caption_inner.append(pf_caption_icon_a);               
                }
                
                pf_caption.append(pf_caption_inner);
            }
            else{
                pf_caption = null;
            }
            
            
            return pf_caption;            
        }
        
        var setCaptionBackground = function() {
            $(".pf-caption").css("background-color", pf.settings.background);        
        }

        var setCaptionTextColor = function() {
            $(".pf-caption-title").css("color", pf.settings.textColor);  
            $(".pf-caption-text").css("color", pf.settings.textColor);        
        }
        
        var setCaptionFit = function() {        
            if(pf.settings.captionFit){
                $(".pf-caption").addClass("pf-caption-fit");
            }
            else{
                $(".pf-caption").addClass("pf-caption-nofit");
            }            
        } 
        
        var setCaptionAnimation = function() {        
            if(pf.settings.animateCaption){
                $(".pf-caption-inner").addClass("pf-animate-caption");
            }          
        }
                
        var setAnimation = function() {        
            switch (pf.settings.animation) {
                case "pf-zoomin":                    
                    $(".pf-anim").addClass("pf-zoomin-img");
                    $(".pf-container").addClass("pf-zoomin-container");
                    break;
                case "pf-zoomout":                    
                    $(".pf-anim").addClass("pf-zoomout-img");
                    $(".pf-container").addClass("pf-zoomout-container");
                    break;
                case "pf-flip-left":                    
                    $(".pf-anim").addClass("pf-flip-img");
                    $(".pf-caption").addClass("pf-flip-left-caption");
                    $(".pf-container").addClass("pf-flip-container");
                    $(".pf-wrapper").addClass("pf-flip-wrapper pf-flip-left-wrapper");
                    break;
                case "pf-flip-right":                    
                    $(".pf-anim").addClass("pf-flip-img");
                    $(".pf-caption").addClass("pf-flip-right-caption");
                    $(".pf-container").addClass("pf-flip-container");
                    $(".pf-wrapper").addClass("pf-flip-wrapper pf-flip-right-wrapper");
                    break;
                case "pf-flip-up":                    
                    $(".pf-anim").addClass("pf-flip-img");
                    $(".pf-caption").addClass("pf-flip-up-caption");
                    $(".pf-container").addClass("pf-flip-container");
                    $(".pf-wrapper").addClass("pf-flip-wrapper pf-flip-up-wrapper");
                    break;
                case "pf-flip-down":                    
                    $(".pf-anim").addClass("pf-flip-img");
                    $(".pf-caption").addClass("pf-flip-down-caption");
                    $(".pf-container").addClass("pf-flip-container");
                    $(".pf-wrapper").addClass("pf-flip-wrapper pf-flip-down-wrapper");
                    break;
                case "pf-flip-rotate":                    
                    $(".pf-anim").addClass("pf-flip-img");
                    $(".pf-caption").addClass("pf-flip-rotate-caption");
                    $(".pf-container").addClass("pf-flip-rotate-container");
                    $(".pf-wrapper").addClass("pf-flip-wrapper pf-flip-rotate-wrapper");
                    break;
                case "pf-fade":
                    $(".pf-caption").addClass("pf-fade-caption");
                    $(".pf-container").addClass("pf-fade-container");
                    break; 
                case "pf-popup":
                    $(".pf-caption").addClass("pf-popup-caption");
                    $(".pf-container").addClass("pf-popup-container");
                    break;
                case "pf-slide-up":
                    $(".pf-caption").addClass("pf-slide-up-caption");
                    $(".pf-container").addClass("pf-slide-up-container");
                    break;
                case "pf-slide-down":
                    $(".pf-caption").addClass("pf-slide-down-caption");
                    $(".pf-container").addClass("pf-slide-down-container");
                    break;
                case "pf-slide-left":
                    $(".pf-caption").addClass("pf-slide-left-caption");
                    $(".pf-container").addClass("pf-slide-left-container");
                    break;
                case "pf-slide-right":
                    $(".pf-caption").addClass("pf-slide-right-caption");
                    $(".pf-container").addClass("pf-slide-right-container");
                    break;
                case "pf-move-left":
                    $(".pf-anim").addClass("pf-move-left-img");
                    $(".pf-caption").addClass("pf-move-left-caption");
                    $(".pf-container").addClass("pf-move-left-container");
                    $(".pf-wrapper").addClass("pf-move-left-wrapper");
                    break;
                case "pf-move-right":
                    $(".pf-anim").addClass("pf-move-right-img");
                    $(".pf-caption").addClass("pf-move-right-caption");
                    $(".pf-container").addClass("pf-move-right-container");
                    $(".pf-wrapper").addClass("pf-move-right-wrapper");
                    break;
                case "pf-hide":
                    $(".pf-anim").addClass("pf-hide-img");
                    $(".pf-caption").addClass("pf-hide-caption");
                    $(".pf-container").addClass("pf-hide-container");
                    break;  
                default:
                    $(".pf-caption").addClass("pf-caption-display");
            }  
        }
        
        var setOnclickAction = function(){            
            switch (pf.settings.onclickAction) {
                case "url":                    
                if(pf.settings.clickEventOn == "box"){
                    $thisElement.css("cursor", "pointer");
                    $thisElement.on('click',function() {
                      if(pf.settings.linkTarget == "new"){
                          window.open(getUrl($(this)), '_blank');
                      }
                      else{
                          window.open(getUrl($(this)), '_parent');
                      }
                    });
                }
                else if(pf.settings.clickEventOn == "caption"){
                    $thisElement.find('.pf-caption').css("cursor", "pointer");
                    $thisElement.find('.pf-caption').on('click',function() {
                        if(pf.settings.linkTarget == "new"){
                          window.open(getUrl($(this).closest(".pf")), '_blank');
                        }
                        else{
                          window.open(getUrl($(this).closest(".pf")), '_parent');
                        }
                    });
                }
                else{
                    $thisElement.find('.pf-icon-btn').css("cursor", "pointer");
                    $thisElement.find('.pf-icon-btn').on('click',function() {
                        if(pf.settings.linkTarget == "new"){
                          window.open(getUrl($(this).closest(".pf")), '_blank');
                        }
                        else{
                          window.open(getUrl($(this).closest(".pf")), '_parent');
                        }
                    });
                }                
                break;                
                case "popup": 
                setupBasePopup();
                activatePopupControllers();
                if(pf.settings.clickEventOn == "box"){
                    $thisElement.css("cursor", "pointer");
                    $thisElement.on('click',function() {                        
                        initPopup();                         
                        activatePopup($(this).index());
                                            
                        $('.pf-modal').addClass('is-visible');
                        hideOverFlow();                        
                    });                    
                }
                else if(pf.settings.clickEventOn == "caption"){
                    $thisElement.find('.pf-caption').css("cursor", "pointer");
                    $thisElement.find('.pf-caption').on('click',function() {
                        initPopup();                        
                        activatePopup($(this).parents(':eq(1)').index());

                        $('.pf-modal').addClass('is-visible');
                        hideOverFlow();
                    });                    
                }
                else{
                    $thisElement.find('.pf-icon-btn').css("cursor", "pointer");                    
                    $thisElement.find('.pf-icon-btn').on('click',function() {
                        initPopup();
                        activatePopup($(this).parents(':eq(4)').index());

                        $('.pf-modal').addClass('is-visible');
                        hideOverFlow();
                        
                    });  
                }                
                break;
            }            
        }
        
        var setupBasePopup = function(){            
            var body                     = $('body');
        
            var pf_modal                 = $("<div />").attr("id", "pfModal").addClass("pf-modal");

            var pf_modal_container       = $("<div />").addClass("pf-modal-container");
            
            var pf_modal_slide_container = $("<div />").addClass("pf-modal-slide-container");
            
            if($("#pfModal").length){$("#pfModal").remove();}
            
            pf_modal.css("background", pf.settings.backdropColor);
            pf_modal_container.addClass("pf-modal-"+pf.settings.popupSize);
            
            
            if(pf.settings.controls){
                //append close controller
                if(pf.settings.closeController){
                pf_modal.append(appendCloseController());
                }
                //append navigation controllers
                if(pf.settings.navController){
                pf_modal_container.append(appendLeftController());
                pf_modal_container.append(appendRightController());  
                }
            }
            
            pf_modal_container.append(pf_modal_slide_container);
            pf_modal.append(pf_modal_container);
        
            body.append(pf_modal);            
        }
        
        var appendCloseController = function(){        
            var pf_modal_close    = $("<a />").addClass("pf-modal-close text-center");
            var pf_modal_close_ic = $("<div />").addClass("pf-modal-icon-close");
            
            pf_modal_close.append(pf_modal_close_ic);

            return pf_modal_close;            
        }
        
        var appendLeftController  = function(){            
            var pf_modal_control_left  = $("<div />").addClass("pf-modal-control pf-modal-control-left");
        
            var pf_modal_nav_left      = $("<a />")   
                                        .attr("id", "pf-prev")
                                        .attr("title", "Previous")
                                        .addClass("pf-modal-nav pf-modal-nav-left");

            var pf_modal_left_ic       = $("<div />").addClass("pf-modal-icon-left");
            
            if(pf.settings.fixedNavigation){pf_modal_nav_left.addClass("pf-modal-nav-left-visible");}
            else{pf_modal_nav_left.addClass("pf-modal-nav-left-hidden");}
            
            pf_modal_nav_left.append(pf_modal_left_ic);
            pf_modal_control_left.append(pf_modal_nav_left);
            
            return pf_modal_control_left;
        }
        
        var appendRightController  = function(){            
            var pf_modal_control_right = $("<div />").addClass("pf-modal-control pf-modal-control-right");
        
            var pf_modal_nav_right     = $("<a />")   
                                        .attr("id", "pf-next")
                                        .attr("title", "Next")
                                        .addClass("pf-modal-nav pf-modal-nav-right");

            var pf_modal_right_ic      = $("<div />").addClass("pf-modal-icon-right");
            
            if(pf.settings.fixedNavigation){pf_modal_nav_right.addClass("pf-modal-nav-right-visible");}
            else{pf_modal_nav_right.addClass("pf-modal-nav-right-hidden");}
            
            pf_modal_nav_right.append(pf_modal_right_ic);
            pf_modal_control_right.append(pf_modal_nav_right);
            
            return pf_modal_control_right;            
        }
        
        var activatePopupControllers = function(){  
            //next btn
            $('.pf-modal-nav-right').on('click',function() {   
                if(pf.settings.mode == "video"){refreshVideo();}                
                goToNextPopup();                
            });

            //previous btn
            $('.pf-modal-nav-left').on('click',function() {
                if(pf.settings.mode == "video"){refreshVideo();}     
                goToPrevPopup();
            });   
            
            //close popup
            $('.pf-modal').on('click',function(event) {
                if($(event.target).is('.pf-modal-icon-close')) { 
                    $(this).removeClass('is-visible');
                    showOverFlow();
                    if(pf.settings.mode == "video"){refreshVideo();}     
                }      
                if($(event.target).is('.pf-modal') && pf.settings.backdropClose){
                    $(this).removeClass('is-visible');
                    showOverFlow();
                    if(pf.settings.mode == "video"){refreshVideo();}     
                }
            });
            
            //close popup on escape
            if(pf.settings.closeOnEsc){                
                $(document).keyup(function(event){
                    if(event.which=='27'){                        
                        $('.pf-modal').removeClass('is-visible');
                        showOverFlow();   
                    } 
                });
            }
        }
        
        var getCurrentIndex = function(){
            return $(".pf-modal-slide-container").find(".pf-modal-active").index();
        }
        
        var getIndexCount = function(){
            return $(".pf-modal-slide-container .pf-modal-media").length;
        }
        
        var goToNextPopup = function(){              
            var activeIndex = getCurrentIndex()+1;

            if(activeIndex < getIndexCount()){  
                activatePopup(activeIndex);
            }
            else{
                activeIndex = 0;            
                activatePopup(activeIndex);
            } 
        }
        
        var goToPrevPopup = function(){                        
            var activeIndex = getCurrentIndex()-1;
            
            if(activeIndex == -1){  
                activeIndex = getIndexCount()-1;            
                activatePopup(activeIndex);
            }
            else{                              
                activatePopup(activeIndex);
            }            
        }
        
        var initPopup = function(){
            $(".pf-modal-slide-container").empty();
            
            $element.find('.pf').each(function (index, value) {                 
                switch (pf.settings.mode) {
                case "image":    
                    setupImagePopup($(this));                        
                    break;
                case "video": 
                    setupVideoPopup($(this));
                    break;
                } 
            });            
        }    
            
        var setupImagePopup = function($this){            
            var img = $this.data("pf-image"); 
            
            var pf_modal_img = $("<img />").addClass("pf-modal-media pf-modal-img").attr("src", img);
            
            $(".pf-modal-slide-container").append(pf_modal_img);
        }
        
        var setupVideoPopup = function($this){            
            var vid = $this.data("pf-video"); 
            
            var pf_modal_vid = $("<iframe />")
                             .addClass("pf-modal-media pf-modal-vid")
                             .attr("frameborder", "0")
                             .attr("allowfullscreen", "true")
                             .attr("src", vid);     
            
            $(".pf-modal-slide-container").append(pf_modal_vid);
        }  
        
        var activatePopup = function(activeIndex){
            $('.pf-modal-slide-container .pf-modal-media').each(function (index, value) { 
                
                if($(this).hasClass("pf-modal-active")){
                    $(this).removeClass("pf-modal-active");
                }
                
                if(index == activeIndex){
                    $(this).addClass("pf-modal-active");
                }                
            });
        }        
        
        var hideOverFlow = function() {
            $('body').removeClass("body-overflow-auto");
            $('body').addClass("body-overflow-hidden");
        }

        var showOverFlow = function() {
            $('body').removeClass("body-overflow-hidden");
            $('body').addClass("body-overflow-auto");
        }
        
        var refreshVideo = function(){ 
            var $iframe = $(".pf-modal-active");
            var vidsrc = $iframe.attr('src');            
           
            $iframe.attr('src','');             
            
            $iframe.attr('src', vidsrc);
        }      
        
        
        init();

    };   
    
    $.fn.porto = function(options) {
        return this.each(function() {

        if (undefined == $(this).data('porto')) {
            var plugin = new $.porto(this, options);

            $(this).data('porto', plugin);
        }

        });
    };    
    
})(jQuery);