const ref = firebase.database().ref('shared');
const timeline = document.querySelector('#gallery');
const slices = document.querySelectorAll('[epoch]');

ref.on('child_added', (snapshot, prevChildKey) => {
    const image = snapshot.val();
    let beforeImage; 
    beforeImage = Array.from(slices).filter(function(d) {
        return (Number.parseInt(d.getAttribute('epoch')) * 1000) - image.lastModified < 0;
    });
    if (beforeImage.length === 0) {
        beforeImage = [slices[0]];
    }
    const parentDiv = $(beforeImage[beforeImage.length - 1]);
    const carousel = parentDiv.find('.carousel')[0];
    const carouselInner = parentDiv.find('.carousel-inner')[0];
    appendImage(carouselInner, image);
    setActiveItem(carouselInner);
    carousel.closest('.single-timeline-area').removeAttribute('hidden');
    carousel.removeAttribute("hidden");
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

function appendImage(target, imageData){
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
        let img = document.createElement('img');
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
}