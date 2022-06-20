const ref = firebase.database().ref('shared');

// ref.on('value', (snapshot) => {
//     console.log(snapshot.val());
//     const timeline = document.querySelector('#imageTimeline');
//     appendImage(timeline, snapshot.val());
// }, (errorObject) => {
//     console.log('The read failed: ' + errorObject.name);
// }); 

ref.on('child_added', (snapshot) => {
    console.log(snapshot.val());
    const timeline = document.querySelector('#gallery');
    appendImage(timeline, snapshot.val());
    ref.off('child_added');
}, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
}); 


function appendImage(target, imageData){
    let li = document.createElement('li');
    let a = document.createElement('a')
    a.href=imageData.url;
    li.appendChild(a);
    let img =document.createElement('img');
    img.src=imageData.url;
    img.alt=imageData.fileName;
    img.title=imageData.caption;
    img.width='200px';
    img.height='200px';
    img.className = 'img-thumbnail';
    li.appendChild(img);
    target.appendChild(li);
}