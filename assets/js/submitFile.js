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
        'caption': caption.value, 
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
    var status = document.querySelector('[role*=alert]');
    const uploader = uploadedBy.value;
    if (uploader.length > 0){
        var caption = document.querySelector('#fileCaption');
        Array.from(selectedFile).forEach((file, i) => {
            uploadImageAsPromise(caption.value, uploader, file, i, selectedFile.length);
            status.textContent = `${i} of ${selectedFile.length} files uploaded`
        }).then((result)=> {
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

    return new Promise(function (resolve, reject) {
        var storageRef = firebase.storage().ref(`images/${selectedFile.name}`);

        //Upload file
        var task = storageRef.put(selectedFile);
        progressBar.ariaValueNow = String(Number.parseInt(progressBar.ariaValueNow) + 10);
        progressBar.setAttribute('style',  `width: ${progressBar.ariaValueNow}%`);

        //Update progress bar
        task.on('state_changed',
            function progress(snapshot){
                var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                progressBar.ariaValueNow = percentage / total;
                progressBar.setAttribute('style',  `width: ${progressBar.ariaValueNow}%`);
            },
            function error(err){
                $('#splash').addClass('form--failure')
                $('#splash').append('<div class="form_failure"><div class="form_failure_message"><i class="fa fa-times-circle"></i><p> Oh no! Something went wrong! Abandon ship! </p></div><input type="button" value="Dismiss" class="dismiss primary button"/></div>');
                document.querySelector('.dismiss').addEventListener('click', dismissMessage);
                console.log(error);
            },
            function complete(){
                storageBucket.child(`images/${selectedFile.name}`).getDownloadURL().then((url) =>{
                    console.log('file successfully uploaded')
                    progressBar.ariaValueNow = String(Number.parseInt(fileNumber / total)* 100);
                    progressBar.setAttribute('style',  `width: ${progressBar.ariaValueNow}%`);
                    const data = getImageData({url, selectedFile, caption, uploader});
                
                    firebase.database().ref('shared')
                        .push()
                        .set(data)
                        .then(function(s) {
                            // do nothing
                        }, function(error) {
                            $('#splash').addClass('form--failure')
                            $('#splash').append('<div class="form_failure"><div class="form_failure_message"><i class="fa fa-times-circle"></i><p> Oh no! Something went wrong! Abandon ship! </p></div><input type="button" value="Dismiss" class="dismiss primary button"/></div>');        
                            document.querySelector('.dismiss').addEventListener('click', dismissMessage);
                        });
                    });
                }
            );
        }
    );
};


function showModal(event) {
    $('body').removeClass('is-menu-visible');
    $('#submitModal').modal('show');
    event.preventDefault();
}

fileSelect.addEventListener('change', handleFileUploadChange);
fileSubmit.addEventListener('click', handleFileUploadSubmit);
menuFileUpload.addEventListener('click', showModal);

