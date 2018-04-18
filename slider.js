var mySlider = document.getElementsByClassName('slider');

var slider1 = new slider(mySlider[0], {
	dots: {isset: true},
	animation: {time: 0.4},
	autoWorking: {turnOn: true}
});
console.log(slider1);

function slider(item, config) {
	var isserItem = isValid(item);
	if (isserItem !== true) {
		return isserItem;
	}

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

	return makeReturn();

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
		if (setting.autoWorking.turnOn === true) {
			autoWorking();
		}
		return iner;

		function makeSlides(item) {
			var slides = item.children;
			[].forEach.call(slides, function(slide) {
				slide.className += ' sliderItem';
			});
			return slides;
		}

		function createPanel() {
			var left = null;
			var right = null;
			if (setting.arrow.left.isset === true) {
				left = createArrow('left');
			}
			if (setting.arrow.right.isset === true) {
				right = createArrow('right');
			}

			var panel = document.createElement('div');
			panel.className = 'sliderPanel';
			if (left !== null) {
				panel.appendChild(left);
			}
			if (setting.dots.isset === true) {
				panel.appendChild(createDots());
			}
			if (right !== null) {
				panel.appendChild(right);
			}
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
						changeActive(((+slideState.numSlides !== 0) ? +slideState.numSlides - 1 : +slideState.maxSlides - 1));
					}
					else if (direction === 'right') {
						changeActive(((+slideState.numSlides !== (+slideState.maxSlides - 1)) ? +slideState.numSlides + 1 : 0));
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
						if (isNaN(e.target.getAttribute('data-number')) || e.target.getAttribute('data-number') === null) {
							return false;
						} else {
							changeActive(e.target.getAttribute('data-number'));
						}
					}
				}
			}
		}

		function autoWorking() {
			if (isNaN(setting.autoWorking.time) === false && slideState.maxSlides > 1) {
				setInterval(function () {
					if (setting.autoWorking.direction === 'forward') {
						changeActive(((+slideState.numSlides !== (+slideState.maxSlides - 1)) ? +slideState.numSlides + 1 : 0));
					} else if (setting.autoWorking.direction === 'back') {
						changeActive(((+slideState.numSlides !== 0) ? +slideState.numSlides - 1 : +slideState.maxSlides - 1));
					}
				}, setting.autoWorking.time * 1000);
			}
		}

		function changeActive(newActiveSlide) {
			if (isNaN(newActiveSlide) === false && (newActiveSlide < 0 || newActiveSlide >= state.maxSlides)) {
				return false;
			}
			clearWaste(slides);
			var firstClass = slides[newActiveSlide].className;
			if (state.firstStart === true) {
				firstChange();
			} else {
				change();
			}

			function firstChange() {
				slides[newActiveSlide].className = firstClass + ' visable';
				state.firstStart = false;
			}

			function change() {
				slides[slideState.numSlides].style.animation = setting.animation.nameHide + ' ' + setting.animation.time + 's';
			 	state.timer1 = setTimeout(timersFunChange, ((setting.animation.time * 1000) - 50) );
				state.timer2 = setTimeout(setVisable, ((setting.animation.time * 2000) - 50) );

				function setVisable() {
					slides[newActiveSlide].className = firstClass + ' visable';
				}

				function timersFunChange () {
					slides[slideState.numSlides].style.animation = '';
					slides[newActiveSlide].style.animation = setting.animation.nameShow + ' ' + setting.animation.time + 's';
					if (setting.dots.isset === true) {
						controleDots();
					}
					slideState.numSlides = +newActiveSlide;

					function controleDots () {
						var dots = document.querySelectorAll('.dot[data-number]');
						dots[slideState.numSlides].className = dots[slideState.numSlides].className.replace(' active', '');
						dots[newActiveSlide].className += ' active';
					}
				}
			}

			function clearWaste(slides) {
				clearTimeout(state.timer1);
				clearTimeout(state.timer2);
				if (slides[slideState.numSlides] !== undefined) {
					slides[slideState.numSlides].className = slides[slideState.numSlides].className.replace(' visable', '');
					slides[slideState.numSlides].style.animation = '';
				}
			}
		}
	}

	function makeReturn() {
		var returnObject = {};

		returnObject.destroySlider = function () {
			destroy(newSlider);
		};
		returnObject.getSlider = function () {
			return newSlider;
		};

		return returnObject;
	}

	function destroy(item) {
		item.parentElement.removeChild(item);
		return true;
	}

	function isValid(item) {
		if (typeof item !== 'object' || item === null) {
			return {
				name: 'Error',
				body: 'Item is not node'
			};
		} else if (item.children.length === 0) {
			destroy(item);
			return {
				name: 'Error',
				body: 'No Items'
			}
		} else {
			return true;
		}
	}

	function makeSetting(config) {
		var defaults = {
			arrow: {
				left: {
					isset: true
				},
				right: {
					isset: true
				}
			},
			dots: {
				isset: false
			},
			animation: {
				time: 0.4,
				nameShow: 'showslide',
				nameHide: 'hideslide'
			},
			autoWorking: {
				turnOn: false,
				time: 5,
				direction: 'forward'
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