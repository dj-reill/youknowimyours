function handleSubmit(event) {
    event.preventDefault();
  
    const data = new FormData(event.target);
    const now = new Date().toISOString();
  
    formData = Object.fromEntries(data.entries());
    formData['timestamp'] = now;

    // console.log({ value });

    firebase.database().ref('rsvp')
        .push()
        .set(formData)
        .then(function(snapshot) {
            $('#rsvp').addClass('rsvp--success')
            $('#rsvp').append('<div class="form_success"><div class="form_success_message"> Thanks</div></div>');
        }, function(error) {
            console.log('error' + error);
            //error(); // some error method
        });
    }   
  
    const form = document.querySelector('form');
    form.addEventListener('submit', handleSubmit);

    