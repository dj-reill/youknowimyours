const ref = firebase.database().ref('shared');
const timeline = document.querySelector('#gallery');
const slices = document.querySelectorAll('[epoch]');
const timelineArea = document.querySelector('#timelineArea');
const type = 'box';


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
                        <h6>${image.caption}</h6>
                        <!-- Gallery/Box implementation -->
                        <div id="gallery${imageId}" class="box alt">
                            <div class="row gtr-50 gtr-uniform" role="root">
                                <div class="col-12" role="click">
                                    <span class="image fit" id="${imageId}">
                                        <a href="${image.url}" alt="${image.fileName}"> 
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
    timelineArea.appendChild(timelineEntry[0]);
    timelineArea.querySelector('[role=click]').addEventListener('click', launchCarousel);
}

ref.on('child_added', (snapshot, prevChildKey) => {
    makeTimelineBucket(snapshot.val(), snapshot.key );
});

function setActiveItem(group){
    const carouselItems = group.querySelectorAll('.carousel-item');
    carouselItems.forEach((item) => {
        $(item).removeClass('active');
    })
    $(carouselItems[carouselItems.length - 1]).addClass('active');
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

function makeCarouselItems() {

}

function launchCarousel(event){
    // const inner = $(event.target).closest('[role=root]');
    // const carousel = document.createElement('div');
    
    // div id="carousel{{ forloop.index  }}" class="carousel slide gallery" data-ride="carousel" aria-hidden="true" hidden>
    //                                                     <div class="carousel-inner" id="gallery{{ forloop.index }}">    
    // const anchors = inner.querySelectorAll('img');
    // anchors.forEach((a) => {
    //     const img = $(a).find('img');
    //     const item = document.createElement('div');
    //     item.className = 'carousel-item active';
    //     const caption = document.createElement('div');
    //     caption.className = "carousel-caption d-none d-md-block bg-dark mb-4";
    //     caption.style = "position: relative; left: 0; top: 0;"
    //     const h= document.createElement('h5');
    //     h.innerText = img.caption;
    //     const p = document.createElement('p');
    //     p.innerText = `Uploaded by: ${img.uploadedBy}`;
    // });
    // const root = $('[role=root]');
    // root.appendChild()
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