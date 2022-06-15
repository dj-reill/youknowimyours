let selectedFile;
function handleFileUploadChange(event){
  selectedFile = event.target.files[0];
}

function dismissMessage(event){
    document.removeEventListener('click', dismissMessage);
    document.querySelector('form--success').remove();
}

function handleFileUploadSubmit(event){
  var caption = document.querySelector('#fileCaption');
  var uploadedBy = document.querySelector('#uploader');
  if (uploadedBy.value.length > 0){
    const storageBucket = firebase.storage().ref();
    try {
        var uploadTask = storageBucket.child(`images/${selectedFile.name}`).put(selectedFile);
    } catch(error) {
        $('#upload').addClass('form--failure')
        $('#upload').append('<div class="form_failure"><div class="form_failure_message"> Oh no! Something went wrong! Abandon ship! </div><br><br></div>');
        $('#upload').append('<div><button class="dismiss primary button">Dismiss</button></div>');
        console.log(error);
    }

    uploadTask.on('state_changed', (snapshot) => {

    }, (error) => {
        $('#upload').addClass('form--failure')
        $('#upload').append('<div class="form_failure"><div class="form_failure_message"> Oh no! Something went wrong! Abandon ship! </div><br><br></div>');
        $('#upload').append('<div><button class="dismiss primary button">Dismiss</button></div>');
        console.log(error);
    }, () => {
        console.log('file successfully uploaded');
        
        const data = {'location': `images/${selectedFile.name}`, 'caption': caption.value, 'uploadedBy': uploadedBy.value};
        firebase.database().ref('shared')
            .push()
            .set(data)
            .then(function(snapshot) {
                $('#upload').addClass('form--success')
                $('#upload').append('<div class="form_success"><div class="form_success_message"> Thank you for sharing this wonderful day with us</div></div>');
                $('#upload').append('<div><button class="dismiss primary button">Dismiss</button></div>');
                document.querySelector('.dismiss').addEventListener('click', dismissMessage);
            }, function(error) {
                console.log('error' + error);
                //error(); // some error method
            });   
        });
    }
}

const fileSelect = document.querySelector('.file-select');
fileSelect.addEventListener('change', handleFileUploadChange);

const fileSubmit = document.querySelector('.file-submit');
fileSubmit.addEventListener('click', handleFileUploadSubmit);