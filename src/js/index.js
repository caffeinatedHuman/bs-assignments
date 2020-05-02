var imagesData;
var galleryApp;

function buildUI(images) {
  var gallery = document.createElement('div');
  gallery.setAttribute('class', 'gallery');

  for (var image in images){
    var currentImage = images[image];
    var imageSrc = currentImage["src"];
    var imageTitle = currentImage["title"];
    var imageCategory = currentImage["category"];
    var imageDate = parseInt(currentImage["date"]);
    var imageLocation = currentImage["location"];
    var imagePhotographer = currentImage["photographer"];

    var parsedDate = new Date(imageDate);
    var finalDate = parsedDate.getDate()+"/"+parsedDate.getMonth()+"/"+parsedDate.getFullYear();

    console.log(currentImage);

    // Image Container:
    var imageContainer = document.createElement('div');
    imageContainer.setAttribute('class','image-container');

    // Image HTML Element:
    var imageElement = document.createElement('img');
    var imageSrc = imageSrc;
    imageElement.setAttribute('src',imageSrc);
    imageElement.setAttribute('class','image');

    // Image Overlay:
    var imageOverlay = document.createElement('div');
    imageOverlay.setAttribute('class', 'image-overlay')

    var overlayContent = document.createElement('div');
    overlayContent.setAttribute('class', 'overlay-content')

    // Image Overlay Details:
    var clickedAt = document.createElement('p');
    clickedAt.setAttribute('class','clicked-at');
    clickedAt.innerText = 'Clicked at '+imageLocation;

    var clickedBy = document.createElement('p');
    clickedBy.setAttribute('class','clicked-by');
    clickedBy.innerText = 'By '+imagePhotographer;

    var clickedOn = document.createElement('p');
    clickedOn.setAttribute('class','clicked-on');
    clickedOn.innerText = 'On ' + finalDate;

    var clickedCategory = document.createElement('p');
    clickedCategory.setAttribute('class','clicked-category');
    clickedCategory.innerText = '#'+imageCategory;

    overlayContent.append(clickedCategory);
    overlayContent.append(clickedAt);
    overlayContent.append(clickedBy);
    overlayContent.append(clickedOn);

    imageOverlay.append(overlayContent);

    // Append all elements to the Container:
    imageContainer.appendChild(imageElement);
    imageContainer.appendChild(imageOverlay);
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