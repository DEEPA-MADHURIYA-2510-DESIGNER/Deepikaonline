(function($) {

    "use strict";

    /*------------------------------------
      HT Predefined Variables
    --------------------------------------*/
    var jQuerywindow = jQuery(window),
        jQuerydocument = jQuery(document),
        jQuerybody = jQuery('body');

    //Check if function exists
    jQuery.fn.exists = function() {
        return this.length > 0;
    };


    /*------------------------------------
      HT PreLoader
    --------------------------------------*/
    function preloader() {
        jQuery('#ht-preloader').fadeOut();
    };


    /*------------------------------------
      HT Menu
    --------------------------------------*/
    jQuery.fn.themeht_is_bound = function(type) {
        if (this.data('events') !== undefined) {
            if (this.data('events')[type] === undefined || this.data('events')[type].length === 0) {
                return false;
            }
            return (-1 !== $.inArray(fn, this.data('events')[type]));
        } else {
            return false;
        }
    };


    function ht_navbar() {
        if (!jQuery('ul#menu-main-menu > li > a[href="#"]').themeht_is_bound('click')) {
            jQuery('ul#menu-main-menu > li > a[href="#"]').click(function() {
                return false;
            });
        }
        jQuery('.main-nav > ul li:has(ul)').append("<span class='sub-menu-toggle'><i class='bi bi-chevron-right'></i></span>");
        jQuery('.main-nav li').hover(function() {
            if (jQuery(this).children("ul").length == 1) {
                var parent = jQuery(this);
                var child_menu = jQuery(this).children("ul");
                if (jQuery(parent).offset().left + jQuery(parent).width() + jQuery(child_menu).width() > jQuery(window).width()) {
                    jQuery(child_menu).addClass('themeht-nav-left');
                } else {
                    jQuery(child_menu).removeClass('themeht-nav-left');
                }
            }
        });
        jQuery(".nav-menu-toggle").on("click tap", function() {

        });
        jQuery('.sub-menu-toggle').on('click', function() {
            if (jQuery(this).siblings('.sub-menu, .children').hasClass('show')) {
                jQuery(this).siblings('.sub-menu, .children').removeClass('show');
                jQuery('i', jQuery(this)).removeClass('bi bi-chevron-up').addClass('bi bi-chevron-right');
            } else {
                jQuery(this).siblings('.sub-menu, .children').addClass('show');
                jQuery('i', jQuery(this)).removeClass('bi bi-chevron-right').addClass('bi bi-chevron-up');
            }
            return false;
        });
        jQuery('.nav-menu-toggle').on('click', function() {
            jQuery('.main-nav ul.menu > li > a').on('click', function() {
                if (jQuery(this).attr('href') == '#' && jQuery(this).siblings('ul.sub-menu, ul.children').length > 0) {
                    jQuery(this).siblings('.sub-menu-toggle').trigger('click');
                    return false;
                }
            });
        })

        jQuery('#menu-toggle').on('click', function() {
            jQuery(".main-nav, body").toggleClass("menu-active");
        })
        if (jQuery('.main-nav > .closepanel').length == 0) {
            jQuery('.main-nav').append('<span class="closepanel"><i class="bi bi-x"></i></span>');

            jQuery('.main-nav > .closepanel').on('click', function() {
                jQuery(".main-nav, body").toggleClass("menu-active");
            });

            return false;
        }
    }


    /*------------------------------------
      HT Counter
    --------------------------------------*/
    function counter() {
        var elementSelector = jQuery('.count-number');
        elementSelector.each(function() {
            elementSelector.appear(function(e) {
                var el = this;
                var updateData = jQuery(el).attr("data-count");
                var od = new Odometer({
                    el: el,
                    format: 'd',
                    duration: 2000
                });
                od.update(updateData);
            });
        });
    };



    /*------------------------------------
      HT Scroll to top
    --------------------------------------*/
    function scrolltop() {
        var $backtotop = $('.scroll-top').length;
        if ($backtotop != '') {
            var progressPath = document.querySelector('.scroll-top path');
            var pathLength = progressPath.getTotalLength();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
            progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
            var updateProgress = function() {
                var scroll = jQuery(window).scrollTop();
                var height = jQuery(document).height() - jQuery(window).height();
                var progress = pathLength - (scroll * pathLength / height);
                progressPath.style.strokeDashoffset = progress;
            }
            updateProgress();
            jQuery(window).scroll(updateProgress);
            var offset = 50;
            var duration = 550;
            jQuery(window).on('scroll', function() {
                if (jQuery(this).scrollTop() > offset) {
                    jQuery('.scroll-top').addClass('active-progress');
                } else {
                    jQuery('.scroll-top').removeClass('active-progress');
                }
            });
            jQuery('.scroll-top').on('click', function(event) {
                event.preventDefault();
                jQuery('html, body').animate({
                    scrollTop: 0
                }, duration);
                return false;
            })
        };
    };


    /*------------------------------------
      HT Fixed Header
    --------------------------------------*/
    function fxheader() {
        jQuery(window).on('scroll', function() {
            var sticky = jQuery('#header-wrap'),
                scroll = jQuery(window).scrollTop();

            if (scroll >= 300) sticky.addClass('fixed-header');
            else sticky.removeClass('fixed-header');
        });
    };


    /*------------------------------------
      HT Search
    --------------------------------------*/
    function search() {
        // Search Toggle
        jQuery("#search-input-box").hide();
        jQuery("#search, #search-sticky").on("click", function() {
            jQuery("#search-input-box").slideToggle();
            jQuery("#search-input").focus();
        });
        jQuery("#close-search").on("click", function() {
            jQuery('#search-input-box').slideUp(500);
        });
    };

    /*------------------------------------------
      HT Text Color, Background Color And Image
    ---------------------------------------------*/
    function databgcolor() {
        jQuery('[data-bg-color]').each(function(index, el) {
            jQuery(el).css('background-color', jQuery(el).data('bg-color'));
        });
        jQuery('[data-text-color]').each(function(index, el) {
            jQuery(el).css('color', jQuery(el).data('text-color'));
        });
        jQuery('[data-bg-img]').each(function() {
            jQuery(this).css('background-image', 'url(' + jQuery(this).data("bg-img") + ')');
        });
    };


    /*------------------------------------
      HT Magnific Popup
    --------------------------------------*/
    function magnificpopup() {
        jQuery('.popup-gallery').magnificPopup({
            delegate: 'a.popup-img',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function(item) {
                    return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
                }
            }
        });
        if (jQuery(".popup-youtube, .popup-vimeo, .popup-gmaps").exists()) {
            jQuery('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });
        }

    };


    /*------------------------------------
      HT Isotope
    --------------------------------------*/
    function isotope() {
        // init Isotope
        var jQuerygrid = jQuery('.grid').isotope({
            itemSelector: '.grid-item',
            layoutMode: 'fitRows',
        });

        // filter functions
        var filterFns = {
            // show if number is greater than 50
            numberGreaterThan50: function() {
                var number = jQuery(this).find('.number').text();
                return parseInt(number, 10) > 50;
            },
            // show if name ends with -ium
            ium: function() {
                var name = jQuery(this).find('.name').text();
                return name.match(/iumjQuery/);
            }
        };

        // bind filter button click
        jQuery('.portfolio-filter').on('click', 'button', function() {
            var filterValue = jQuery(this).attr('data-filter');
            // use filterFn if matches value
            filterValue = filterFns[filterValue] || filterValue;
            jQuerygrid.isotope({
                filter: filterValue
            });
        });


        // change is-checked class on buttons
        jQuery('.portfolio-filter').each(function(i, buttonGroup) {
            var jQuerybuttonGroup = jQuery(buttonGroup);
            jQuerybuttonGroup.on('click', 'button', function() {
                jQuerybuttonGroup.find('.is-checked').removeClass('is-checked');
                jQuery(this).addClass('is-checked');
            });
        });
    };


    /*------------------------------------
      HT Masonry
    --------------------------------------*/
    function masonry() {
        var jQuerymasonry = jQuery('.masonry'),
            jQueryitemElement = '.masonry-brick',
            jQueryfilters = jQuery('.portfolio-filter');
        if (jQuerymasonry.exists()) {
            jQuerymasonry.isotope({
                resizable: true,
                itemSelector: jQueryitemElement,
            });
            // bind filter button click
            jQueryfilters.on('click', 'button', function() {
                var filterValue = jQuery(this).attr('data-filter');
                jQuerymasonry.isotope({
                    filter: filterValue
                });
            });
        }
    };


    /*------------------------------------
      HT Accordion
    --------------------------------------*/
    function accordion() {
        jQuery(document).on('click', '.elementor-accordion .elementor-accordion-item', function(jQuerythis) {
            jQuery('.elementor-accordion').find('.elementor-tab-content').removeAttr("hidden");
        });
        jQuery('.featured-item.style-1').mouseenter(function() {
            jQuery('.featured-item.style-1.featured-active').removeClass('featured-active');
            jQuery(this).removeClass('.featured-item.style-1').addClass('featured-active');
        });
    };

    /*------------------------------------
      HT Side Menu
    --------------------------------------*/
    function sidenav() {
        jQuery('.ht-nav-toggle').on('click', function(event) {
            event.preventDefault();
            var jQuerythis = jQuery(this);
            if (jQuery('body').hasClass('menu-show')) {
                jQuery('body').removeClass('menu-show');
                jQuery('#ht-main-nav > .ht-nav-toggle').removeClass('show');
            } else {
                jQuery('body').addClass('menu-show');
                setTimeout(function() {
                    jQuery('#ht-main-nav > .ht-nav-toggle').addClass('show');
                }, 900);
            }
        })
        jQuery('.elementor-widget-service-grid .row').each(function() {
            if (jQuery(this).find('.service-item.style-1:first').length > 0) {
                jQuery(this).find('.service-item.style-1:first').addClass('service-active');
            }
        });

        jQuery('.elementor-widget-service-grid .row .service-item.style-1 ').hover(function() {
            if (jQuery(this).parents('.elementor-widget-service-grid .row').length > 0) {
                jQuery(this).parents('.elementor-widget-service-grid .row').find('.service-item.style-1 ').removeClass('service-active');
                jQuery(this).addClass('service-active');
            }
        });
    };

    /*------------------------------------
      HT Particles
    --------------------------------------*/

    function particles() {
        jQuery("#particles-js").each(function() {
            particlesJS({
                "particles": {
                    "number": {
                        "value": 100,
                        "density": {
                            "enable": true,
                            "value_area": 4000
                        }
                    },
                    "color": {
                        "value": "random"
                    },
                    "shape": {
                        "type": "polygon",
                        "polygon": {
                            "nb_sides": 6
                        },
                        "image": {
                            "src": "img/github.svg",
                            "width": 100,
                            "height": 100
                        }
                    },
                    "opacity": {
                        "value": 1,
                        "random": true,
                        "anim": {
                            "enable": true,
                            "speed": 1,
                            "opacity_min": 0,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 4,
                            "size_min": 0.3,
                            "sync": false
                        }
                    },
                    "move": {
                        "enable": true,
                        "speed": 1,
                        "direction": "none",
                        "random": true,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 600
                        }
                    }
                },
                "retina_detect": true
            });

        })
    }


    /*------------------------------------
      HT sticky
    --------------------------------------*/
    var $stickysec = jQuery('.js-sticky').length;

    function sticky() {
        if ($stickysec != '') {
            const sticky_sec = document.querySelector(".js-sticky");
            var stickyEl = new Sticksy('.js-sticky', {
                topSpacing: 120,
            })
            stickyEl.onStateChanged = function(state) {
                if (state === 'fixed') stickyEl.nodeRef.classList.add('sticky-item')
                else stickyEl.nodeRef.classList.remove('sticky-item')
            }
        };
    };


    /*------------------------------------
      HT Background Move
    --------------------------------------*/
    function htbgmove() {
        const ht_elm = gsap.utils.toArray('.ht-bg-move');
        if (ht_elm.length == 0) return
        ScrollTrigger.matchMedia({
            "(min-width: 1600px)": function() {
                ht_elm.forEach((box, i) => {
                    let tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: box,
                            start: "top 80%",
                            end: "+=700px",
                            scrub: 1
                        },
                        defaults: {
                            ease: "none"
                        }
                    });
                    tl.fromTo(box, {
                        clipPath: 'inset(0% 0% 0% 0% round 30px)',
                        borderRadius: "30px"
                    }, {
                        clipPath: 'inset(0% 3% 0% 3% round 30px)',
                        duration: 3
                    })
                })
            }
        })

    };


    ScrollTrigger.matchMedia({
        "(max-width: 1200px)": function() {
            ScrollTrigger.getAll().forEach(t => t.kill())
        }
    });

    /*------------------------------------
      HT Window load and functions
    --------------------------------------*/
    jQuery(document).ready(function() {
        ht_navbar(),
            counter(),
            scrolltop(),
            fxheader(),
            search(),
            databgcolor(),
            magnificpopup(),
            accordion(),
            sidenav(),
            particles(),
            sticky(),
            htbgmove();
    });

    jQuery(window).on('elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction('frontend/element_ready/step.default', databgcolor);
    });

    jQuery(window).on('load', function() {
        preloader(),
            isotope(),
            masonry();
    });

})(jQuery);