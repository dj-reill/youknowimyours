const ref = firebase.database().ref('shared');
const timeline = document.querySelector('#gallery');
const slices = document.querySelectorAll('[epoch]');
const gallery = document.querySelector('[role=root]');
const type = 'box';


function makeTimelineBucket(image, imageId){
    const dt = new Date(image.uploadTime);
    const gallery = $(`
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
      gallery.appendChild(timelineEntry[0]);
      gallery.querySelector('[role=click]').addEventListener('click', launchCarousel);
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
  const carousel = $(`
      <ol class="carousel-indicators">
        <li data-target="#carouselExampleCaptions" data-slide-to="0" class="active"></li>
        <li data-target="#carouselExampleCaptions" data-slide-to="1" class=""></li>
        <li data-target="#carouselExampleCaptions" data-slide-to="2" class=""></li>
      </ol>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img class="d-block w-100" data-src="holder.js/800x400?auto=yes&amp;bg=777&amp;fg=555&amp;text=First slide" alt="First slide [800x400]" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_181a2e7b41d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_181a2e7b41d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.9140625%22%20y%3D%22217.7%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" data-holder-rendered="true">
          <div class="carousel-caption d-none d-md-block">
            <h5>First slide label</h5>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </div>
        </div>
        <div class="carousel-item">
          <img class="d-block w-100" data-src="holder.js/800x400?auto=yes&amp;bg=666&amp;fg=444&amp;text=Second slide" alt="Second slide [800x400]" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_181a2e7b41d%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_181a2e7b41d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3125%22%20y%3D%22217.7%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" data-holder-rendered="true">
          <div class="carousel-caption d-none d-md-block">
            <h5>Second slide label</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
        <div class="carousel-item">
          <img class="d-block w-100" src="${image.url}" data-holder-rendered="true">
          <div class="carousel-caption d-none d-md-block">
            <h5>Third slide label</h5>
            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </div>
        </div>
      </div>
      <a class="carousel-control-prev" href="#carouselExampleCaptions" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleCaptions" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>`
  )
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