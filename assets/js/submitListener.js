function handleSubmit(event) {
    event.preventDefault();
  
    const data = new FormData(event.target);
  
   formData = Object.fromEntries(data.entries());
  
    // console.log({ value });

    firebase.database().ref('save-the-date')
        .push()
        .set(formData)
        .then(function(snapshot) {
            //success(); // some success methods
            // console.log(formData)
        }, function(error) {
            console.log('error' + error);
            //error(); // some error method
        });
    }   
  
    const form = document.querySelector('form');
    form.addEventListener('submit', handleSubmit);

    