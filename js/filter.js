'use strict';

(function () {
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
    favorite: false,
    sortingOrder: false,
    availability: false
  };

  var clone = function (object) {
    return JSON.parse(JSON.stringify(object));
  };

  var query = clone(defaultQuery);

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
      var availability = card.amount > 0 || !query.availability;
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
    return right.price - left.price;
  };

  var sortCheep = function (left, right) {
    return left.price - right.price;
  };

  var sortRating = function (left, right) {
    return right.rating.value - left.rating.value;
  };

  var sortVoice = function (left, right) {
    return right.rating.number - left.rating.number;
  };

  var sortingOrders = {
    PRICE_CHEEP: 'Сначала дешевые',
    PRICE_EXPENSIVE: 'Сначала дорогие',
    RATING: 'По рейтингу',
    POPULAR: 'Сначала популярные'
  };

  var sort = function (cards) {
    switch (query.sortingOrder) {
      case sortingOrders.PRICE_EXPENSIVE:
        cards.sort(sortExpensive);
        break;
      case sortingOrders.PRICE_CHEEP:
        cards.sort(sortCheep);
        break;
      case sortingOrders.RATING:
        var rating = cards.sort(sortRating);
        rating.sort(sortVoice);
        break;
      case sortingOrders.POPULAR:
        cards = filteredData;
        break;
    }
  };

  document.querySelector('.catalog__filter--sort').addEventListener('change', function (e) {
    var target = e.target.dataset.sort;
    if (!target) {
      return;
    }
    query.sortingOrder = target;
    handle();
  });

  document.querySelector('#filter-favorite').addEventListener('change', function (e) {
    var favorite = e.target.dataset.favorite;
    if (!favorite) {
      return;
    }
    query.favorite = e.target.checked;
    handle();
    inputAvailability.checked = false;
    clearCheckedInput(inputsKind);
    clearCheckedInput(inputsNutrition);
    window.slider.clearSliderValue();
  });

  document.querySelector('#filter-availability').addEventListener('change', function (e) {
    var availability = e.target.dataset.avalibility;
    if (!availability) {
      return;
    } else if (e.target.checked) {
      clearCheckedInput(inputsKind);
      clearCheckedInput(inputsNutrition);
      inputFavorite.checked = false;
      handle();
    } else {
      return;
    }
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

  window.slider.onUpdateMaxPrice = function (price) {
    query.maxValue = price;
    handle();
  };

  window.slider.onUpdateMinPrice = function (price) {
    query.minValue = price;
    handle();
  };

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

  var handle = window.debounce(function () {
    filteredData = filter(window.catalog.data);
    sort(filteredData);
    catalogEmptyFilter.classList.add('visually-hidden');
    if (filteredData.length === 0) {
      catalogEmptyFilter.classList.remove('visually-hidden');
      window.catalog.render(filteredData);
    } else {
      window.catalog.render(filteredData);
    }
  });

  var filterList = document.querySelector('.catalog__sidebar');
  var filterInput = filterList.querySelectorAll('input');

  var clearCheckedInput = function (item) {
    for (var i = 0; i < item.length; i++) {
      item[i].checked = false;
      query = clone(defaultQuery);
    }
  };
  var catalogSubmit = document.querySelector('.catalog__submit');
  var filterPopular = document.querySelector('#filter-popular');
  catalogSubmit.addEventListener('click', function (evt) {
    evt.preventDefault();
    clearCheckedInput(filterInput);
    filterPopular.checked = true;
    window.catalog.render(window.catalog.data);
    window.slider.clearSliderValue();
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
