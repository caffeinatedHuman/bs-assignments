var imagesData;
var galleryApp;

var images = null;
var sortByVariables = ['category', 'title', 'date', 'location'];
var sortFilterActive = false;
var filterByActive = false;
var currenSortValue = "category";
var currentFilterValue = "Category 1";

function generateImagesData(imagesInput){
  var images = imagesInput;
  return images;
}

function rebuildGallery(inputImageArray){
  var imagesElement = document.getElementsByClassName('images');
  imagesElement[0].remove();
  buildUI(inputImageArray);
}

function sortGallery(toSortBy, inputImageArray){
  currenSortValue = toSortBy;
  sortFilterActive = true;

  var len = inputImageArray.length;

  for (var val=0; val < len; val++){
    for (var val2 = val+1; val2 < len; val2++){
      if (inputImageArray[val2][toSortBy] <= inputImageArray[val][toSortBy]){
        var temp = inputImageArray[val2];
        inputImageArray[val2] = inputImageArray[val];
        inputImageArray[val] = temp;
      }
    }
  }

  return inputImageArray;
}

function filterGallery(toFilterBy, inputImageArray){
  currentFilterValue = toFilterBy;
  filterByActive = true;

  var outputImages = [];
  var len = inputImageArray.length;

  for (var val=0; val < len; val++){
    if(inputImageArray[val]['category']===toFilterBy){
      outputImages.push(inputImageArray[val]);
    }
  }

  return outputImages;
}

function buildModalUI(){
  var modalContainer = document.createElement('div');
  modalContainer.setAttribute('class', 'modal-container');
  modalContainer.setAttribute('id','gallery-modal');

  var modalOverlay = document.createElement('div');
  modalOverlay.setAttribute('class','modal-overlay');

  var modal = document.createElement('div');
  modal.setAttribute('class', 'modal');

  var modalImage = document.createElement('img');
  modalImage.setAttribute('class', 'modal-image');
  modalImage.setAttribute('src', 'images/1.jpg');

  var previousButton = document.createElement('div');
  previousButton.setAttribute('class', 'modal-previous-button')
  previousButton.innerHTML = '&#10094;';
  
  var nextButton = document.createElement('div');
  nextButton.setAttribute('class', 'modal-next-button')
  nextButton.innerHTML = '&#10095;';

  modal.append(modalImage);
  modal.appendChild(previousButton);
  modal.appendChild(nextButton);
  
  modalContainer.append(modalOverlay);
  modalContainer.appendChild(modal);

  return modalContainer;
}

function buildFilters(type, optionValues){
  if (type === 'sort') {
    var sortByFilter = document.createElement('div');
    sortByFilter.setAttribute('class', 'sortby-container');

    var selectTag = document.createElement('select');
    selectTag.setAttribute('class','sortByFilter');
    selectTag.addEventListener('change', function (){
      var filteredImages = filterGallery(currentFilterValue, images);
      var sortedImages = sortGallery (event.target.value, filteredImages);
      rebuildGallery(sortedImages, "sort");
    });

    for (var val in optionValues){
      var option = document.createElement('option');
      option.setAttribute('value', optionValues[val]);
      option.text = optionValues[val];

      selectTag.appendChild(option);
    }

    sortByFilter.appendChild(selectTag);
    return sortByFilter;
  } else if (type === 'filtering'){
    var filteByFilter = document.createElement('div');
    filteByFilter.setAttribute('class', 'filterby-container');

    var selectTag = document.createElement('select');
    selectTag.setAttribute('class', 'filterByFilter');
    selectTag.addEventListener('change', function (){
      var sortedImages = sortGallery(currenSortValue, images);
      var filteredImages = filterGallery(event.target.value, sortedImages);
      rebuildGallery(filteredImages, "filter");
    });

    for (val in optionValues){
      var option = document.createElement('option');
      option.setAttribute('value', optionValues[val]);
      option.text = optionValues[val];

      selectTag.appendChild(option);
    }

    filteByFilter.appendChild(selectTag);
    return filteByFilter;
  }
}

function buildUI(images, buildModal) {
  var imagesData = generateImagesData(images);
  var gallery;

  if (!sortFilterActive && !filterByActive){
    gallery = document.createElement('div');
    gallery.setAttribute('class', 'gallery');

    var sortByFilter = buildFilters('sort', sortByVariables);
    gallery.appendChild(sortByFilter);

    var filterByFilter = buildFilters('filtering', ['Category 0','Category 1']);
    gallery.appendChild(filterByFilter);
  } else {
    gallery = document.getElementsByClassName('gallery')[0];
  }

  var images = document.createElement('div');
  images.setAttribute('class', 'images');

  for (var image in imagesData){
    var currentImage = imagesData[image];
    var imageSrc = currentImage["src"];
    var imageTitle = currentImage["title"];
    var imageCategory = currentImage["category"];
    var imageDate = parseInt(currentImage["date"]);
    var imageLocation = currentImage["location"];
    var imagePhotographer = currentImage["photographer"];

    var parsedDate = new Date(imageDate);
    var finalDate = parsedDate.getDate()+"/"+parsedDate.getMonth()+"/"+parsedDate.getFullYear();

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
    images.append(imageContainer);
  }

  gallery.append(images);
  galleryApp.append(gallery);

  if (buildModal){
    var modal=buildModalUI();
    galleryApp.appendChild(modal);
  }
}

function fetchImageData(url, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function (){
    if(this.readyState == 4 && this.status == 200){
      imagesData = JSON.parse(this.responseText).images;
      // console.log(imagesData);
      images = imagesData;
      callback(imagesData, true);
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