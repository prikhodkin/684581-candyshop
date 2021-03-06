'use strict';

(function () {
  // Ползунок
  var MAX_FILTER_PRICE = 100;
  var MIN_FILTER_PRICE = 0;
  var range = document.querySelector('.range');
  var rangeFilter = range.querySelector('.range__filter');
  var rangeFillLine = rangeFilter.querySelector('.range__fill-line');
  var btnRight = rangeFilter.querySelector('.range__btn--right');
  var btnLeft = rangeFilter.querySelector('.range__btn--left');
  btnRight.style.right = 0;
  btnLeft.style.left = 0;
  rangeFillLine.style.left = 0;
  rangeFillLine.style.right = 0;
  var btnRightWidth = btnRight.offsetWidth;
  var rangeFilllineWidth = rangeFillLine.offsetWidth - btnRightWidth;


  var makeDraggable = function (element, getBounds, moveCallback) {

    element.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var startPointerCoords = {
        x: evt.clientX
      };

      var startElementCoords = {
        x: element.offsetLeft
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startPointerCoords.x - moveEvt.clientX
        };
        element.style.left = (startElementCoords.x - shift.x) + 'px';
        getBounds();
        moveCallback();

      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };

  var getSliderValue = function (button) {
    var getButtonCoords = button.getBoundingClientRect();
    var getRangeFillLineCoords = rangeFilter.getBoundingClientRect();
    var buttonCoord = getButtonCoords.left;
    var rangeFillLineLeftCoord = getRangeFillLineCoords.left;
    var rangeFillLineRightCoord = getRangeFillLineCoords.right - button.offsetWidth;
    var startCoord = 0;
    var finishCoord = 1;
    var widthFillLine = rangeFillLineRightCoord - rangeFillLineLeftCoord;
    var differenceCoords = (rangeFillLineRightCoord - buttonCoord) / widthFillLine;
    if (buttonCoord === rangeFillLineRightCoord) {
      return finishCoord;
    }
    if (buttonCoord === rangeFillLineLeftCoord) {
      return startCoord;
    }
    return finishCoord - differenceCoords;
  };

  var rangePriceMax = document.querySelector('.range__price--max');
  rangePriceMax.innerText = MAX_FILTER_PRICE;
  var rangePriceMin = document.querySelector('.range__price--min');
  rangePriceMin.innerText = MIN_FILTER_PRICE;

  var calculatePrice = function (sliderValue) {
    var value = getSliderValue(sliderValue);
    var price = value * MAX_FILTER_PRICE;
    price = Math.round(price);
    return price;
  };

  var changeRangeFillLine = function () {
    var btnRightCoord = btnRight.getBoundingClientRect().left;
    var btnLeftCoord = btnLeft.getBoundingClientRect().left;
    var differenceCoords = btnRightCoord - btnLeftCoord;
    var btnLeftStyleLeft = btnLeft.offsetLeft;
    rangeFillLine.style.width = (differenceCoords) + 'px';
    rangeFillLine.style.left = (btnLeftStyleLeft) + 'px';
  };

  var getSliderBoundMax = function () {
    var getButtonRightCoord = btnRight.getBoundingClientRect();
    var getButtonLeftCoord = btnLeft.getBoundingClientRect();
    var getRangeFillLineCoords = rangeFilter.getBoundingClientRect();
    var buttonRightCoord = getButtonRightCoord.left;
    var buttonLeftCoord = getButtonLeftCoord.left;
    var rangeFillLineLeftCoord = getRangeFillLineCoords.left;
    var rangeFillLineRightCoord = getRangeFillLineCoords.right - btnRight.offsetWidth;
    var differenceFillLineCoords = (rangeFillLineRightCoord - rangeFillLineLeftCoord);
    if (buttonRightCoord > rangeFillLineRightCoord) {
      btnRight.style.left = (differenceFillLineCoords) + 'px';
    } else if (buttonRightCoord < buttonLeftCoord) {
      btnRight.style.left = btnLeft.style.left;
    }
  };

  var getSliderBoundMin = function () {
    var getButtonRightCoord = btnRight.getBoundingClientRect();
    var getButtonLeftCoord = btnLeft.getBoundingClientRect();
    var getRangeFillLineCoords = rangeFilter.getBoundingClientRect();
    var buttonRightCoord = getButtonRightCoord.left;
    var buttonLeftCoord = getButtonLeftCoord.left;
    var rangeFillLineLeftCoord = getRangeFillLineCoords.left;
    if (buttonLeftCoord < rangeFillLineLeftCoord) {
      btnLeft.style.left = 0;
    } else if (buttonLeftCoord > buttonRightCoord) {
      btnLeft.style.left = btnRight.style.left;
    }
  };

  var updateMaxPrice = function () {
    var price = calculatePrice(btnRight);
    rangePriceMax.innerText = price;
    if (window.slider.onUpdateMaxPrice) {
      window.slider.onUpdateMaxPrice(price);
    }
    changeRangeFillLine();
  };

  var updateMinPrice = function () {
    var price = calculatePrice(btnLeft);
    rangePriceMin.innerText = price;
    if (window.slider.onUpdateMinPrice) {
      window.slider.onUpdateMinPrice(price);
    }
    changeRangeFillLine();
  };

  var clearSliderValue = function () {
    var maxPrice = document.querySelector('.range__price--max');
    var minPrice = document.querySelector('.range__price--min');
    btnRight.style.left = rangeFilllineWidth + 'px';
    btnLeft.style.left = 0;
    rangeFillLine.style.left = 0;
    rangeFillLine.style.width = rangeFilllineWidth + 'px';
    maxPrice.textContent = MAX_FILTER_PRICE;
    minPrice.textContent = MIN_FILTER_PRICE;
  };

  makeDraggable(btnRight, getSliderBoundMax, updateMaxPrice);

  makeDraggable(btnLeft, getSliderBoundMin, updateMinPrice);

  window.slider = {
    onUpdateMinPrice: null,
    onUpdateMaxPrice: null,
    clearSliderValue: clearSliderValue
  };
})();
