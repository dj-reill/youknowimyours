let selectedFile;

const fileSelect = document.querySelector('.file-select');
const fileSubmit = document.querySelector('.file-submit');
const menuFileUpload = document.querySelector('a#uploadForm');

function dismissMessage(event){
    document.removeEventListener('click', dismissMessage);
    document.querySelector('.form_success').remove();
    document.querySelector('#splash').classList.remove('form--success');
    document.querySelector('#fileCaption').value='';
    document.querySelector('#uploader').value='';
    document.querySelector('.file-select').value ='';
    document.querySelector('[role*=progressbar]').ariaValueNow="0";
    document.querySelector('[role*=progressbar]').setAttribute('style', 'width: 0%');
    document.querySelector('[role*=alert]').setAttribute('hidden', '');
    fileSubmit.removeAttribute('disabled');
    $('#submitModal').modal('hide');
    event.preventDefault();
}

function getImageData({url, selectedFile, caption, uploader}){
    return  {
        url, 
        'fileName': selectedFile.name, 
        'caption': caption, 
        'uploadedBy': uploader,
        'dateModified': selectedFile.lastModifiedDate,
        'lastModified': selectedFile.lastModified,
        'size': selectedFile.size
    };
}

function handleFileUploadChange(event){
    selectedFile = event.target.files;
    if (selectedFile.length>1){
        var status = document.querySelector('[role*=alert]');
        status.removeAttribute('hidden');
        status.textContent = `${selectedFile.length} files to upload`
    }
    event.preventDefault();
}

function handleFileUploadSubmit(event){
    var progressBar = document.querySelector('[role*=progressbar]');
    var uploadedBy = document.querySelector('#uploader');

    const uploader = uploadedBy.value;
    if (uploader.length > 0){
        var caption = document.querySelector('#fileCaption');
        // Array of "Promises"
        Promise.all(Array.from(selectedFile).map((file, i) => 
            uploadImageAsPromise(caption.value, uploader, file, i + 1, selectedFile.length)))
        .catch((failure)=>{
            $('#splash').addClass('form--failure')
            $('#splash').append('<div class="form_failure"><div class="form_failure_message"><i class="fa fa-times-circle"></i><p> Oh no! Something went wrong! Abandon ship! </p></div><input type="button" value="Dismiss" class="dismiss primary button"/></div>');
            document.querySelector('.dismiss').addEventListener('click', dismissMessage);
            console.log(error);
        }).then((success)=>{      
            $('#splash').addClass('form--success');
            $('#splash').append('<div class="form_success" style="background=#355c78"><div class="form_success_message"> <p style="color: #090d12">Thank you for sharing this wonderful day with us!</p> <input type="button" value="Dismiss" class="button small dismiss"/></div>');
            fileSubmit.setAttribute('disabled', '');
            document.querySelector('.dismiss').addEventListener('click', dismissMessage);
        });
    }
}

//Handle waiting to upload each file using promise
function uploadImageAsPromise (caption, uploader, selectedFile, fileNumber, total) {
    var progressBar = document.querySelector('[role*=progressbar]');
    var status = document.querySelector('[role*=alert]');
    return new Promise(function (resolve, reject) {
        var storageRef = firebase.storage().ref(`images/${selectedFile.name}`);

        //Upload file
        var task = storageRef.put(selectedFile);
        progressBar.ariaValueNow = String(Number.parseInt(progressBar.ariaValueNow) + 10);
        progressBar.setAttribute('style',  `width: ${progressBar.ariaValueNow}%`);

        //Update progress bar
        task.on('state_changed',
            (snapshot)=> {
                var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                progressBar.ariaValueNow = percentage / total;
                progressBar.setAttribute('style',  `width: ${progressBar.ariaValueNow}%`);
            }, (error) => {
                console.log(error);
                return error;
                // $('#splash').addClass('form--failure')
                // $('#splash').append('<div class="form_failure"><div class="form_failure_message"><i class="fa fa-times-circle"></i><p> Oh no! Something went wrong! Abandon ship! </p></div><input type="button" value="Dismiss" class="dismiss primary button"/></div>');
                // document.querySelector('.dismiss').addEventListener('click', dismissMessage);
                // console.log(error);
            }, () => {
                firebase.storage().ref().child(`images/${selectedFile.name}`).getDownloadURL().then((url) =>{
                    console.log('file successfully uploaded')
                    status.textContent = `${fileNumber} of ${total} files uploaded`
                    progressBar.ariaValueNow = String(fileNumber / total * 100);
                    progressBar.setAttribute('style',  `width: ${progressBar.ariaValueNow}%`);
                    const data = getImageData({url, selectedFile, caption, uploader});
                
                    firebase.database().ref('shared')
                        .push()
                        .set(data)
                        .then(function(s) {
                            console.log('db updated');
                            // do nothing
                        }, function(error) {
                            console.log(error);
                            // $('#splash').addClass('form--failure')
                            // $('#splash').append('<div class="form_failure"><div class="form_failure_message"><i class="fa fa-times-circle"></i><p> Oh no! Something went wrong! Abandon ship! </p></div><input type="button" value="Dismiss" class="dismiss primary button"/></div>');        
                            // document.querySelector('.dismiss').addEventListener('click', dismissMessage);
                        });
                    });
                return true;
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

