'use strict';

(function () {
  var query = {
    kind: {
      'Мороженое': false,
      'Газировка': false,
      'Жевательная резинка': false,
      'Мармелад': false,
      'Зефир': false
    },
    noSugar: false,
    vegetarian: false,
    gluten: false,
    minValue: 0,
    maxValue: 100,
    amount: false,
    popular: false,
    favorite: false
  };

  var defaultQuery = {
    kind: {
      'Мороженое': false,
      'Газировка': false,
      'Жевательная резинка': false,
      'Мармелад': false,
      'Зефир': false
    },
    noSugar: false,
    vegetarian: false,
    gluten: false,
    minValue: 0,
    maxValue: 100,
    amount: false,
    popular: false,
    favorite: false
  };

  var isSomePropertyTrue = function (obj) {
    return Object.keys(obj).some(function (key) {
      return obj[key];
    });
  };

  var filter = function (cards) {
    return cards.filter(function (card) {
      var kind = !isSomePropertyTrue(query.kind) || query.kind[card.kind];
      var sugar = !card.nutritionFacts.sugar || !query.noSugar;
      var vegetarian = card.nutritionFacts.vegetarian || !query.vegetarian;
      var gluten = !card.nutritionFacts.gluten || !query.gluten;
      var maxPrice = card.price <= query.maxValue;
      var minPrice = card.price >= query.minValue;
      var availability = card.amount > 0;
      var favorite = card.favorite || !query.favorite;


      if (!kind || !sugar || !vegetarian || !gluten || !maxPrice || !minPrice || !availability || !favorite) {
        return false;
      } else {
        return kind || sugar || vegetarian || gluten || maxPrice || minPrice || availability || favorite;
      }
    });
  };


  var filterKind = document.querySelector('.catalog__filter--kind');
  var inputsKind = filterKind.querySelectorAll('input');
  var filterNtrition = document.querySelector('.catalog__filter--nutrition');
  var inputsNutrition = filterNtrition.querySelectorAll('input');
  var inputFavorite = document.querySelector('#filter-favorite');
  var inputAvailability = document.querySelector('#filter-availability');
  var filteredData;

  var sortExpensive = function (left, right) {
    if (left > right) {
      return -1;
    } else if (left < right) {
      return 1;
    } else {
      return 0;
    }
  };

  document.querySelector('#filter-expensive').addEventListener('change', function (e) {
    var expensive = e.target.dataset.expensive;
    if (!expensive) {
      return;
    } else if (e.target.checked) {
      var expensiveCards = filteredData.filter(function (card) {
        return card.price;
      });
      expensiveCards.sort(sortExpensive);
    }
  });


  document.querySelector('#filter-favorite').addEventListener('change', function (e) {
    var favorite = e.target.dataset.favorite;
    if (!favorite) {
      return;
    }
    query.favorite = e.target.checked;
    handle();
    inputAvailability.checked = false;
  });

  document.querySelector('#filter-availability').addEventListener('change', function (e) {
    var availability = e.target.dataset.avalibility;
    if (!availability) {
      return;
    }

    clearCheckedInput(inputsKind);
    clearCheckedInput(inputsNutrition);
    inputFavorite.checked = false;
  });

  document.querySelector('#filter-sugar-free').addEventListener('change', function (e) {
    var nutrition = e.target.dataset.nutrition;
    if (!nutrition) {
      return;
    }
    query.noSugar = e.target.checked;
    handle();
  });

  document.querySelector('#filter-vegetarian').addEventListener('change', function (e) {
    var vegetarian = e.target.dataset.nutrition;
    if (!vegetarian) {
      return;
    }
    query.vegetarian = e.target.checked;
    handle();
  });

  document.querySelector('#filter-gluten-free').addEventListener('change', function (e) {
    var gluten = e.target.dataset.nutrition;
    if (!gluten) {
      return;
    }
    query.gluten = e.target.checked;
    handle();
  });


  document.querySelector('.range').addEventListener('mouseup', function (e) {
    var btnRight = e.target.closest('.range__btn--right');
    if (!btnRight) {
      return;
    }
    var maxPrice = document.querySelector('.range__price--max').textContent;
    query.maxValue = maxPrice;
    handle();
  });

  document.querySelector('.range__btn--left').addEventListener('mouseup', function (e) {
    var btnLeft = e.target;
    if (!btnLeft) {
      return;
    }
    var minPrice = document.querySelector('.range__price--min').textContent;
    query.minValue = minPrice;
    handle();
  });


  document.querySelector('.catalog__filter--kind').addEventListener('change', function (e) {
    var kind = e.target.dataset.kind;
    if (!kind) {
      return;
    }
    query.kind[kind] = e.target.checked;
    handle();
  });

  var emptyFilters = document.querySelector('#empty-filters').content.cloneNode(true);
  var catalogCardsWrap = document.querySelector('.catalog__cards-wrap');
  catalogCardsWrap.appendChild(emptyFilters);
  var catalogEmptyFilter = document.querySelector('.catalog__empty-filter');
  catalogEmptyFilter.classList.add('visually-hidden');
  window.catalogEmptyFilter = catalogEmptyFilter;

  var handle = function () {
    filteredData = filter(window.catalog.data);
    catalogEmptyFilter.classList.add('visually-hidden');
    console.log(filteredData);
    if (filteredData.length === 0) {
      catalogEmptyFilter.classList.remove('visually-hidden');
      window.catalog.render(filteredData);
    } else {
      window.catalog.render(filteredData);
    }
  };

  var filterList = document.querySelector('.catalog__sidebar');
  var filterInput = filterList.querySelectorAll('input');
  var rangeFilter = filterList.querySelector('.range__filter');
  var rangeFillLine = rangeFilter.querySelector('.range__fill-line');
  var btnRight = rangeFilter.querySelector('.range__btn--right');
  var btnLeft = rangeFilter.querySelector('.range__btn--left');

  var clearSliderValue = function () {
    var maxPrice = document.querySelector('.range__price--max');
    var minPrice = document.querySelector('.range__price--min');
    var FILLLINE_WIDTH = 235;
    var MIN_PRICE = 0;
    var MAX_PRICE = 100;
    btnRight.style.left = FILLLINE_WIDTH + 'px';
    btnLeft.style.left = 0;
    rangeFillLine.style.left = 0;
    rangeFillLine.style.width = FILLLINE_WIDTH + 'px';
    maxPrice.textContent = MAX_PRICE;
    minPrice.textContent = MIN_PRICE;
  };


  var clearCheckedInput = function (item) {
    for (var i = 0; i < item.length; i++) {
      item[i].checked = false;
      Object.assign(query, defaultQuery);

      window.catalog.render(window.catalog.data);
      clearSliderValue();
    }
  };
  var catalogSubmit = document.querySelector('.catalog__submit');

  catalogSubmit.addEventListener('click', function (evt) {
    evt.preventDefault();
    clearCheckedInput(filterInput);

  });

  var getFilterNumber = function () {
    var numberIcecream = document.querySelector('.input-btn__item-count--icecream');
    var numberSoda = document.querySelector('.input-btn__item-count--soda');
    var numberGum = document.querySelector('.input-btn__item-count--gum');
    var numberMarmalade = document.querySelector('.input-btn__item-count--marmalade');
    var numberMarshmellow = document.querySelector('.input-btn__item-count--marshmellow');
    var numberSugar = document.querySelector('.input-btn__item-count--sugar');
    var numberVegetarian = document.querySelector('.input-btn__item-count--vegetarian');
    var numberGluten = document.querySelector('.input-btn__item-count--gluten');
    var numberSlider = document.querySelector('.range__count');
    numberSlider.textContent = '(' + window.cardsData.length + ')';
    var numberAvailability = document.querySelector('.input-btn__item-count--availability');
    var numberFavorite = document.querySelector('.input-btn__item-count--favorite');



    var getFilterNumberKind = function (target, value) {
      var filterData = window.cardsData.filter(function (card) {
        return card.kind === target;
      });
      value.textContent = '(' + filterData.length + ')';
    };

    var getFilterNumberSugar = function (target, value) {
      var filterData = window.cardsData.filter(function (card) {
        return card.nutritionFacts.sugar === target;
      });
      value.textContent = '(' + filterData.length + ')';
    };

    var getFilterNumberVegetarian = function (target, value) {
      var filterData = window.cardsData.filter(function (card) {
        return card.nutritionFacts.vegetarian === target;
      });
      value.textContent = '(' + filterData.length + ')';
    };

    var getFilterNumberGluten = function (target, value) {
      var filterData = window.cardsData.filter(function (card) {
        return card.nutritionFacts.gluten === target;
      });
      value.textContent = '(' + filterData.length + ')';
    };

    var getFilterNumberAvailability = function (target, value) {
      var filterData = window.cardsData.filter(function (card) {
        return card.amount > target;
      });
      value.textContent = '(' + filterData.length + ')';
    };

    var getFilterNumberFavorite = function (target, value) {
      var filterData = window.cardsData.filter(function (card) {
        return card.favorite === target;
      });
      value.textContent = '(' + filterData.length + ')';
    };

    getFilterNumberKind('Мороженое', numberIcecream);
    getFilterNumberKind('Газировка', numberSoda);
    getFilterNumberKind('Жевательная резинка', numberGum);
    getFilterNumberKind('Мармелад', numberMarmalade);
    getFilterNumberKind('Зефир', numberMarshmellow);
    getFilterNumberSugar(false, numberSugar);
    getFilterNumberVegetarian(true, numberVegetarian);
    getFilterNumberGluten(false, numberGluten);
    getFilterNumberAvailability(0, numberAvailability);
    getFilterNumberFavorite(true, numberFavorite);
  };

  window.filter = {
    getFilterNumber: getFilterNumber,
    filteredData: filteredData
  };


})();
