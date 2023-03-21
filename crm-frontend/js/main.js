import Client from './client.js'
import {icons} from './icons.js'

const SERVER_URL = 'http://localhost:3000/api/clients'

// Запрос массива клиентов
async function getClientList() {
  const response = await fetch(SERVER_URL),
        data = await response.json()
  return data
}
// Создание рабочего массива клиентов
let clientList = []
async function createClientList(list, newList) {
  for (const clientItem of list) {
    newList.push(new Client(clientItem))
  }
}
createClientList(await getClientList(), clientList)

const $clientsList = document.getElementById('clients-list'),
      $clientsListTHAll = document.querySelectorAll('.clients__table th button')

let column = 'ID',
    prevColumn = null,
    columnDir = true,
    dateNow = new Date(),
    choicesArr = []

const $modalBtnAdd = document.querySelector('.btn-actions--add'),
      $container = document.querySelector('.site-container')

function createChangedClientForm(changeClient, value, role) {
  changeClient[role] = value
}

function renderFormInput(label, role, value, wrapper) {
  const $formGroup = document.createElement('div'),
        $inputFormClient = document.createElement('input'),
        $formLabel = document.createElement('label')
  $formGroup.classList.add('form__group')
  $inputFormClient.classList.add('form__input')
  $inputFormClient.value = `${value}`
  $inputFormClient.setAttribute('data-role', role)
  $formLabel.classList.add('form__label')
  $formLabel.textContent = `${label}`
  $inputFormClient.placeholder = ' '
  $formGroup.append($inputFormClient)
  $formGroup.append($formLabel)
  wrapper.append($formGroup)
}

function createContactItem(wrapper, arr, type, value) {
  let $modalContactsItem = document.createElement('div')
  $modalContactsItem.classList.add('modal__contacts-items')
  let $modalContactsChoice = document.createElement('select')
  $modalContactsChoice.classList.add('modal__contacts-select')
  let $modalContactsInput = document.createElement('input')
  $modalContactsInput.classList.add('modal__contacts-input')
  $modalContactsInput.placeholder = 'Введите данные контакта'
  if (value) $modalContactsInput.value = value
  let $modalContactsBtnDelete = document.createElement('button')
  $modalContactsBtnDelete.classList.add('btn', 'btn-reset', 'modal__btn-contact-delete')
  $modalContactsBtnDelete.innerHTML = `${icons.cancle}`
  $modalContactsBtnDelete.type = `button`
  wrapper.append($modalContactsItem)
  $modalContactsItem.append($modalContactsChoice)
  $modalContactsItem.append($modalContactsInput)
  $modalContactsItem.append($modalContactsBtnDelete)
  let choices = new Choices($modalContactsChoice, {
    allowHTML: true,
    searchEnabled: false,
    itemSelectText: '',
    shouldSort: false,
    position: 'bottom',
    choices: [
      {value: 'Телефон',label: 'Телефон',},
      {value: 'Email',label: 'Email',},
      {value: 'VK',label: 'VK',},
      {value: 'Facebook',label: 'Facebook',},
      {value: 'Другое',label: 'Другое',}
    ]
  })
  if (type) choices.setChoiceByValue(type)
  $modalContactsBtnDelete.addEventListener('click', () => {
    $modalContactsItem.remove()
  })
  return arr.push(choices)
}

function createModalWithForm(triger, onOpen, onClose, onSave, onDelete, client, method, adres) {
  $container.setAttribute('tabindex', '-1')

  const $modalElement = document.createElement('div'),
        $modalForm = document.createElement('form'),
        $modalTitle = document.createElement('h2'),
        $idFormClient = document.createElement('span'),
        $modalBtnClose = document.createElement('button'),
        $modalInputGroup = document.createElement('div'),
        $modalContacts = document.createElement('div'),
        $modalContactsList = document.createElement('div'),
        $modalBtnAddContacts = document.createElement('button'),
        $modalErrors = document.createElement('p'),
        $modalBtnSave = document.createElement('button'),
        $modalBtnCancellation = document.createElement('button')
  $modalElement.classList.add('modal')
  $modalForm.classList.add('modal__form', 'form')
  $modalTitle.classList.add('modal__title', 'title-reset')
  $idFormClient.classList.add('form__client--id')
  $modalBtnClose.classList.add('btn', 'modal__btn-close', 'btn-reset')
  $modalContacts.classList.add('modal__contacts')
  $modalContactsList.classList.add('modal__contacts-list')
  $modalBtnAddContacts.classList.add('btn', 'modal__btn-add-contact', 'btn-reset')
  $modalErrors.classList.add('title-reset', 'modal__errors')
  $modalBtnSave.classList.add('btn', 'modal__btn-action', 'modal__btn-save', 'btn-reset')
  $modalBtnCancellation.classList.add('btn', 'modal__btn-cancellation', 'modal__btn-delete-main', 'btn-reset')

  $modalBtnSave.textContent = 'Сохранить'
  $modalBtnClose.innerHTML = `${icons.close}`
  $modalBtnAddContacts.innerHTML = `${icons.plus}Добавить контакт`

  $modalBtnClose.type = 'button'
  $modalBtnAddContacts.type = 'button'
  $modalBtnCancellation.type = 'button'
  $modalBtnSave.type = 'submit'

  $modalElement.append($modalForm)
  $modalForm.append($modalTitle)
  $modalForm.append($modalInputGroup)
  $modalTitle.append($idFormClient)
  $modalForm.append($modalBtnClose)

  const CLIENT_FORM_INPUT = [
    {label: 'Фамилия', role: 'surname' , value: `${client.surname}`},
    {label: 'Имя', role: 'name', value: `${client.name}`},
    {label: 'Отчество', role: 'lastName', value: `${client.lastName}`}
  ]
  for (const item of CLIENT_FORM_INPUT) {
    renderFormInput(item.label, item.role, item.value, $modalInputGroup)
  }

  for (let i = 0; i < client.contacts.length; ++i) {
    createContactItem($modalContactsList, choicesArr, client.contacts[i].type, client.contacts[i].value);
  }
  $modalBtnAddContacts.addEventListener('click', (e) => {
    e.preventDefault()
    createContactItem($modalContactsList, choicesArr)
  })
  $modalContacts.append($modalContactsList)
  $modalForm.append($modalContacts)
  $modalContacts.append($modalBtnAddContacts)
  $modalForm.append($modalContacts)
  $modalForm.append($modalErrors)
  $modalForm.append($modalBtnSave)
  $modalForm.append($modalBtnCancellation)

  onOpen($modalTitle, $idFormClient, $modalBtnCancellation, $modalElement, $modalBtnSave, $modalForm, $modalContacts, $modalInputGroup, $modalErrors)
  $modalBtnClose.addEventListener('click', (e) => {
    e.preventDefault()
    onClose($modalElement, triger)
  })
  $modalForm.addEventListener('click', event => {
    event._isClickWithinModal = true
  })
  $modalElement.addEventListener('click', event => {
    if (event._isClickWithinModal) return
    onClose($modalElement, triger)
  })
  $modalForm.addEventListener('submit', (e) => {
    e.preventDefault()
    onSave(client, $modalElement, $modalErrors, method, adres)
  })
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      onClose($modalElement, triger)
    }
  })
  return $modalElement
}

function onClose(modalElement, triger) {
  triger.disabled = false
  modalElement.remove()
  for (const item of choicesArr) {
    item.destroy()
  }
}

async function onDelete(modalElement, method, adres, errors) {
  try {
    const response = await fetch(`${SERVER_URL}${adres}`, {
      method: method
    })

    if (response.ok) {
      clientList = []
      createClientList(await getClientList(), clientList)
      render()
      modalElement.remove()
    } else {
      let data = await response.json();
      errors.textContent = ''
      for (const item of data.errors) {
        errors.textContent += `${item.message}! `
      }
    }
  } catch {
    errors.textContent = 'Что-то пошло не так...'
  }
}

async function onSave(client, modalElement, errors, method, adres) {
  let newContactList = []
  let contactsItem = modalElement.querySelectorAll('.modal__contacts-items')
  for (const item of contactsItem) {
    let select = item.querySelector('.choices__list--single')
    let input = item.querySelector('.modal__contacts-input')

    let itemSelect = select.querySelector('.choices__item')
    let itemSelectVal = itemSelect.getAttribute('data-value')
    let inputVal = input.value

    let contact = {}
    contact.type = itemSelectVal
    contact.value = inputVal

    newContactList.push(contact)
  }
  let $inputsClient = modalElement.querySelectorAll('.form__input')
  let changedClientForm = {
    updatedAt: dateNow.toISOString(),
    contacts: newContactList
  }

  for (const item of $inputsClient) {
    createChangedClientForm(changedClientForm, item.value, item.getAttribute('data-role'))
  }

  try {
    const response = await fetch(`${SERVER_URL}${adres}`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changedClientForm)
    })
    if (response.ok) {
      clientList = []
      createClientList(await getClientList(), clientList)
      render()
      modalElement.remove()
    } else {
      let data = await response.json();
      errors.textContent = ''
      for (const item of data.errors) {
        errors.textContent += `${item.message}! `
      }
    }
  } catch {
    errors.textContent = 'Что-то пошло не так...'
  }
}

// Получить TR клиента
function newClientTR(client) {
  const $clientTR = document.createElement('tr'),
        $idTD = document.createElement('td'),
        $fioTD = document.createElement('td'),
        $createdAtTD = document.createElement('td'),
        $createdAtTime = document.createElement('span'),
        $updatedAtTD = document.createElement('td'),
        $updatedAtTime = document.createElement('span'),
        $contactsTD = document.createElement('td'),
        $actionsTD = document.createElement('td'),
        $buttonGroup = document.createElement('div'),
        $changeButton = document.createElement('button'),
        $deleteButton = document.createElement('button')

  $clientTR.classList.add('table__tr')
  $idTD.classList.add('table__td', 'table__td--id')
  $fioTD.classList.add('table__td', 'table__td--fio'),
  $createdAtTD.classList.add('table__td', 'table__td--time')
  $createdAtTime.classList.add('table__time')
  $updatedAtTD.classList.add('table__td')
  $updatedAtTime.classList.add('table__time')
  $contactsTD.classList.add('table__td')
  $actionsTD.classList.add('table__td')
  $buttonGroup.classList.add('table__buttons')
  $changeButton.classList.add('table__btn', 'btn-actions', 'btn-reset')
  $changeButton.setAttribute('data-path', 'change')
  $deleteButton.classList.add('table__btn', 'btn-actions', 'btn-reset')
  $deleteButton.setAttribute('data-path', 'delete')

  let contactsList = client.Contacts

  if (contactsList === undefined) {
    contactsList = null
  } else {
    const $contactsItemList = document.createElement('ul')
    $contactsItemList.classList.add('contacts__list', 'list-reset')
    for (const contactsItem of contactsList) {
      let contactsItemType = `${contactsItem.type.toLowerCase()}`

      let $contactIconWrapper = document.createElement('li')
      $contactIconWrapper.classList.add('contacts__item')
      $contactIconWrapper.id = `${contactsItemType}`
      let $contactIcon = document.createElement('div')
      $contactIconWrapper.append($contactIcon)
      $contactsItemList.append($contactIconWrapper)

      let $contactsItemPopup = document.createElement('div')
      $contactsItemPopup.classList.add('contacts__popup')
      $contactsItemPopup.textContent = `${contactsItem.type}: ${contactsItem.value}`

      let $contactsItemPopupArow = document.createElement('div')
      $contactsItemPopupArow.classList.add('contacts-popup__arrow')
      $contactsItemPopup.append($contactsItemPopupArow)
      $contactIconWrapper.append($contactsItemPopup)

      if (contactsItemType == 'vk') {
        $contactIcon.innerHTML = `${icons.vk}`
      }
      if (contactsItemType == 'facebook') {
        $contactIcon.innerHTML = `${icons.fb}`
      }
      if (contactsItemType == 'телефон') {
        $contactIcon.innerHTML = `${icons.phone}`
      }
      if (contactsItemType == 'email') {
        $contactIcon.innerHTML = `${icons.mail}`
      }
      if (contactsItemType != 'email' && contactsItemType != 'телефон' && contactsItemType != 'facebook' && contactsItemType != 'vk') {
        $contactIcon.innerHTML = `${icons.other}`
      }

      $contactIcon.addEventListener('mouseover', function(){
        $contactsItemPopup.classList.add('contacts__popup--visible')
      });
      $contactIcon.addEventListener('mouseout', function(){
        $contactsItemPopup.classList.remove('contacts__popup--visible')
      });
    }

    $contactsTD.append($contactsItemList)
  }


  $idTD.textContent = client.ID
  $fioTD.textContent = client.FIO

  $createdAtTD.textContent = client.CreatedAt
  $createdAtTime.textContent = client.CreatedAtTime

  $updatedAtTD.textContent = client.UpdatedAt
  $updatedAtTime.textContent = client.UpdatedAtTime

  $changeButton.innerHTML = `${icons.change}Изменить`
  $deleteButton.innerHTML = `${icons.delete}Удалить`

  $clientTR.append($idTD),
  $clientTR.append($fioTD),
  $createdAtTD.append($createdAtTime),
  $updatedAtTD.append($updatedAtTime),
  $clientTR.append($createdAtTD)
  $clientTR.append($updatedAtTD)

  $clientTR.append($contactsTD)
  $buttonGroup.append($changeButton)
  $buttonGroup.append($deleteButton)
  $actionsTD.append($buttonGroup)
  $clientTR.append($actionsTD)

  $changeButton.addEventListener('click', () => {
    $changeButton.disabled = true
    document.body.append(createModalWithForm($changeButton,
      function(title, id, cancellation, modalElement) {
        title.textContent = 'Изменить данные'
        title.append(id)
        id.textContent = `ID: ${client.ID}`
        cancellation.textContent = 'Удалить клиента'
        cancellation.addEventListener('click', (e) => {
          cancellation.disabled = true
          onClose(modalElement, $changeButton)
          e.preventDefault()
          document.body.append(
            createModalWithForm(cancellation,
              function(title, id, cancellation, modalElement, btnAction, formCotent, contactsBlock, fioBlock, errors) {
              title.textContent = 'Удалить клиента'
              title.style.alignSelf = 'center'
              contactsBlock.remove()
              fioBlock.classList.add('modal__descr')
              fioBlock.style.alignSelf = 'center'
              fioBlock.textContent = 'Вы действительно хотите удалить данного клиента?'
              cancellation.textContent = 'Отмена'
              cancellation.addEventListener('click', (e) => {
                e.preventDefault()
                onClose(modalElement, cancellation)
              })
              btnAction.textContent = 'Удалить'
              btnAction.addEventListener('click', (e) => {
                e.preventDefault()
                onDelete(modalElement, 'DELETE', `/${client.ID}`, errors)
              })
            },
            onClose,
            onSave,
            onDelete,
            client,
            )
          )
        })
      },
      onClose,
      onSave,
      onDelete,
      client,
      'PATCH',
      `/${client.ID}`
      )
    )
  })
  $deleteButton.addEventListener('click', () => {
    $deleteButton.disabled = true
    document.body.append(
      createModalWithForm($deleteButton,
        function(title, id, cancellation, modalElement, btnAction, formCotent, contactsBlock, fioBlock, errors) {
        title.textContent = 'Удалить клиента'
        title.style.alignSelf = 'center'
        contactsBlock.remove()
        fioBlock.classList.add('modal__descr')
        fioBlock.style.alignSelf = 'center'
        fioBlock.textContent = 'Вы действительно хотите удалить данного клиента?'
        cancellation.textContent = 'Отмена'
        cancellation.addEventListener('click', (e) => {
          e.preventDefault()
          onClose(modalElement, $deleteButton)
        })
        btnAction.textContent = 'Удалить'
        btnAction.addEventListener('click', (e) => {
          e.preventDefault()
          onDelete(modalElement, 'DELETE', `/${client.ID}`, errors)
        })
      },
      onClose,
      onSave,
      onDelete,
      client,

      )
    )
  })

  return $clientTR
}
$modalBtnAdd.addEventListener('click', () => {
  let newContactList = []
  let newClientForm = {
    surname: '',
    name: '',
    lastName: '',
    createdAt: dateNow.toISOString(),
    updatedAt: dateNow.toISOString(),
    contacts: newContactList
  }
  document.body.append(
    createModalWithForm($modalBtnAdd,
      function(title, id, cancellation, modalElement) {
        title.textContent = 'Новый клиент'
        cancellation.textContent = 'Отмена'
        cancellation.addEventListener('click', (e) => {
          e.preventDefault()
          onClose(modalElement, $modalBtnAdd)
        })
      },
      onClose,
      onSave,
      onDelete,
      newClientForm,
      'POST',
      ``
    )
  )
})

// Получить сортировку массива по параметрам
function getSortClients(prop, dir) {
  let clientListCopy = [...clientList]

  return clientListCopy.sort(function(clientA, clientB) {
    if (prop === 'UpdatedAt') {
      if ((!dir ? Date.parse(clientA['updatedAt']) > Date.parse(clientB['updatedAt']) : Date.parse(clientA['updatedAt']) < Date.parse(clientB['updatedAt']))) {
        return -1
      }
    } else if (prop === 'CreatedAt') {
      if ((!dir ? Date.parse(clientA['createdAt']) > Date.parse(clientB['createdAt']) : Date.parse(clientA['createdAt']) < Date.parse(clientB['createdAt']))) {
        return -1
      }
    } else {
      if ((!dir ? clientA[prop] > clientB[prop] : clientA[prop] < clientB[prop])) {
        return -1
      }
    }
  })
}

// Получить отфильтрованный массива по запросу
async function getFilterClients(value) {
  let filterList = [],
      response = await fetch(`${SERVER_URL}?search=${value}`),
      filterClients = await response.json()

  createClientList(filterClients, filterList)
  return filterList
}

// Отрисовать
async function render() {
  let clientListCopy = [...clientList]
  clientListCopy = getSortClients(column, columnDir)

  let requestValue = document.getElementById('request').value
  if (requestValue !=='') clientListCopy = await getFilterClients(requestValue)

  $clientsList.innerHTML = ''
  for (const client of clientListCopy) {
    $clientsList.append(newClientTR(client))
  }
}

// Сортировка по клику
$clientsListTHAll.forEach(el => {
  el.addEventListener('click', function() {
    column = this.dataset.column

    if (column == 'ID' && prevColumn === null) {
      columnDir = !columnDir
    } else {
      if (column !== prevColumn) {
        prevColumn = column
      } else {
        columnDir = !columnDir
      }
    }
    if (columnDir) {
      this.querySelector('.column-dir').classList.add('reverse-column-dir')
    } else {
      this.querySelector('.column-dir').classList.remove('reverse-column-dir')
    }
    render()
  })
})

// Задержка перед фильтрацией
let timeoutFilter = null;
function setIntervalFilter() {
  clearTimeout(timeoutFilter);
  function printFilter() {
    render()
  };
  timeoutFilter = setTimeout(printFilter, 300);
};

// Фильтрация при вводе
document.getElementById('request').addEventListener('input', setIntervalFilter);

// Дефолтная отрисовка
render()


