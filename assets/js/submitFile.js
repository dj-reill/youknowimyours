let selectedFile;

function handleFileUploadChange(event){
  selectedFile = event.target.files[0];
  event.preventDefault();
}

function dismissMessage(event){
    document.removeEventListener('click', dismissMessage);
    document.querySelector('.form_success').remove();
    document.querySelector('#splash').classList.remove('form--success');
    document.querySelector('#fileCaption').value='';
    document.querySelector('#uploader').value='';
    document.querySelector('.file-select').value ='';
    event.preventDefault();
}

function handleFileUploadSubmit(event){
  var uploadedBy = document.querySelector('#uploader');
  if (uploadedBy.value.length > 0){
    const storageBucket = firebase.storage().ref();
    var caption = document.querySelector('#fileCaption');
    var uploadTask = storageBucket.child(`images/${selectedFile.name}`).put(selectedFile);

    uploadTask.on('state_changed', (snapshot) => {
        // console.log(snapshot);
        }, (error) => {
            $('#upload').addClass('form--failure')
            $('#upload').append('<div class="form_failure"><div class="form_failure_message col-12"> Oh no! Something went wrong! Abandon ship! </div><br><br><input value="Dismiss" class="dismiss primary button"/></div>');
            document.querySelector('.dismiss').addEventListener('click', dismissMessage);
            console.log(error);
        }, () => {
            console.log('file successfully uploaded');
            storageBucket.child(`images/${selectedFile.name}`).getDownloadURL().then((url) =>{
                const data = {
                    url, 
                    'fileName': selectedFile.name, 
                    'caption': caption.value, 
                    'uploadedBy': uploadedBy.value,
                    'dateModified': selectedFile.lastModifiedDate,
                    'lastModified': selectedFile.lastModified,
                    'size': selectedFile.size
                };
                firebase.database().ref('shared')
                    .push()
                    .set(data)
                    .then(function(s) {
                        $('#splash').addClass('form--success');
                        $('#splash').append('<div class="form_success"><div class="form_success_message"> <p>Thank you for sharing this wonderful day with us!</p> <input type="button" value="Dismiss" class="button small dismiss"/></div>');
                        document.querySelector('.dismiss').addEventListener('click', dismissMessage);
                    }, function(error) {
                        console.log('error' + error);
                        //error(); // some error method
                    });
                });
            return true;
        }); 
    }
    event.preventDefault();
    return true;
}

const fileSelect = document.querySelector('.file-select');
fileSelect.addEventListener('change', handleFileUploadChange);

const fileSubmit = document.querySelector('.file-submit');
fileSubmit.addEventListener('click', handleFileUploadSubmit);

function showModal(event) {
    $('body').removeClass('is-menu-visible');
    $('#submitModal').modal('show');
}
const menuFileUpload = document.querySelector('a#uploadForm');
menuFileUpload.addEventListener('click', showModal);

