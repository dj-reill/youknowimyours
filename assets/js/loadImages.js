const ref = firebase.database().ref('shared');
const slices = document.querySelectorAll('[epoch]');
const gallery = document.querySelector('[role=root]');
const carousel = document.querySelector('#weddingCarousel');
const type = 'box';


function getBucket(lastModified){
    let beforeImage; 
    beforeImage = Array.from(slices).filter(function(d) {
        return (Number.parseInt(d.getAttribute('epoch')) * 1000) - lastModified < 0;
    });
    if (beforeImage.length === 0) {
        beforeImage = [slices[0]];
    }
    return $(beforeImage[beforeImage.length - 1]);
}

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
                                <div class="col-12" role="click">
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

function makeImage(image, imageId) {
    const dt = new Date(image.lastModified);
    return $(`<div class="col-3">
                        <span class="image fit zoom" id="${imageId}">
                            <a href="${image.url}" alt="${image.fileName}" role="click" className="img-fluid"> 
                                <${isVideo(image.fileName) ? 'video': 'img'} src="${image.url}" alt="${image.fileName}"/>
                            </a>
                        </span>
                    </div>`);
}

function addToCarousel(image, imageId) {
    const item = $(`<div class="carousel-item" id="${imageId}">
                      <div class="row col-12">
                          <span class="image fit" id="${imageId}" style="max-height:300px;margin: auto;">
                              <a href="${image.url}" alt="${image.fileName}" role="click" className="img-fluid"> 
                                  <${isVideo(image.fileName) ? 'video': 'img'} src="${image.url}" alt="${image.fileName}"/>
                              </a>
                          </span>
                          <div class="carousel-caption d-flex d-block p-2">
                              <div class="inner" style="padding-top:5%">
                                  <h5 style="font-family:'Open Sans', 'Helvetica Neue', Arial, sans-serif; font-weight:400">Uploaded by: ${image.uploadedBy}</h5>
                                  <p>${image.caption}</p>
                              </div>
                          </div>
                      </div>
                  </div>`);
    carousel.querySelector('.carousel-inner').appendChild(item[0]);
}

ref.on('child_added', (snapshot, prevChildKey) => {
    const upload = snapshot.val();
    const bucket = getBucket(upload.lastModified)[0];
    if (type !== 'box') {
        makeTimelineBucket(upload, snapshot.key );
    } else {
        bucket.closest('.single-timeline-area').removeAttribute('hidden');
        const img = makeImage(upload, snapshot.key );         
        const thisGallery = bucket.querySelector('[role=gallery]');          
        thisGallery.appendChild(img[0]);
    }
    gallery.querySelector(`span[id=${snapshot.key}]`).addEventListener('click', launchCarousel);
    addToCarousel(snapshot.val(), snapshot.key)
});

function deactivateItems(group){
    const carouselItems = document.querySelectorAll('.carousel-item');
    carouselItems.forEach((item) => {
        $(item).removeClass('active');
    })
}

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


function launchCarousel(event){
  event.preventDefault();
  carousel.parentElement.removeAttribute('hidden');
  const a =  $(event.target);
  const id = a[0].closest('span').id;
  const activeItem = $(document.querySelector(`.carousel-item[id=${id}]`));
  deactivateItems(activeItem)
  activeItem.addClass('active');
//   setActiveItem(carousel);
  $('#carouselModel').modal('show');
  $('#weddingCarousel').carousel({ interval: false});
}

function appendImage(target, imageData, type='carousel'){
    if (type==='carousel') {
        // let div = document.createElement('div');
        // div.className = 'carousel-item';
        // div.innerHTML = `<img src=${imageData.url} className="img-fluid d-block w-100" alt=${imageData.fileName}><div class="carousel-caption d-none d-md-block"><h5>${imageData.caption}</h5><p>Uploaded By: ${imageData.uploadedBy}</p></div>`;
        let item = document.createElement('div');
        item.className = 'carousel-item active';
        let a = document.createElement('a');
        a.href = imageData.url;
        // a.className = `data-toggle="lightbox" data-gallery="${target.id}" data-type="image"`;
        let img;
        if(isVideo(imageData.fileName)){
            img = document.createElement('video');
        } else {
            img = document.createElement('img');
        }
        img.src = imageData.url;
        img.className = 'img-fluid d-block w-100';
        img.alt = imageData.fileName;
        a.appendChild(img);
        let caption = document.createElement('div');
        caption.className = "carousel-caption d-none d-md-block bg-dark mb-4";
        caption.style = "position: relative; left: 0; top: 0;"
        let h= document.createElement('h5');
        h.innerText = imageData.caption;
        let p = document.createElement('p');
        p.innerText = `Uploaded by: ${imageData.uploadedBy}`;
        caption.appendChild(h);
        caption.appendChild(p)
        item.appendChild(a);
        item.appendChild(caption);
        target.appendChild(item);
    } else if (type==='box'){
        let a = document.createElement('a');
        a.href = imageData.url;
        // a.className = `data-toggle="lightbox" data-gallery="${target.id}" data-type="image"`;
        let img;
        if(isVideo(imageData.fileName)){
            img = document.createElement('video');
        } else {
            img = document.createElement('img');
        }
        img.src = imageData.url;
        img.className = 'img-fluid d-block w-100';
        img.alt = imageData.fileName;
        img.caption = imageData.caption;
        img.uploadedBy = imageData.uploadedBy;
        a.appendChild(img);
        let span = document.createElement('span');
        span.className = 'image fit';
        span.id = `image${imageData.size}`;
        span.appendChild(img);
        let div = document.createElement('div');
        div.className = 'col-3';
        div.appendChild(span);
        div.addEventListener('click', launchCarousel);
        target.appendChild(div);
    }    
}