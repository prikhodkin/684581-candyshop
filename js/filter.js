'use strict';

(function () {
  // Ползунок

  var range = document.querySelector('.range');
  var rangeFilter = range.querySelector('.range__filter');
  var rangeFillLine = rangeFilter.querySelector('.range__fill-line');
  var btnRight = rangeFilter.querySelector('.range__btn--right');
  var btnLeft = rangeFilter.querySelector('.range__btn--left');
  var MAX_FILTER_PRICE = 1500;
  btnRight.style.right = 0;
  btnLeft.style.left = 0;
  rangeFillLine.style.left = 0;
  rangeFillLine.style.right = 0;


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
    } else if (buttonCoord === rangeFillLineLeftCoord) {
      return startCoord;
    } else {
      return finishCoord - differenceCoords;
    }
  };

  var rangePriceMax = document.querySelector('.range__price--max');
  rangePriceMax.innerText = MAX_FILTER_PRICE;
  var rangePriceMin = document.querySelector('.range__price--min');
  rangePriceMin.innerText = 0;

  var updateMaxPrice = function () {
    rangePriceMax.innerText = calculatePrice(btnRight);
    changeRangeFillLine();
  };

  var updateMinPrice = function () {
    rangePriceMin.innerText = calculatePrice(btnLeft);
    changeRangeFillLine();
  };

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

  makeDraggable(btnRight, getSliderBoundMax, updateMaxPrice);

  makeDraggable(btnLeft, getSliderBoundMin, updateMinPrice);

})();
