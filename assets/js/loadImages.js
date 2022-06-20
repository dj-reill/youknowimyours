const ref = firebase.database().ref('shared');
const timeline = document.querySelector('#gallery');
const slices = document.querySelectorAll('[epoch]');
// ref.on('value', (snapshot) => {
//     console.log(snapshot.val());
//     const timeline = document.querySelector('#imageTimeline');
//     appendImage(timeline, snapshot.val());
// }, (errorObject) => {
//     console.log('The read failed: ' + errorObject.name);
// }); 

ref.on('child_added', (snapshot, prevChildKey) => {
    const image = snapshot.val();
    let beforeImage; 
    beforeImage = Array.from(slices).filter(function(d) {
        return d.epoch - image.lastModified < 0;
    });
    if (beforeImage.length === 0) {
        beforeImage = [slices[0]];
    }
    const carousel = $(Array(beforeImage).at(-1)).find('.carousel-inner')[0];
    appendImage(carousel, image);
    setActiveItem(carousel);
});

function setActiveItem(group){
    const carouselItems = Array($(group).find('.carousel-item'));
    carouselItems.forEach((item) => {
        item.className = 'carousel-item';
    })
    Array(carouselItems.at(-1))[0].className = 'carousel-item active';
}

function appendImage(target, imageData){
    // let div = document.createElement('div');
    // div.className = 'carousel-item';
    // div.innerHTML = `<img src=${imageData.url} className="img-fluid d-block w-100" alt=${imageData.fileName}><div class="carousel-caption d-none d-md-block"><h5>${imageData.caption}</h5><p>Uploaded By: ${imageData.uploadedBy}</p></div>`;
    let item = document.createElement('div');
    item.className = 'carousel-item active';
    let img = document.createElement('img');
    img.src = imageData.url;
    img.className = 'img-fluid d-block w-100';
    img.alt = imageData.fileName;
    let caption = document.createElement('div');
    caption.className = "carousel-caption d-none d-md-block";
    let h= document.createElement('h5');
    h.innerText = imageData.caption;
    let p = document.createElement('p');
    p.innerText = `Uploaded by: ${imageData.uploadedBy}`;
    caption.appendChild(h);
    caption.appendChild(p)
    item.appendChild(img);
    item.appendChild(caption);
    target.appendChild(item);
}