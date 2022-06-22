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
    document.querySelector('[role*=progressbar]').ariaValueNow="0";
    document.querySelector('[role*=progressbar]').setAttribute('style', 'width: 0%');
    $('#submitModal').modal('hide');
    event.preventDefault();
}

function handleFileUploadSubmit(event){
    var progress = document.querySelector('[role*=progressbar]');
    var uploadedBy = document.querySelector('#uploader');
    if (uploadedBy.value.length > 0){
        const storageBucket = firebase.storage().ref();
        var caption = document.querySelector('#fileCaption');
        var uploadTask = storageBucket.child(`images/${selectedFile.name}`).put(selectedFile);
        progress.ariaValueNow = String(Number.parseInt(progress.ariaValueNow) + 10);
        progress.setAttribute('style',  `width: ${progress.ariaValueNow}%`);

        uploadTask.on('state_changed', (snapshot) => {
            progress.ariaValueNow = String(Number.parseInt(progress.ariaValueNow) + 10);
            progress.setAttribute('style',  `width: ${progress.ariaValueNow}%`);        
            }, (error) => {
                $('#upload').addClass('form--failure')
                $('#upload').append('<div class="form_failure"><div class="form_failure_message col-12"> Oh no! Something went wrong! Abandon ship! </div><br><br><input value="Dismiss" class="dismiss primary button"/></div>');
                document.querySelector('.dismiss').addEventListener('click', dismissMessage);
                console.log(error);
            }, () => {
                console.log('file successfully uploaded')
                progress.ariaValueNow = "100";
                progress.setAttribute('style',  `width: ${progress.ariaValueNow}%`);
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
                            $('#splash').append('<div class="form_success" style="background=#355c78"><div class="form_success_message"> <p style="color: #090d12">Thank you for sharing this wonderful day with us!</p> <input type="button" value="Dismiss" class="button small dismiss"/></div>');
                            fileSubmit.setAttribute('disabled', '');
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
function showModal(event) {
    $('body').removeClass('is-menu-visible');
    $('#submitModal').modal('show');
    event.preventDefault();
}
const menuFileUpload = document.querySelector('a#uploadForm');
menuFileUpload.addEventListener('click', showModal);

