var mySlider = document.getElementsByClassName('slider');

var slider1 = slider(mySlider[0], {
	dots: true,
	animation: {
		time: 0.4
	}
});
// var slider2 = slider(mySlider[0]);

function slider(item, config) {
	var setting = makeSetting(config);
	var state = {
		firstStart: true,
		timer1: null,
		timer2: null
	};

	var parent = item.parentNode;
	var newSlider = makeInerSlider();

	parent.insertBefore(newSlider, item);
	parent.removeChild(item);

	return newSlider;

	function makeInerSlider() {
		var iner = document.createElement('div');
		iner.className = 'inerSlider';
		var sliderOld = item.cloneNode(true);
		sliderOld.className = 'mainSlider';

		var slides = makeSlides(sliderOld);
		var slideState = {
			numSlides: 0,
			maxSlides: slides.length
		};
		var panel = createPanel();
		iner.appendChild(sliderOld);
		iner.appendChild(panel);
		changeActive(0);
		return iner;

		function makeSlides(item) {
			var slides = item.children;
			[].forEach.call(slides, function(slide) {
				slide.className += ' sliderItem';
			});
			return slides;
		}

		function createPanel() {
			var left = createArrow('left');
			var right = createArrow('right');

			var panel = document.createElement('div');
			panel.className = 'sliderPanel';
			panel.appendChild(left);
			if (setting.dots) {
				panel.appendChild(createDots());
			}
			panel.appendChild(right);
			return panel;

			function createArrow (direction) {
				var arrow = document.createElement('div');
				if (direction === 'left') {
					arrow.className = 'arrowSlider leftArrow';
				} else if (direction === 'right') {
					arrow.className = 'arrowSlider rightArrow';
				}
				arrow.onclick = function () {
					if (direction === 'left') {
						changeActive(((+slideState.numSlides !== 0) ? slideState.numSlides - 1 : slideState.maxSlides - 1));
					}
					else if (direction === 'right') {
						changeActive(((+slideState.numSlides !== (slideState.maxSlides - 1)) ? +slideState.numSlides + 1 : 0));
					}
				}
				return arrow;
			}

			function createDots () {
				var wrap = document.createElement('div');
				wrap.className = 'dotsWrap';
				wrap.onclick = clickDots();
				for (var i = 0; i < slideState.maxSlides; i++) {
					var dot = document.createElement('div');
					dot.setAttribute('data-number', i);
					dot.className = 'dot';
					if (i === 0) {
						dot.className += ' active';
					}
					wrap.appendChild(dot);
				}
				return wrap;

				function clickDots () {
					return function (e) {
						if (isNaN(e.target.getAttribute('data-number'))) {
							return false;
						} else {
							changeActive(e.target.getAttribute('data-number'));
						}
					}
				}
			}
		}

		function changeActive(num) {
			slides = sliderOld.children;
			clearWaste(slides);
			var firstClass = slides[num].className;
			if (setting.dots) {
				var dots = document.querySelectorAll('.dot[data-number]');
			}
			if (state.firstStart) {
				slides[num].className = firstClass + ' visable';
				state.firstStart = false;
			} else {
				slides[slideState.numSlides].style.animation = setting.animation.nameHide + ' ' + setting.animation.time + 's';
			 	state.timer1 = setTimeout(function() {
					slides[slideState.numSlides].style.animation = '';
					slides[num].style.animation = setting.animation.nameShow + ' ' + setting.animation.time + 's';
					if (setting.dots) {
						dots[slideState.numSlides].className = dots[slideState.numSlides].className.replace(' active', '');
						dots[num].className += ' active';
					}
					slideState.numSlides = num;
				}, setting.animation.time*1000 - 50);
				state.timer2 = setTimeout(function() {
					slides[num].className = firstClass + ' visable';
				}, setting.animation.time*2000 - 50);
			}

			function clearWaste(slides) {
				clearTimeout(state.timer1);
				clearTimeout(state.timer2);
				if (slides[slideState.numSlides] !== undefined) {
					slides[slideState.numSlides].className = slides[slideState.numSlides].className.replace(' visable', '');
					slides[slideState.numSlides].style.animation = '';
					slides[slideState.numSlides].style.animation = '';
				}
			}
		}
	}

	function makeSetting(config) {
		var defaults = {
			dots: false,
			animation: {
				time: 0.4,
				nameShow: 'showslide',
				nameHide: 'hideslide'
			}
		};
		if (typeof config === 'object' && config !== null) {
			reWrite(config, defaults);
		}

		return defaults;

		function reWrite(obj, standartObj) {
			if (typeof obj === 'object' && obj !== null && typeof standartObj === 'object' && standartObj !== null ) {
				for (var value in standartObj) {
					if (typeof standartObj[value] !== typeof obj[value]) {
						continue;
					} else if (typeof standartObj[value] !== 'object') {
						standartObj[value] = obj[value];
					} else {
						reWrite(obj[value], standartObj[value]);
					}
				}
			}
		}
	}
}