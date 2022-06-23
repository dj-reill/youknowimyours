let selectedFile;
const dismiss = document.querySelectorAll('.close');
const fileSelect = document.querySelector('.file-select');
const fileSubmit = document.querySelector('.file-submit');
const menuFileUpload = document.querySelectorAll('a#uploadForm');
const progressBar = document.querySelector('[role*=progressbar]');
const alertBar = document.querySelector('[role*=alert]');
var msg;
var icon;

function dismissMessage(event){
    // locals
    const caption = document.querySelector('#fileCaption');
    const uploader = document.querySelector('#uploader');
    document.querySelector('#fileCaption').value='';
    document.querySelector('#uploader').value='';
    fileSelect.value ='';
    progressBar.ariaValueNow=0;
    progressBar.setAttribute('style', 'width: 0%');
    progressBar.classList.add('progress-bar-striped');
    alertBar.setAttribute('hidden', '');
    alertBar.className = 'alert alert-light';
    alertBar.innerText = '';
    fileSubmit.removeAttribute('disabled');
    $('#submitModal').modal('hide');
    event.preventDefault();
}

function getImageData(url, selectedFile, caption, uploader){
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
    const alertBar = document.querySelector('[role*=alert]');
    selectedFile = event.target.files;
    if (selectedFile.length>1){
        alertBar.removeAttribute('hidden');
        alertBar.textContent = `${selectedFile.length} files to upload`
    }
    event.preventDefault();
}

function handleFileUploadSubmit(event){
    const fileSelect = document.querySelector('.file-select');
    const fileSubmit = document.querySelector('.file-submit');
    const progressBar = document.querySelector('[role*=progressbar]');
    const alertBar = document.querySelector('[role*=alert]');
    const icon = document.createElement('i');
    var uploadedBy = document.querySelector('#uploader');
    let uploadedBytes;
    // set up dismiss button as element
    const dismiss = document.createElement('button');
    dismiss.setAttribute('data-dismiss', 'alert');
    dismiss.setAttribute('aria-label', 'Close');
    dismiss.type = 'button';
    dismiss.className = 'close';
    dismiss.id = 'dismiss-alert';
    const span = document.createElement('span');
    span.setAttribute('aria-hidden', "true");
    span.innerText = '\u00D7';
    dismiss.appendChild(span);

    const uploader = uploadedBy.value;
    if (uploader.length > 0){
        var caption = document.querySelector('#fileCaption');
        // Array of "Promises"
        const totalBytes = Array.from(selectedFile).map((a) => a.size).reduce((partialSum, a)=> partialSum+a, 0);
        Promise.all(Array.from(selectedFile).map((file, i) => {
            uploadImageAsPromise(caption.value, uploader, file, i + 1, selectedFile.length, uploadedBytes, totalBytes);
            uploadedBytes =+ selectedFile.size;
            alertBar.textContent = `${i+ 1} of ${selectedFile.length} files uploaded`
        })).catch((failure)=>{
            // add alert/warning
            alertBar.classList.remove('alert-light');
            alertBar.classList.add('alert-danger', 'alert-dismissible', 'fade',  'show');
            icon.className = 'fa fa-solid-xmark';
            alertBar.innerText = '\tOh no! Something went wrong! Abandon Ship!';
            alertBar.prepend(icon);
            alertBar.removeAttribute('hidden');
           // $('#splash').addClass('form--failure')
           // $('#splash').append('<div class="form_failure"><div class="form_failure_message"><i class="fa fa-times-circle"></i><p> Oh no! Something went wrong! Abandon ship! </p></div><input type="button" value="Dismiss" class="dismiss primary button"/></div>');
           alertBar.querySelector('#dismiss-alert').addEventListener('click', dismissMessage);
           console.log(failure);
        }).then((success)=>{      
            progressBar.ariaValueNow = 100;
            progressBar.setAttribute('style',  `width: ${100}%`)
            progressBar.classList.remove('progress-bar-striped');
            alertBar.classList.remove('alert-light');
            alertBar.classList.add('alert-success', 'alert-dismissible', 'fade',  'show');
            // show success alert.
            icon.className = 'fa fa-check';
            alertBar.innerText = '\tUpload success! Thank you for sharing this wonderful day with us!';
            alertBar.prepend(icon);
            alertBar.removeAttribute('hidden');
            // $('#splash').addClass('form--success');
            // $('#splash').append('<div class="form_success" style="background=#355c78"><div class="form_success_message"> <p style="color: #090d12">Thank you for sharing this wonderful day with us!</p> <input type="button" value="Dismiss" class="button small dismiss"/></div>');
            fileSubmit.setAttribute('disabled', '');
        });
    }
    event.preventDefault();
    $('#upload :input:visible[required="required"]').each(function()
        {
            if(!this.validity.valid)
            {
                icon.className = 'fa fa-triangle-exclamation'
                alertBar.classList.remove('alert-light');
                alertBar.classList.add('alert-warning', 'alert-dismissible', 'fade', 'show');
                alertBar.innerText = 'Please type your name.' // $(this)[0].validationMessage;
                alertBar.removeAttribute('hidden');
                // break
                return false;
            }
        });
}

//Handle waiting to upload each file using promise
function uploadImageAsPromise (caption, uploader, selectedFile, fileNumber, total, uploadedBytes, totalBytes) {
    const storageBucket = firebase.storage().ref();
    const dbRef = firebase.database().ref('shared');
    return new Promise(function (resolve, reject) {
        var task = storageBucket.child(`images/${selectedFile.name}`).put(selectedFile);

        //Update progress bar
        task.on('state_changed',
            (snapshot)=> {
                var percentage = (snapshot.bytesTransferred + uploadedBytes) / (totalBytes * 100);
                if (percentage === NaN) {
                    percentage = 100;
                }
                progressBar.ariaValueNow = percentage;
                progressBar.setAttribute('style',  `width: ${progressBar.ariaValueNow}%`);
            }, (error) => {
                console.log(error);
                reject(error);
                //return error;
            }, () => {
                firebase.storage().ref().child(`images/${selectedFile.name}`).getDownloadURL().then((url) =>{
                    console.log('file successfully uploaded')
                    const data = getImageData(url, selectedFile, caption, uploader);
                    dbRef.push()
                        .set(data)
                        .then(function(s) {
                            console.log('db updated');
                           // return true;
                            // do nothing
                        }, function(error) {
                            console.log(error);
                           // return false;
                        });
                    });
                resolve(true);
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
menuFileUpload.forEach((el) => el.addEventListener('click', showModal));
dismiss.forEach((el) => el.addEventListener('click', dismissMessage));
