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

	var setting = makeSetting(config);	/* global */
	var state = getEmptyState();		/* global */

	var newSlider = reorganizateStructureInerSlider(item);
	return makeReturnObject(newSlider);

	function makeReturnObject(newSlider) {
		var returnObject = {};

		returnObject.destroySlider = function () {
			destroy(newSlider);
			return true;
		};
		returnObject.getSlider = function () {
			return newSlider;
		};

		return returnObject;
	}

	function getEmptyState() {
		return {
			firstStart: true,
			timer1: null,
			timer2: null
		};
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

	function reorganizateStructureInerSlider(item) {
		var parent = item.parentNode;
		var newSlider = makeInerSlider(item);

		parent.insertBefore(newSlider, item);
		parent.removeChild(item);

		return newSlider;

		function makeInerSlider(item) {
			var sliderOld = getOldSlideer(item);
			var slides = makeSlides(sliderOld);		/* global */
			var slideState = getEmptyslideState();	/* global */
			var panel = createPanel();

			var iner = getIner(sliderOld, panel);

			changeActive(0);

			if (setting.autoWorking.turnOn === true) {
				autoWorking();
			}

			return iner;

			function getIner(sliderOld, panel) {
				var iner = document.createElement('div');
				iner.className = 'inerSlider';
				iner.appendChild(sliderOld);
				iner.appendChild(panel);
				return iner;
			}

			function getEmptyslideState() {
				return {
					numSlides: 0,
					maxSlides: slides.length
				};
			}

			function getOldSlideer(item) {
				var slider = item.cloneNode(true);
				slider.className = 'mainSlider';
				return slider;
			}

			function makeSlides(item) {
				var slides = item.children;
				[].forEach.call(slides, function(slide) {
					slide.className += ' sliderItem';
				});
				return slides;
			}

			function createPanel() {
				var panel = document.createElement('div');
				panel.className = 'sliderPanel';
				addPanelsComponents(panel);
				return panel;

				function addPanelsComponents(panel) {
					if (setting.arrow.left.isset === true) {
						var left = createArrow('left');
						panel.appendChild(left);
					}
					if (setting.arrow.right.isset === true) {
						var right = createArrow('right');
						panel.appendChild(right);
					}
					if (setting.dots.isset === true) {
						panel.appendChild(createDots());
					}

					function createArrow(direction) {
						var arrow = document.createElement('div');
						if (direction === 'left') {
							arrow.className = 'arrowSlider leftArrow';
						} else if (direction === 'right') {
							arrow.className = 'arrowSlider rightArrow';
						}
						arrow.onclick = getArrowClick;
						return arrow;

						function getArrowClick() {
							if (direction === 'left') {
								changeActive(((+slideState.numSlides !== 0) ? +slideState.numSlides - 1 : +slideState.maxSlides - 1));
							}
							else if (direction === 'right') {
								changeActive(((+slideState.numSlides !== (+slideState.maxSlides - 1)) ? +slideState.numSlides + 1 : 0));
							}
						}
					}

					function createDots() {
						var wrap = document.createElement('div');
						wrap.className = 'dotsWrap';
						wrap.onclick = clickDots();
						addDotToWrap(wrap);
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

						function addDotToWrap(wrap) {
							for (var i = 0; i < slideState.maxSlides; i++) {
								var dot = createOneDot(i);
								wrap.appendChild(dot);
							}
							return true;

							function createOneDot(i) {
								var dot = document.createElement('div');
								dot.setAttribute('data-number', i);
								dot.className = 'dot';
								if (i === 0) {
									dot.className += ' active';
								}
								return dot;
							}

						}
					}
				}
			}

			function autoWorking() {
				if (isNaN(setting.autoWorking.time) === false && slideState.maxSlides > 1) {
					setInterval(autoWorkingIntervalFun, setting.autoWorking.time * 1000);
				}

				function autoWorkingIntervalFun() {
					if (setting.autoWorking.direction === 'forward') {
						changeActive(((+slideState.numSlides !== (+slideState.maxSlides - 1)) ? +slideState.numSlides + 1 : 0));
					} else if (setting.autoWorking.direction === 'back') {
						changeActive(((+slideState.numSlides !== 0) ? +slideState.numSlides - 1 : +slideState.maxSlides - 1));
					}
				}
			}

			function changeActive(newActiveSlide) {
				if (isNaN(newActiveSlide) === false && (newActiveSlide < 0 || newActiveSlide >= state.maxSlides)) {
					return false;
				}
				clearWaste(slides);
				var firstClass = slides[newActiveSlide].className;
				if (state.firstStart === true) {
					firstChange(firstClass);
				} else {
					change(firstClass);
				}

				function firstChange(firstClass) {
					slides[newActiveSlide].className = firstClass + ' visable';
					state.firstStart = false;
				}

				function change(firstClass) {
					slides[slideState.numSlides].style.animation = setting.animation.nameHide + ' ' + setting.animation.time + 's';
				 	state.timer1 = setTimeout(firstAnimationChange, ((setting.animation.time * 1000) - 50) );
					state.timer2 = setTimeout(setVisable, ((setting.animation.time * 2000) - 50) );

					function setVisable() {
						slides[newActiveSlide].className = firstClass + ' visable';
					}

					function firstAnimationChange() {
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
	}

	function makeSetting(config) {
		var defaults = getDefaults();
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

		function getDefaults() {
			return {
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
		}
	}
}