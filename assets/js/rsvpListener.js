function handleSubmit(event) {
    event.preventDefault();
  
    const data = new FormData(event.target);
    const now = new Date().toISOString();
  
    formData = Object.fromEntries(data.entries());
    formData['timestamp'] = now;

    firebase.database().ref('rsvp')
        .push()
        .set(formData)
        .then(function(snapshot) {
            $('#rsvp').addClass('form--success')
            $('#rsvp').append('<div class="form_success"><div class="form_success_message"> Thanks! Hope to see you soon!</div><br><br></div>');
        }, function(error) {
            console.log('error' + error);
            //error(); // some error method
    });
    $(this).children().each((i, e) => {
        e.remove();
    });
}   

const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);