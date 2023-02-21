// main.js || client side

// UPDATE

const update = document.querySelector('#update-button')
update.addEventListener('click', () => {
    fetch('/quotes', {
        method: 'put',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            name: 'Darth Vader',
            quote: 'I find your lack of faith disturbing.'
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(response => {
        window.location.reload(true) //This refreshes the browser
        console.log(response);
    })
})


// DELETE

const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')


deleteButton.addEventListener('click', () => {
    fetch('/quotes', {
        method: 'delete',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            name: 'Darth Vader'
        })
    })
    .then(res => {
        if(res.ok) return res.json()
    })
    .then(response => {
        if (response === 'No quote to delete') {
            messageDiv.textContent = "There is no Darth Vader quote to be deleted"
        } else {
            window.location.reload(true)
        }
    })
    // .then(data => {
    //     window.location.reload() //This refreshes the browser
    //     console.log(data)
    // })
    .catch(error => console.error(errror))
})


