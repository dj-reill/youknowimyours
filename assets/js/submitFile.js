let selectedFile;

function handleFileUploadChange(event){
  selectedFile = event.target.files[0];
  event.preventDefault();
}

function dismissMessage(event){
    document.removeEventListener('click', dismissMessage);
    document.querySelector('.form_success').remove();
    document.querySelector('#upload').classList.remove('form--success');
    document.querySelector('#fileCaption').value='';
    document.querySelector('#uploader').value='';
    document.querySelector('.file-select').value ='';
    event.preventDefault();
}

function handleFileUploadSubmit(event){
  const storageBucket = firebase.storage().ref();
  var caption = document.querySelector('#fileCaption');
  var uploadedBy = document.querySelector('#uploader');
  if (uploadedBy.value.length > 0){
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
                const data = {'url': url, 'fileName': selectedFile.name, 'caption': caption.value, 'uploadedBy': uploadedBy.value};
                firebase.database().ref('shared')
                    .push()
                    .set(data)
                    .then(function(s) {
                        $('#upload').addClass('form--success');
                        $('#upload').append('<div class="form_success"><div class="form_success_message col-12"> Thank you for sharing this wonderful day with us</div><br><br><input value="Dismiss" class="dismiss primary button"/></div>');
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

const floatingDiv = document.querySelector('#floating-div');
function showDiv(event) {
    $('body').removeClass('is-menu-visible');
    $('#submitModal').modal('show');
}
const menuFileUpload = document.querySelector('a#uploadForm');
menuFileUpload.addEventListener('click', showDiv);
// const closeDiv = document.querySelector('#hideDiv');
// function hideDiv(event) {
//     floatingDiv.style.display = 'none';
//     event.preventDefault();
// }
// closeDiv.addEventListener('click', hideDiv);



