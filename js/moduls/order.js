'use strict';
(function () {
  // Показывает и скрывает форму оплаты

  var payment = document.querySelector('.payment');
  var paymentCard = payment.querySelector('.payment__card-wrap');
  var paymentCash = payment.querySelector('.payment__cash-wrap');
  var btnCard = payment.querySelector('input#payment__card');
  var btnCash = payment.querySelector('input#payment__cash');
  var paymentInputs = payment.querySelector('.payment__inputs');
  var order = document.querySelector('.order');
  var inputs = order.querySelectorAll('input');
  var buy = document.querySelector('.buy');
  var formBuy = buy.querySelector('form');
  var btnFormBuy = formBuy.querySelector('.buy__submit-btn');

  // Добавляет и убирает атрибут disabled на инпуты
  var addDisabledForInput = function () {
    var article = document.querySelector('.goods_card');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = (article === null);
    }
    btnFormBuy.disabled = (article === null);
  };

  addDisabledForInput();

  btnCash.addEventListener('click', function () {
    addClassForPayment();
  });

  btnCard.addEventListener('click', function () {
    addClassForPayment();
  });

  var addClassForPayment = function () {
    paymentCash.classList.toggle('visually-hidden', btnCard.checked);
    paymentCard.classList.toggle('visually-hidden', btnCash.checked);
    addDisabledForInputPayment();
  };


  var inputsPayment = paymentInputs.querySelectorAll('input');

  // Добавляет и убирает атрибут disabled на инпуты
  var addDisabledForInputPayment = function () {
    for (var i = 0; i < inputsPayment.length; i++) {
      inputsPayment[i].disabled = btnCash.checked;
    }
  };

  // Переключает вкладки в блоке доставки

  var delivery = document.querySelector('.deliver');
  var store = delivery.querySelector('.deliver__store');
  var courier = delivery.querySelector('.deliver__courier');
  var btnStore = delivery.querySelector('input#deliver__store');
  var btnCourier = delivery.querySelector('input#deliver__courier');
  var fieldsetStore = store.querySelector('.deliver__stores');
  var fieldsetCourier = courier.querySelector('.deliver__entry-fields-wrap');


  btnStore.addEventListener('click', function () {
    addClassForDelivery();
  });

  btnCourier.addEventListener('click', function () {
    addClassForDelivery();
  });

  var addClassForDelivery = function () {
    courier.classList.toggle('visually-hidden', btnStore.checked);
    store.classList.toggle('visually-hidden', btnCourier.checked);
    addDisabledForFieldsetDelivery();
  };

  // Добавляет и убирает атрибут disabled на инпуты в блоке доставки
  var addDisabledForFieldsetDelivery = function () {
    fieldsetCourier.disabled = !btnCourier.checked;
    fieldsetStore.disabled = btnCourier.checked;
  };

  addDisabledForFieldsetDelivery();

  var modalSuccess = document.querySelector('.modal--success');
  var modalError = document.querySelector('.modal--error');

  // Показывает модальное окно
  var showModal = function (target) {
    target.classList.remove('modal--hidden');
  };

  var btnModalSuccess = modalSuccess.querySelector('.modal__close');

  // Закрывает моадльное окно
  btnModalSuccess.addEventListener('click', function () {
    modalSuccess.classList.add('modal--hidden');
  });
  // Закрывает моадльное окно кнопкой ESC
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.ESC_CODE) {
      modalError.classList.add('modal--hidden');
      modalSuccess.classList.add('modal--hidden');
    }
  });

  var btnModalError = modalError.querySelector('.modal__close');
  // Закрывает моадльное окно
  btnModalError.addEventListener('click', function () {
    modalError.classList.add('modal--hidden');
  });

  // Проверка формы на валидность и вывод сообщений
  var checkFormValidity = function () {
    var error = checkContactDataError() || checkDeliveryError() || checkCreditCardError();
    if (error) {
      showModal(modalError);
    } else {
      showModal(modalSuccess);
    }
  };

  var contactDataInner = document.querySelector('.contact-data__inner');
  var contactDataName = contactDataInner.querySelector('#contact-data__name');
  var contactDataTel = contactDataInner.querySelector('#contact-data__tel');
  var contactDataEmail = contactDataInner.querySelector('#contact-data__email');

  // Проверка Контактных данных
  var checkContactDataError = function () {
    return !(contactDataName.checkValidity() && contactDataTel.checkValidity() && contactDataEmail.checkValidity());
  };

  // Проверка данных по доставке
  var deliverStreet = fieldsetCourier.querySelector('#deliver__street');
  var deliverHouse = fieldsetCourier.querySelector('#deliver__house');
  var deliverRoom = fieldsetCourier.querySelector('#deliver__room');

  var checkDeliveryError = function () {
    return !(deliverStreet.checkValidity() && deliverHouse.checkValidity() && deliverRoom.checkValidity());
  };
  // Проверка кредитной карты
  var paymentInputsBlock = document.querySelector('.payment__inputs');
  var inputCardNumber = paymentInputsBlock.querySelector('#payment__card-number');
  var inputCardDate = paymentInputsBlock.querySelector('#payment__card-date');
  var inputCardCVC = paymentInputsBlock.querySelector('#payment__card-cvc');
  var inputCardholder = paymentInputsBlock.querySelector('#payment__cardholder');
  var paymentCardStatus = paymentInputsBlock.querySelector('.payment__card-status');

  var checkCreditCardError = function () {
    return !(checkValidСreditСard(inputCardNumber.value) && inputCardDate.checkValidity()
    && inputCardCVC.checkValidity() && inputCardholder.checkValidity());
  };

  // Смена статуса карты
  paymentInputsBlock.addEventListener('change', function () {
    if (!checkValidСreditСard(inputCardNumber.value) || !inputCardDate.checkValidity()
    || !inputCardCVC.checkValidity() || !inputCardholder.checkValidity()) {
      paymentCardStatus.textContent = 'НЕ ОПРЕДЕЛЁН';
    } else {
      paymentCardStatus.textContent = 'Одобрен';
    }
  });

  // Алгоритм Луна
  var checkValidСreditСard = function (value) {
    if (/[^0-9-\s]+/.test(value)) {
      return false;
    }
    var nCheck = 0;
    var nDigit = 0;
    var bEven = false;
    value = value.replace(/\D/g, '');

    for (var n = value.length - 1; n >= 0; n--) {
      var cDigit = value.charAt(n);
      nDigit = parseInt(cDigit, 10);
      if (bEven) {
        if ((nDigit *= 2) > 9) {
          nDigit -= 9;
        }
      }
      nCheck += nDigit;
      bEven = !bEven;
    }
    return (nCheck % 10) === 0;
  };

  // Обрабочник проверки формы на валидность
  btnFormBuy.addEventListener('click', function (evt) {
    if (!checkValidСreditСard(inputCardNumber.value)) {
      inputCardNumber.setCustomValidity('Проверьте правильность введённых данных');
      showModal(modalError);
    } else {
      inputCardNumber.setCustomValidity('');
      checkFormValidity();
      evt.preventDefault();
    }
  });

  window.order = {
    addDisabledForInput: addDisabledForInput
  };
})();
