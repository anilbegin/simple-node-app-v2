document.addEventListener('click', function(e) {
  // **Edit**
  if(e.target.classList.contains('edit-me')) {
    let userInput = prompt('Please enter a valid item name')
    // console.log(userInput) // this has to be checked inside the Browser console 
   axios.post('/edit-item', {text: userInput, id: e.target.getAttribute('data-id')}).then(function(response) {
      // something here after the axios request is completed 
    //  console.log(response.data) // OP(browser console): {id: .... , text: .... , date: ....}
    // response var is used for extracting updated Date, implementation for later..
      e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput
    }).catch(function() {
      console.log('There seems to be a problem')
    })
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



