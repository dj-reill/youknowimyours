const ref = firebase.database().ref('shared');
const timeline = document.querySelector('#gallery');
const slices = document.querySelectorAll('[epoch]');
const body = document.querySelector('body');
const header = document.querySelector('#header');
const gallery = document.querySelector('[role=root]');
const lgContainer = document.querySelector('#lg-container-1');

function makeTimelineBucket(image, imageId){
    const dt = new Date(image.uploadTime);
    const timelineEntry = $(`
        <div class="single-timeline-area">
            <div class="timeline-date">
                <h6 id="time${imageId}" style="font-size:xsmall">${dt.toLocaleString('en-US', {month:'numeric', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric', second:'numeric'})}</h6>
            </div>
            <div class="row">
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="single-timeline-content">
                        <h6 class="caption">${image.caption}</h6>
                        <!-- Gallery/Box implementation -->
                        <div id="gallery${imageId}" class="box alt gallery">
                            <div class="row gtr-50 gtr-uniform">
                                <div class="col-12" role="click" data-toggle="modal" data-target="#carouselModal">
                                    <span class="image fit" id="${imageId}">
                                        <a href="${image.url}" alt="${image.fileName}" caption="${image.caption}" uploadedBy="${image.uploader}">
                                            <${isVideo(image.fileName) ? 'video': 'img'} src="${image.url}" alt="${image.fileName}" className="img-fluid d-block w-100"/>
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);
      gallery.appendChild(timelineEntry[0]);
      gallery.querySelector(`span[id=${imageId}]`).addEventListener('click', launchCarousel);
}

function makeLightGalleryImg(image, imageId) {
    const dt = new Date(image.uploadTime);
    const createDt = new Date(image.lastModified);
    const uploadTimestamp = dt.toLocaleString('en-US', {month:'numeric', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric', second:'numeric'});
    const createTimestamp = createDt.toLocaleString('en-US', {month:'numeric', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric', second:'numeric'});
    return $(`
    <li epoch=${image.lastModified} 
        id="${imageId}" class="col-xs-6 col-sm-4 col-md-2 col-lg-2" 
        data-responsive="${image.url}" 
        ${isVideo(image.fileName) ? `data-video='{"source": [{\"src\":"${image.url}", "type":"type/${getExtension(image.fileName)}"], 
            "attributes": {"preload": false, "playsinline": true, "controls": true}}'`: `data-src="${image.url}"`}   
        data-sub-html="<h4>${image.caption}</h4><p>Photo Snapped at ${createTimestamp} by ${image.uploadedBy}</p>"
        >
            <${isVideo(image.fileName) ? 'video': 'img'} src=${image.url}} alt="${image.fileName}" class="image fit"/>`);
}

ref.on('child_added', (snapshot, prevChildKey) => {
    const galleryImage = makeLightGalleryImg(snapshot.val(), snapshot.key);
    gallery.appendChild(galleryImage[0]);
    galleryImage[0].addEventListener('click', launch);    
});

function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }

function isVideo(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        // etc
        return true;
    }
    return false;
  }


function launch(event){
    event.preventDefault();
    lightGallery(gallery, {
        licenseKey: '0428AA09-D8CE4ED8-B194A172-4FF223B6', 
        plugins: [lgZoom, lgThumbnail, lgHash, lgFullscreen, lgAutoplay, lgShare, lgVideo],
        videojs:true
        });
    $(event.target).trigger('click');
}

gallery.addEventListener('lgBeforeOpen', () => {
    header.setAttribute('style','display:none');
});

gallery.addEventListener('lgBeforeClose', () => {
    header.setAttribute('style','display:block')
});