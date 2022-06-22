let selectedFile;

const fileSelect = document.querySelector('.file-select');
const fileSubmit = document.querySelector('.file-submit');
const menuFileUpload = document.querySelector('a#uploadForm');
const storageBucket = firebase.storage().ref();

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

function getImageData({url, selectedFile, caption, uploader}){
    return  {
        url, 
        'fileName': selectedFile.name, 
        'caption': caption.value, 
        'uploadedBy': uploader,
        'dateModified': selectedFile.lastModifiedDate,
        'lastModified': selectedFile.lastModified,
        'size': selectedFile.size
    };
}

function handleFileUploadChange(event){
    selectedFile = event.target.files;
    event.preventDefault();
}

function handleFileUploadSubmit(event){
    var progress = document.querySelector('[role*=progressbar]');
    var uploadedBy = document.querySelector('#uploader');
    const uploader = uploadedBy.value;
    if (uploader.length > 0){
        var caption = document.querySelector('#fileCaption');
        var uploadTask = storageBucket.child(`images/${selectedFile.name}`).put(selectedFile);
        progress.ariaValueNow = String(Number.parseInt(progress.ariaValueNow) + 10);
        progress.setAttribute('style',  `width: ${progress.ariaValueNow}%`);

        uploadTask.on('state_changed', (snapshot) => {
            progress.ariaValueNow = String(Number.parseInt(progress.ariaValueNow) + 10);
            progress.setAttribute('style',  `width: ${progress.ariaValueNow}%`);        
            }, (error) => {
                $('#upload').addClass('form--failure')
                $('#upload').append('<div class="form_failure"><div class="form_failure_message"><p> Oh no! Something went wrong! Abandon ship! </p></div><input type="button" value="Dismiss" class="dismiss primary button"/></div>');
                document.querySelector('.dismiss').addEventListener('click', dismissMessage);
                console.log(error);
            }, () => {
                console.log('file successfully uploaded')
                progress.ariaValueNow = "100";
                progress.setAttribute('style',  `width: ${progress.ariaValueNow}%`);
                storageBucket.child(`images/${selectedFile.name}`).getDownloadURL().then((url) =>{
                    const data = getImageData({url, selectedFile, caption, uploader});
                    
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
function uploadImageAsPromise (selectedFile) {
    return new Promise(function (resolve, reject) {
        var storageRef = firebase.storage().ref(`images/${selectedFile.name});

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

