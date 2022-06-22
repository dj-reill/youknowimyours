const ref = firebase.database().ref('shared');
const timeline = document.querySelector('#gallery');
const slices = document.querySelectorAll('[epoch]');
const type = 'box';

ref.on('child_added', (snapshot, prevChildKey) => {
    const image = snapshot.val();
    let beforeImage; 
    beforeImage = Array.from(slices).filter(function(d) {
        return (Number.parseInt(d.getAttribute('epoch')) * 1000) - image.lastModified < 0;
    });
    if (beforeImage.length === 0) {
        beforeImage = [slices[0]];
    }
    let parentDiv;
    let carousel;
    let carouselInner;
    if (type === 'box') {
        parentDiv = $(beforeImage[beforeImage.length - 1]);
        carousel = parentDiv.find('.box.alt')[0];
        carouselInner = parentDiv.find('[role="root"]')[0];
        appendImage(carouselInner, image, type);
    } else if (type==='carousel'){
        carousel = parentDiv.find('.carousel')[0];
        carouselInner = parentDiv.find('.carousel-inner')[0];
        appendImage(carouselInner, image, type);
        setActiveItem(carouselInner);
        carousel.closest('.single-timeline-area').removeAttribute('hidden');
        carousel.removeAttribute("hidden");
    }
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

function launchCarousel(event){
    const inner = $(event.target).closest('[role=root]');
    const carousel = document.createElement('div');
    
    div id="carousel{{ forloop.index  }}" class="carousel slide gallery" data-ride="carousel" aria-hidden="true" hidden>
                                                        <div class="carousel-inner" id="gallery{{ forloop.index }}">    
    const anchors = inner.querySelectorAll('a');
    anchors.forEach((a) => {
        const img = $(a).find('img');
        const item = document.createElement('div');
        item.className = 'carousel-item active';
        const caption = document.createElement('div');
        caption.className = "carousel-caption d-none d-md-block bg-dark mb-4";
        caption.style = "position: relative; left: 0; top: 0;"
        const h= document.createElement('h5');
        h.innerText = img.caption;
        const p = document.createElement('p');
        p.innerText = `Uploaded by: ${img.uploadedBy}`;
    });
    const root = $('[role=root]');
    root.appendChild()
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