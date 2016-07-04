console.log("custom.js");

var md = new MobileDetect(window.navigator.userAgent);


// Revert jQuery $ alias
(function($,sr) {


	// debouncing function from John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	  var debounce = function (func, threshold, execAsap) {
	      var timeout;

	      return function debounced () {
	          var obj = this, args = arguments;
	          function delayed () {
	              if (!execAsap)
	                  func.apply(obj, args);
	              timeout = null;
	          };

	          if (timeout)
	              clearTimeout(timeout);
	          else if (execAsap)
	              func.apply(obj, args);

	          timeout = setTimeout(delayed, threshold || 100);
	      };
	  }
	  // smartresize 
	  $.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };


		
	// document ready
	$(function() {

		// Mobile header ===================================================

		var MobileTop = function(bar){

			var self = this;

			this.stick = function(){
				bar.sticky({topSpacing: 0})
			};


			// ****************************** Navigation ******************************
			this.setMenuDelays = function(start, add){
				$("#mobile-categories .mobile-cats-inner > ul > li").each(function(i){
					$(this).css("transition-delay", (start + i*add) + "s");
				});
			};

			this.hamburgerToggle = function(){
				$("#mobile_hamburger, #mobile-categories").toggleClass("open");

				if ($("#mobile_hamburger").hasClass("open")) {
					this.hamburgerOpen();
				} else {
					this.hamburgerClose();
				};
			};

			this.hamburgerOpen = function(){
				this.closeAccount();
				var openH = this.getHamburgerH();

				var windowH = $(window).height();
				var topSpace = $("#mobile-nav").offset().top;
					topSpace = (topSpace == $(window).scrollTop())? 0 : topSpace-$(window).scrollTop();
				var barH = $("#mobile-nav .nav-inner").outerHeight() + 10;
				var space = windowH - barH - topSpace;
				var maxH = (space < openH)? space : openH;
				if($("#mobile-nav").parent().hasClass("is-sticky")) {
					maxH = windowH - barH;
				}	
				$("#mobile-categories").css({"max-height": maxH + "px"});

			};

			this.hamburgerClose = function(){
				$("#mobile-categories").css("max-height", 0 + "px");

				// Close all submenu items
				$("#mobile_hamburger, #mobile-categories").removeClass("open");
				$("#mobile-categories li ul").removeClass("open").css({"max-height": "0px", "overflow": "hidden"});
				$("#mobile-categories li .expand").text("+");
			};

			this.getHamburgerH = function(){
				var selector = "#mobile-categories .mobile-cats-inner, #mobile-categories li ul.open .sub-inner";
				var hamburgerH = 0;
				$(selector).each(function(){
					hamburgerH = hamburgerH+$(this).outerHeight();
				});
				console.log("hamburgerH:" + hamburgerH);
				return hamburgerH;
			};

			this.toggleSub = function(expander){
				var subUl = $(expander).prev("ul");
				subUl.toggleClass("open");

				if(subUl.hasClass("open")){
					console.log("open sub");
					self.closeAllSub(expander);
					self.expandSub(expander);
				} else{
					console.log("close sub");
					self.collapseSub(expander);
				};
			};

			this.getSubH = function(subinner){
				var subsH = subinner.outerHeight();
				return subsH;
			};

			this.closeAllSub = function(expander){
				var exceptionUl = $(expander).prev("ul");
				$("#mobile-categories li ul").not(exceptionUl).removeClass("open").css("max-height", "0px");
				$("#mobile-categories li .expand").not($(expander)).text("+");
			};

			this.expandSub = function(expander){
				var subsInner = $(expander).prev().children(".sub-inner").eq(0);
				var subsH = this.getSubH(subsInner);
				var subUl = $(expander).prev("ul");
				console.log(subsH);

				// expand main
				this.hamburgerOpen();

				// expand sub
				subUl.css("max-height", subsH + "px");
				$(expander).text("-");
			};

			this.collapseSub = function(expander){ ///// REVISE
				console.log("collapse");
				// shrink sub
				$(expander).text("+");
				var subUl = $(expander).prev("ul");
				subUl.css("max-height", 0 + "px");

				// shrink main
				this.hamburgerOpen();

			};
			// ****************************** // Navigation ******************************


			// ******************************  Search ******************************
			this.toggleSearch = function(){
				var searchBar = $("#mobile-search")
				searchBar.toggleClass("open");

				if(searchBar.hasClass("open")) { // opening
					self.openSearch();
				} else { // closing
					self.closeSearch();
				};
			};

			this.openSearch = function(){
				this.hamburgerClose();
				this.closeAccount();
				setTimeout(function(){
					if (self.searchValue) {
						$("#mobile-search input").val(self.searchValue);
					}
				}, 200);
				setTimeout(function(){
					$("#mobile-search input").eq(0).focus();
				}, 250);
			};

			this.closeSearch = function(){
				$("#mobile-search input").eq(0).blur();
				self.searchValue = $("#mobile-search input").val();
				setTimeout(function(){
					$("#mobile-search input").eq(0).val("");
				}, 500);
			};

			this.resetSearch = function(){
				$("#mobile-search input").eq(0).val("");
			};

			// ****************************** // Search ******************************

			// ******************************  Account ******************************
			this.toggleAccount = function(){
				$("#account-toggle").toggleClass("open");

				if ($("#account-toggle").hasClass("open")) { //opening
					self.openAccount();
				} else { //closing
					self.closeAccount();
				};
			};

			this.getAccountH = function(){
				var h = $("#mobile-login .inner").outerHeight();
				return h;
			};

			this.openAccount = function(){
				this.hamburgerClose();
				var h = this.getAccountH();
				$("#mobile-login").css("max-height", h+"px");
			};
			this.closeAccount = function(){
				$("#account-toggle").removeClass("open");
				$("#mobile-login").css("max-height", 0+"px");
			};
			// ****************************** // Account ******************************


			// INITIALIZE
			this.init = function(){
				this.stick();
				this.setMenuDelays(0.1, 0.01);

				// main nav toggle
				$("#mobile_hamburger").click(function(){
					self.hamburgerToggle();
				});

				// nav sub item toggle
				$("#mobile-categories .expand").click(function(){
					self.toggleSub(this);
				});


				// Search toggle
				$("#mobilesearch_toggle").click(function(){
					self.toggleSearch();
				});

				// Search reset
				$("#mobilesearch_reset").click(function(){
					self.resetSearch();
				});

				// Account toggle
				$("#account-toggle").click(function(){
					self.toggleAccount();
				});

			};
			this.init();

		};

		var mobileTop = new MobileTop($("#mobile-nav"));


		// Mood Parallax
		$(window).load(function() {
			$(".mood-parallax").each(function(){
				var container = $(this);
				var windowW = $(window).width();
				var windowH = $(window).height();
				var imageUrl = $(this).css("background-image").match(/\".+\"/);
				var imageUrl = imageUrl[0].substring(1,(imageUrl[0].length-1));
				var containerH = Math.floor($(this).outerHeight());

				// Get natural dimensions of bg image
				// Create new offscreen image to test
				var theImage = new Image();
				theImage.src = imageUrl;

				// Get accurate measurements from that.
				var imageWidth = theImage.width;
				var imageHeight = theImage.height;
				// rendered height of bg image
				var imageRenderedH = imageHeight*(windowW/imageWidth);

				var maxTravel = Math.floor(imageRenderedH - containerH);


				// parallax top offset
				var topSpace = $(this).offset().top;
				console.log(topSpace);
					
				// initial adjustment
				var scrollTop = $(window).scrollTop();
				var progress = scrollTop + windowH - topSpace;
				var maxProgress = containerH + windowH;
				var rate = progress / maxProgress;
				var parallax = maxTravel - Math.floor(maxTravel * rate);
				container.css("background-position", "center " + -parallax + "px");

				// adjust bg position on window scroll
				$(window).scroll(function(){
					var scrollTop = $(window).scrollTop();

					// if the parallax container is visible in the viewport
					if ((scrollTop + windowH ) > topSpace && scrollTop < (topSpace + containerH)) {
						var progress = scrollTop + windowH - topSpace;
						var maxProgress = containerH + windowH;
						var rate = progress / maxProgress;
						var parallax = maxTravel - Math.floor(maxTravel * rate);
						container.css("background-position", "center " + -parallax + "px");
					}
			    });
			});
		})
			

		// resize slider on resize
		$(window).smartresize(function(){
			$(".top-slider .slick-slider")[0].slick.refresh()
		});


		// Turn CMS content tables responsive
		$(".container .std table:not(.tablesaw)").each(function(){
			$(this).addClass("tablesaw tablesaw-stack").attr("data-tablesaw-mode", "stack");
			$( document ).trigger( "enhance.tablesaw" );
		});

		// hotfix cart dropdown (removed)

		// function cartDropdown(selector){
		// 	$("body").find(selector).hover(function(){
		// 		var container = $(this).find(".block-content");
		// 		var content = $(this).find(".block-inner");
		// 		var w = container.outerWidth();	
		// 		container.css("width", w+"px");
		// 		if (!container.hasClass("init")) {
		// 			container.show();
		// 			var h = content.outerHeight();
		// 			container.hide();
		// 			container.prepend("<div style='height: " + h + "px'></div>").addClass("init");
		// 		}
		// 		content.css({"position": "absolute", "left": "0", "bottom": "0"});
		// 		container.slideDown( "slow" );
		// 	}, function(){
		// 		var container = $(this).find(".block-content");
		// 		container.slideUp("slow");
		// 	});
		// }
		// cartDropdown(".header-top .mini-cartpro");

		// when cart button is updated, this re-equips it with the listener
		$(".header-top .mini-cartpro").on('DOMNodeRemoved', function(e) {
			setTimeout(function(){
				cartDropdown(".header-top .mini-cartpro");
			}, 500);
		});


		// Responsive table empty label fix: If the label is empty or contains only &nbsp;, the dont display it.
		setTimeout(function(){
			$(".tablesaw-cell-label").each(function(){
				if ($(this).text().length == 0 || $(this).text() == " ") {
					$(this).next(".tablesaw-cell-content").children().unwrap();
					$(this).remove();
				}
			});
		}, 100);


		// Sticky mobile header
		if (md.mobile() !== null) {
			$(".header-mobi").sticky({topSpacing:0});
			$("#sm_wrapper").addClass("sticky-top");
		}

		//  ===== Slider ===========================================
      	$('.slick-slider').slick({
      		adaptiveHeight: true,
      		easing: "easeInOutCubic",
      		speed: 500,
      		draggable: true
      	});

      	$(".top-slider .slick-slider").slick("slickSetOption", "fade", true);
      	$(".new-products-slider .slick-slider").slick("slickSetOption", "dots", true, true);


      	// On each slider init
      	$(".slick-slider").each(function(){
      		var slider = $(this);
      		slider.imagesLoaded( function() {
				// slider.css("min-height", "initial");
			});
		});


      	// Start video buffer on desktop
      	if (md.mobile() == null) {
      		$(".slick-slider video").attr("preload", true);
      		$("body").addClass("device-desktop");
      	} else {
      		$("body").addClass("device-mobile");

      		// It's a mobile device, so remove desktop-only slides
      		$(".slick-slider").each(function(){
				var slider = $(this).slick("getSlick");
	      		slider.$slides.each(function(i){
	      			if ($(this).hasClass("only-desktop")) {
	      				$(this).remove();
	      				slider.$slides.splice(i, 1);
	      				slider.slideCount = slider.slideCount-1;
	      			}
	      		});
      		});
	      		
      	}

    	// On before slide change
		$('.slick-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide){

			// Stop all videos
			$('.slick-slider video').each(function(){
				$(this).get(0).pause();
			});
			var slide = $(".slick-slider .slick-slide[data-slick-index=" + nextSlide + "]");
	  		if (slide.find("video").length > 0) {
	  			slide.find("video").get(0).play();
	  		}
		});


		// Click on product card
		$(".product.card").on("click", function(e){
			if (typeof $(this).data("url") !== "undefined") {
				var target = $( e.target );
				console.log("A");
				if (!target.hasClass(".btn-cart")) {
				console.log("B");
					if (e.ctrlKey) {
						window.open($(this).data("url"), '_blank');
					} else {
						setLocation($(this).data("url"));
					}
				}
			}
		});

		// Product card color preview
		$(".card.product .colors .color, .products-list .product-image .colors .color").hover(function(){
			var card = $(this).parents(".product");
			var url = $(this).data("image");
			card.find(".image, .product-imgs").prepend("<img src='" + url + "' />")
			card.find("img:not(.default)").fadeIn();
			card.find("img.default").css("opacity", 0);
		}, function(){
			var card = $(this).parents(".product");
			card.find("img:not(.default)").fadeOut(500, function(){
				$(this).remove();
			});
			card.find("img.default").css("opacity", 1);

		});



		// mailchimp newsletter Email subcribe form AJAX

		// show subscribe form only if not subscribed
		var subscribed = $.cookie('JT-newsletter-signed-up');
		if (!subscribed) {
			$(".email-form-ajax").show();
		}

		$(".email-form-ajax form").each(function(){
			$(this).on("submit", function(e){
				var form = $(this);
				e.preventDefault();
				// loading
				$(".email-form-ajax .note").removeClass("success warning");
				$(".email-form-ajax form .field").fadeOut(300, function(){
					$(".email-form-ajax form .loading").text("saving").fadeIn(300).css("display","inline-block");

					$.ajax({
				        type: "get",
				        url: form.attr('action'),
				        data: form.serialize(),
				        cache       : false,
				        dataType    : 'json',
				        contentType: "application/json; charset=utf-8",
				        error       : function(err) {
				        	console.log("could not connect");
				        	setTimeout(function(){
				        		$(".email-form-ajax form .loading").fadeOut(300, function(){
					        		$(".email-form-ajax form .field").fadeIn(300);
					        		$(".email-form-ajax .note").text("No connection. Try again, or maybe check your internet connection.").addClass("warning");
					        	});
				        	}, 1000);
					        	
				        },
				        success     : function(data) {
				            if (data.result != "success") {
				                // Something went wrong
				        		console.log("error");
				        		setTimeout(function(){
						        	$(".email-form-ajax form .loading").fadeOut(300, function(){
						        		$(".email-form-ajax form .field").fadeIn(300);
						        		$(".email-form-ajax .note").text(data.msg).addClass("warning");
						        	});
				        		}, 500);
				            } else {
				                // success
				        		console.log("success");
				        		setTimeout(function(){
						        	$(".email-form-ajax form .loading").fadeOut(300, function(){
						        		$(".email-form-ajax .note").text("Almost finished... We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.").addClass("success");
						        	});
				        		}, 1000);

				        		$.cookie('JT-newsletter-signed-up', 'true', { expires: 365 });
				            }
				        }
				    });
				});
				
			});
		});


		// complaint form submit
		$("#current_form_id + button[type=submit]").click(function(){
			var form = $(".formbuilder-form form").eq(0).submit();
		});



	});




	
})( jQuery,'smartresize' );