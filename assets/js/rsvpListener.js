function handleSubmit(event) {
    event.preventDefault();
  
    const data = new FormData(event.target);
    const now = new Date().toISOString();
    
    formData = Object.fromEntries(data.entries());
    formData['timestamp'] = now;
    let attendance = true;
    const numReservations = Object.keys(formData).filter((o) => o.includes('_firstName')).length
    for (i =1; i < numReservations+1; i++) {
        
        if (formData[`person${i}_attendance`] === 'No'){
            formData[`person${i}_foodSelection`] = "";
            formData[`person${i}_hotel`] = ""
            formData[`person${i}_allergies`] = "";
        }
    }
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