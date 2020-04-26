var imagesData;
var galleryApp;

function buildUI(images) {
  var gallery = document.createElement('div');
  gallery.setAttribute('class', 'gallery');
  
  for (var image in images){
    var currentImage = images[image];
    console.log(currentImage);

    var imageContainer = document.createElement('div');
    imageContainer.setAttribute('class','image-container');

    var imageSrc = currentImage.location;
    
    var imageElement = document.createElement('img');
    imageElement.setAttribute('src',imageSrc);
    imageElement.setAttribute('class','image');

    imageContainer.appendChild(imageElement);
    gallery.append(imageContainer);
  }
  
  galleryApp.append(gallery);
}

function fetchImageData(url, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function (){
    if(this.readyState == 4 && this.status == 200){
      imagesData = JSON.parse(this.responseText).images;
      console.log(imagesData);
      callback(imagesData);
    }
  };
  xhttp.open(
    'GET',
    url,
    true
    );
    
  xhttp.send();
}

document.addEventListener('DOMContentLoaded', (event) => {
  //the event occurred
  galleryApp = document.getElementById('gallery-app');
  fetchImageData('images.json', buildUI);
})