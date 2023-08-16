const apiURL = 'https://62054479161670001741b708.mockapi.io/api/contacts'
const firstNameInput = document.getElementById('firstName')
const lastNameInput = document.getElementById('lastName')
const phoneNumberInput = document.getElementById('phoneNumber')
const addButton = document.getElementById('addButton')
const tableBody = document.getElementById('tableBody')

function displayContacts() {
    tableBody.innerHTML = ''

    fetch(apiURL)
        .then(function(response) {
            return response.json()
        })
        .then(function(contacts) {
            contacts.forEach(function(contact) {
                const row = document.createElement('tr')
                row.innerHTML = `
                    <td>${contact.firstName}</td>
                    <td>${contact.lastName}</td>
                    <td>${contact.phoneNumber}</td>
                    <td>
                        <button class="edit-button" data-id="${contact.id}">Редактировать</button>
                        <button class="delete-button" data-id="${contact.id}">Удалить</button>
                    </td>
                `
                tableBody.appendChild(row)
            })

            attachEditDeleteListeners()
        })
}

function attachEditDeleteListeners() {
    const editButtons = document.querySelectorAll('.edit-button')
    const deleteButtons = document.querySelectorAll('.delete-button')

    editButtons.forEach(function(button) {
        button.addEventListener('click', function() 
        {
            editContact(button.getAttribute('data-id'))
        })
    })

    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            deleteContact(button.getAttribute('data-id'))
        })
    })
}

function addContact() {
    const firstName = firstNameInput.value.trim()
    const lastName = lastNameInput.value.trim()
    const phoneNumber = phoneNumberInput.value.trim()

    if (firstName === '' || lastName === '' || phoneNumber === '') {
        alert('Пожалуйста, заполните все поля')
        return;
    }

    fetch (apiURL, 
      { method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName,
            lastName,
            phoneNumber
        })
    })
    .then(function(response) {
        if (response.ok) {
            firstNameInput.value = ''
            lastNameInput.value = ''
            phoneNumberInput.value = ''
            displayContacts()
        }

        throw new Error(`${response.status} ${response.statusText}`)
      })

    .catch((error) => {
        throw new Error(`Can not create contact: ${error.message}`)
      })
  }


function deleteContact(id) {
    fetch(`${apiURL}/${id}`, {
        method: 'DELETE'
    })

    .then(function(response) {
        if (response.ok) {
            displayContacts()
        }
        throw new Error(`${response.status} ${response.statusText}`)
    })

    .catch((error) => {
      throw new Error(`Can not delete contact: ${error.message}`)
    })
}

addButton.addEventListener('click', addContact)

displayContacts()