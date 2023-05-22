// used for Client side rendering
function itemTemplate(item) {
  const date = new Date(item.date)
  return `
  <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
      <div>
        <span class="item-text">${item.text}</span>
        <div class="font-weight-light"><span class='item-date'>(${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()})</span></div>
      </div>     
      <div>
              <button data-id=${item._id} class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button data-id=${item._id} class="delete-me btn btn-danger btn-sm">Delete</button>
      </div>
  </li>
  `
}

document.addEventListener('click', function(e) {
  // **Edit**
  if(e.target.classList.contains('edit-me')) {
    let userInput = prompt('Please enter a valid item name', e.target.parentElement.parentElement.querySelector('.item-text').innerText)
    // console.log(userInput) // this has to be checked inside the Browser console 
   if(userInput) {
    axios.post('/edit-item', {text: userInput, id: e.target.getAttribute('data-id')}).then(function(response) {
      // something here after the axios request is completed 
    //  console.log(response.data) // OP(browser console): {id: .... , text: .... , date: ....}
    // response var is used for extracting updated Date, implementation for later..
      e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput
    }).catch(function() {
      console.log('There seems to be a problem')
    })
   } else {
    console.log('front-end: Blank field/User clicked Cancel')
   }
  }

  // **Delete**
  if(e.target.classList.contains('delete-me')) {
    if(confirm('Are you sure you want to delete this note ?')) {
      axios.post('/delete-item', {id: e.target.getAttribute('data-id')}).then(function() {
        e.target.parentElement.parentElement.remove()
      }).catch(function() {
        console.log('There seems to be a problem')
      })
    } 
  }
})

// Client side rendering for Add-item
const ourForm = document.getElementById('our-form')
const ourField = document.getElementById('our-field')

ourForm.addEventListener('submit', e => {
  e.preventDefault()
   axios.post('/add-item', {text: ourField.value}).then(function(response) {
    //console.log(response.data)
    document.getElementById('ul-list').insertAdjacentHTML('beforeend', itemTemplate(response.data))
    ourField.value = ''
    ourField.focus()
   }).catch(function() {
    console.log('There seems to be a problem')
   })
})

// Client side rendering for Initial page load of list of items
let ourHTML = items.map(function(item) {
  return itemTemplate(item)
}).join('')
document.getElementById('ul-list').insertAdjacentHTML('beforeend', ourHTML)


