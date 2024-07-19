const mainScript = () => {
    gsap.registerPlugin(ScrollTrigger);

    $('html').css('scroll-behavior', 'auto');
    $('html').css('height', 'auto');

    let lenis = new Lenis({})

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    lenis.on('scroll', function(inst) {
        if (inst.scroll > $('.nav').height() * 1.5) {
            if (inst.direction >= 1) {
                $('.nav').addClass('on-hide')
                if ($('.term-stick').length) {
                    $('.term-stick').addClass('on-scroll')
                }
            } else {
                $('.nav').removeClass('on-hide')
                if ($('.term-stick').length) {
                    $('.term-stick').removeClass('on-scroll')
                }
            }
            $('.nav').addClass('on-scroll')
        } else {
            $('.nav').removeClass('on-scroll')
            $('.nav').removeClass('on-hide')
            if ($('.term-stick').length) {
                $('.term-stick').removeClass('on-scroll')
            }
        }
    })

    if ($(window).width() > 767) {
    } else {
        $('.home-fea-cms').addClass('swiper')
        $('.home-fea-list').addClass('swiper-wrapper')
        $('.home-fea-item').addClass('swiper-slide')
        const homeFeaSwiper = new Swiper('.home-fea-cms',{
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: '.home-fea-swiper-pagi',
                type: 'bullets'
            }
        })
    }

    $('[data-popup="open"]').on('click', function(e) {
        e.preventDefault();
        let formType = $(this).attr('data-content');
        $(`.popup-wrap[data-content="${formType}"]`).addClass('active');
        if($(this).attr('data-content') == 'video') {
            $('.popup-wrap[data-content="video"]').find('video').get(0).play()
        }
        lenis.stop()
    })
    $('[data-popup="close"]').on('click', function(e) {
        e.preventDefault();
        console.log("click");
        $(this).closest('.popup-wrap').removeClass('active')
        if ($(this).closest('.popup-wrap').attr('data-content') == 'video') {
            $(this).closest('.popup-wrap').find('video').get(0).pause()
        }
        lenis.start()
    })

    $(".hamburger").on("click", function (e) {
        e.preventDefault();

        if ($("body").hasClass("open-nav")) {
            $("body").removeClass("open-nav");
            $('.nav-menu').slideUp();
        }
        else {
            $("body").addClass("open-nav");
            $('.nav-menu').slideDown();
        }
    })

    const activeDOM = (domDetect, index) => {
		domDetect.removeClass('active');
		domDetect.eq(index).addClass('active');
	}

    function createToc(richTextEl) {
        let headings = $(richTextEl).find('h2');
        let tocWrap = $('.term-toc-wrap');

        if (headings.length <= 1) {
            tocWrap.parent().remove();
        }

        tocWrap.html('');
        for (let i = 0; i < headings.length; i++) {
            headings.eq(i).attr('id', `toc-${i}`);
            let tocItem = $('<a></a>').addClass('txt-14 term-toc-item').attr('href', `#toc-${i}`);
            let tocOrdinal = $('<div></div>').addClass('term-toc-num').text(`${i + 1}.`).appendTo(tocItem);
            let tocName = $('<span></span>').text(headings.eq(i).text()).appendTo(tocItem)
            tocWrap.append(tocItem);
        }

        lenis.on('scroll', function (e) {
            let currScroll = e.scroll;
            for (let i = 0; i < headings.length; i++) {
                let top = headings.eq(i).get(0).getBoundingClientRect().top;
                if (top > 0 && top < ($(window).height() / 5)) {
                    $(`.term-toc-item[href="#toc-${i}"]`).addClass('active');
                    $(`.term-toc-item`).not(`[href="#toc-${i}"]`).removeClass('active');
                }
            }
        });

        $('.term-toc-item').on('click', function (e) {
            e.preventDefault();

            let target = $(this).attr('href');

            lenis.scrollTo(target, {
                offset: -125
            })

            return false;
        })
    }

	const SCRIPT = {};
    SCRIPT.homeScript = () => {
        if ($('.home-abt-title-wrap').length >= 1) {
            let title = new SplitText('.home-abt-title', { type: 'lines, words, chars'});
            let tl = gsap.timeline({
                scrollTrigger: { 
                    trigger: '.sc-home-abt',
                    start: 'top bottom-=25%',
                    endTrigger: '.home-abt-title',
                    end: 'top top',
                    scrub: true
                }
            })
            tl.to(title.chars, {color: '#fff', duration: 1, easing: 'linear', stagger: 0.1})
        }
    }
    SCRIPT.productScript = () => {
        console.log('enter product')
        if ($('.prod-lg-tab-item').length >= 1) {
            $('.prod-lg-tab-item').on('click', function(e) {
                e.preventDefault()
                let target = $(this).index()
                console.log(target)
                $('.prod-lg-tab-item').removeClass('active')
                $(this).addClass('active')
                $('.prod-lg-body-item').removeClass('active')
                $('.prod-lg-body-item').eq(target).addClass('active')
            })
        }
        if ($('.prod-why-accord-wrap').length >= 1) {
            $('.prod-why-accord-wrap').each((idx, el) => {
                let allItems = $(el).find('.prod-why-accord-item-head');
                allItems.on('click', function(e) {
                    e.preventDefault();
                    if ($(this).closest('.prod-why-accord-item').hasClass('active')) {
                        $(this).closest('.prod-why-accord-item').removeClass('active')
                        $(this).closest('.prod-why-accord-item').find('.prod-why-accord-item-body').slideUp();
                    } else {
                        $(el).find('.prod-why-accord-item').removeClass('active');
                        $(el).find('.prod-why-accord-item-body').slideUp();
                        $(this).closest('.prod-why-accord-item').addClass('active')
                        $(this).closest('.prod-why-accord-item').find('.prod-why-accord-item-body').slideDown();
                    }
                })
            })
        }
    }
    SCRIPT.faqScript = () => {
        console.log("faq");

        const handleAccordion = () => {
			const DOM = {
				accordion: $(".accordion"),
				title: $(".accordion-title"),
				content: $(".accordion-content"),
			}
			DOM.content.hide();
			DOM.accordion.on('click', function (e) {
                e.preventDefault();
                let contentTarget = $(this).find(DOM.content);
                var target = $(e.target);
                if (target.hasClass('accordion-content')) return;
                else {
                    $(this).toggleClass('active');
                    contentTarget.slideToggle();
                    DOM.content.not(contentTarget).slideUp();
                    DOM.accordion.not($(this)).removeClass('active');
                }
			})
        }

        const handleTab = (index) => {
			const DOM = {
				tab: $('.faq-content-tab-item'),
				content: $('.faq-content-list-item'),
			}
			const activeTab = (index) => {
				activeDOM(DOM.tab, index);
				activeDOM(DOM.content, index);

				DOM.content.fadeOut("slow");
				DOM.content.eq(index).fadeIn("slow");
			}

			DOM.tab.on('click', function (e) {
				e.preventDefault();
				let index = $(this).index();
                const myTimeout = setTimeout(() => activeTab(index), 300);
			})
            activeTab(index);
        }

        const handleAnchor = () => {
            const DOM = {
                btn: $('.faq-content-tab-item')
            }
            DOM.btn.on('click', function (e) {
                e.preventDefault();
                let target = `#${$(this).attr('data-id')}`
                let index = $(this).index();
				activeDOM(DOM.btn, index);
                lenis.scrollTo(target, {
                    offset: -100,
                    duration: 1.7,
					easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                })
                return false;
            })
        }
		function init() {
			handleAccordion();
			// handleTab(0);
            handleAnchor();
        }
        if ($('.accordion-ic-wrap').css('display') != 'none') {
            init();
        }
    }
    SCRIPT.termScript = () => {
        createToc('.term-main-rictxt')
    }
    SCRIPT.templateScript = () => {
        $('.tp-hero-tab-content-wrap .tp-hero-tab-content').removeClass('hidden-def');
        $('.tp-hero-tab-content-wrap .tp-hero-tab-content').eq(0).addClass('active');
        $('.tp-hero-tab-heading .tp-hero-tab-heading-box').eq(0).addClass('active');

        function templateHeroTab(){
            $('.tp-hero-tab-heading .tp-hero-tab-heading-box').on('click',function(){
                let index = $(this).index();
                $('.tp-hero-tab-heading .tp-hero-tab-heading-box').removeClass('active');
                $(this).addClass('active');
                $('.tp-hero-tab-content-wrap .tp-hero-tab-content').removeClass('active');
                $('.tp-hero-tab-content-wrap .tp-hero-tab-content').eq(index).addClass('active');
            })
        }
        lenis.on('scroll', function(inst) {
            if (inst.scroll > $('.nav-tp').height() * 1.5) {
                if (inst.direction >= 1) {
                    $('.nav-tp').addClass('on-hide')
                    if ($('.term-stick').length) {
                        $('.term-stick').addClass('on-scroll')
                    }
                } else {
                    $('.nav-tp').removeClass('on-hide')
                    if ($('.term-stick').length) {
                        $('.term-stick').removeClass('on-scroll')
                    }
                }
                $('.nav-tp').addClass('on-scroll')
            } else {
                $('.nav-tp').removeClass('on-scroll')
                $('.nav-tp').removeClass('on-hide')
                if ($('.term-stick').length) {
                    $('.term-stick').removeClass('on-scroll')
                }
            }
        })
        templateHeroTab();
    }
    const pageName = $(".main").attr("name-space");
	if (pageName) {
		SCRIPT[`${pageName}Script`]();
	}
}
window.onload = mainScript;