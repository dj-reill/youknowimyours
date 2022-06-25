let selectedFile;
const dismiss = document.querySelectorAll('.close');
const fileSelect = document.querySelector('.file-select');
const fileSubmit = document.querySelector('.file-submit');
const menuFileUpload = document.querySelectorAll('a#uploadForm');
const progressBar = document.querySelector('[role*=progressbar]');
const alertBar = document.querySelector('[role*=alert]');
const form = document.querySelector("#upload");
const uploadedBy = document.querySelector('#uploader');
var uploader;
var user;
var msg;
const icon = document.createElement('i');

firebase.auth().onAuthStateChanged(function(authUser) {
    if (authUser) {
        // User is signed in.
        user = authUser;
        if (authUser.displayName) {
           // document.querySelector('#uploader').parentElement.remove();
        } 
      } else {
        // No user is signed in.
      }
});

function dismissMessage(event){
    // locals
    const caption = document.querySelector('#fileCaption');
    const uploader = document.querySelector('#uploader');
    document.querySelector('#fileCaption').value='';
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

function handleFileUploadChange(event){
    selectedFile = event.target.files;
    if (selectedFile.length>1){
        alertBar.removeAttribute('hidden');
        alertBar.textContent = `${selectedFile.length} files to upload`
    }
    event.preventDefault();
}

async function updateProfile(name) {
    await user.updateProfile({displayName: name, photoURL: `https://ui-avatars.com/api/?name=${name}`});
}

function handleFileUploadSubmit(event){
    let uploadedBytes;
    uploader = uploadedBy.value.trim();
    if (!user.displayName) {
        updateProfile(uploader);
    } else {
        if (uploader !== user.displayName) {
            updateProfile(uploader);
        }
    }
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
            alertBar.classList.add('alert-danger', 'fade',  'show');
            icon.className = 'fa fa-solid-xmark';
            alertBar.innerText = '\tOh no! Something went wrong! Abandon Ship!';
            alertBar.prepend(icon);
            alertBar.removeAttribute('hidden');
            alertBar.querySelector('#dismiss-alert').addEventListener('click', dismissMessage);
           console.log(failure);
        }).then((success)=>{      
            progressBar.ariaValueNow = 100;
            progressBar.setAttribute('style',  `width: ${100}%`)
            progressBar.classList.remove('progress-bar-striped');
            alertBar.classList.remove('alert-light');
            alertBar.classList.add('alert-success', 'fade',  'show');
            // show success alert.
            icon.className = 'fa fa-check';
            alertBar.innerText = '\tUpload success! Thank you for sharing this wonderful day with us!';
            alertBar.prepend(icon);
            alertBar.removeAttribute('hidden');
        });
    }
    event.preventDefault();
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
                if (isNaN(percentage)) {
                    percentage = 100;
                }
                progressBar.ariaValueNow = String(percentage);
                progressBar.setAttribute('style',  `width: ${progressBar.ariaValueNow}%`);
            }, (error) => {
                console.log(error);
                reject(error);
                //return error;
            }, () => {
                progressBar.ariaValueNow = "100";
                progressBar.setAttribute('style',  `width: ${100}%`);
                firebase.storage().ref().child(`images/${selectedFile.name}`).getDownloadURL().then((url) =>{
                    console.log('file successfully uploaded')
                    const data = {url, uid:user.uid, 'fileName':selectedFile.name,'caption':caption, 'uploadedBy':uploader,'lastModified':selectedFile.lastModified,'size':selectedFile.size};
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