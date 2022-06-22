let selectedFile;

const fileSelect = document.querySelector('.file-select');
const fileSubmit = document.querySelector('.file-submit');
const menuFileUpload = document.querySelector('a#uploadForm');

function handleFileUploadChange(event){
    selectedFile = event.target.files;
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
    fileSubmit.removeAttribute('disabled');
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

//Handle waiting to upload each file using promise
function uploadImageAsPromise (imageFile) {
    return new Promise(function (resolve, reject) {
        var storageRef = firebase.storage().ref(fullDirectory+"/"+imageFile.name);

        //Upload file
        var task = storageRef.put(imageFile);

        //Update progress bar
        task.on('state_changed',
            function progress(snapshot){
                var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                uploader.value = percentage;
            },
            function error(err){

            },
            function complete(){
                var downloadURL = task.snapshot.downloadURL;
            }
        );
    });
}

function showModal(event) {
    $('body').removeClass('is-menu-visible');
    $('#submitModal').modal('show');
    event.preventDefault();
}

fileSelect.addEventListener('change', handleFileUploadChange);
fileSubmit.addEventListener('click', handleFileUploadSubmit);
menuFileUpload.addEventListener('click', showModal);

