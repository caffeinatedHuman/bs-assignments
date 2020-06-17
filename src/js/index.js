var imagesData;
var currentImagesData;
var galleryApp;

var images = null;
var sortByVariables = ['category', 'title', 'date', 'location'];
var sortFilterActive = false;
var filterByActive = false;
var currenSortValue = "category";
var currentFilterValue = "Category 1";
var currentModalIndex = 0;

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
  console.log('Sorting the Gallery:');
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
  console.log('Returning image array:', inputImageArray);
  console.log('Sorted the Gallery;');
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

function changeModalImage(type){

  console.log('Change modal image:');
  console.log(currentImagesData);
  console.log('Change modal image;');

  var currentModalLength = currentImagesData.length;

  var modalImage = document.getElementById('modal-image');
  var newSrc = '';
  
  var newIndex = parseInt(currentModalIndex)+ parseInt(type);
  if ( type == 1){
    console.log('Advance by 1 :)');
    if (newIndex < currentModalLength){
      newSrc = newIndex;
    } else {
      newSrc = 0;
    }
  } else{
    console.log('Advance by -1 :)');
    if( newIndex > 0){
      newSrc = newIndex;
    } else {
      newSrc = currentModalLength;
    }
  }
  currentModalIndex = newSrc;

  var newImageSrc = currentImagesData[newSrc].src;
  modalImage.setAttribute('src',newImageSrc)
}

function closeModal (){
  var modalContainer = document.getElementById('gallery-modal');
  modalContainer.classList.add('hide');
}

function showImageModal(e){
  console.log(e);
  console.log(e.target);
  console.log(e.target.src);

  var modalContainer = document.getElementById('gallery-modal');
  modalContainer.classList.remove('hide');
  var modalImage = document.getElementById('modal-image');
  modalImage.setAttribute('src', e.target.src);
  currentModalIndex = e.target.dataset.position;
}

function buildModalUI(){
  var modalContainer = document.createElement('div');
  modalContainer.setAttribute('class', 'modal-container hide');
  modalContainer.setAttribute('id','gallery-modal');

  var modalOverlay = document.createElement('div');
  modalOverlay.setAttribute('class','modal-overlay');

  var modal = document.createElement('div');
  modal.setAttribute('class', 'modal');

  var modalImage = document.createElement('img');
  modalImage.setAttribute('class', 'modal-image');
  modalImage.setAttribute('id', 'modal-image');
  modalImage.setAttribute('src', 'images/1.jpg');

  var crossButton = document.createElement('div');
  crossButton.setAttribute('id', 'close-modal');
  crossButton.setAttribute('class', 'close-modal');
  crossButton.innerHTML = '&#10005;';
  crossButton.addEventListener("click", closeModal)

  var previousButton = document.createElement('div');
  previousButton.setAttribute('class', 'modal-previous-button')
  previousButton.innerHTML = '&#10094;';
  previousButton.addEventListener("click", function (){
    changeModalImage(-1);
  });
  
  var nextButton = document.createElement('div');
  nextButton.setAttribute('class', 'modal-next-button')
  nextButton.innerHTML = '&#10095;';
  nextButton.addEventListener("click", function (){
    changeModalImage(1);
  });

  modal.append(modalImage);
  modal.appendChild(crossButton);
  modal.appendChild(previousButton);
  modal.appendChild(nextButton);

  modalContainer.append(modalOverlay);
  modalContainer.appendChild(modal);

  return modalContainer;
}

function buildFilters(type, optionValues){
  var selectTag = document.createElement('select');
  var pTag = document.createElement('p');

  if (type === 'sort') {
    pTag.innerText = ('Sort By:');
    
    var sortByFilter = document.createElement('div');
    sortByFilter.setAttribute('class', 'sortby-container');
    
    selectTag.setAttribute('class','sortByFilter');
    selectTag.addEventListener('change', function (){
      var filteredImages = filterGallery(currentFilterValue, imagesData);
      var sortedImages = sortGallery (event.target.value, filteredImages);
      currentImagesData = sortedImages;
      rebuildGallery(currentImagesData, "sort");
    });
    
    for (var val in optionValues){
      var option = document.createElement('option');
      option.setAttribute('value', optionValues[val]);
      option.text = optionValues[val];
      
      selectTag.appendChild(option);
    }
    
    sortByFilter.appendChild(pTag);
    sortByFilter.appendChild(selectTag);
    return sortByFilter;
  } else if (type === 'filtering'){
    pTag.innerText = ('Filter By:');

    var filteByFilter = document.createElement('div');
    filteByFilter.setAttribute('class', 'filterby-container');

    selectTag.setAttribute('class', 'filterByFilter');
    selectTag.addEventListener('change', function (){
      var sortedImages = sortGallery(currenSortValue, imagesData);
      currentImagesData = filterGallery(event.target.value, sortedImages);
      rebuildGallery(currentImagesData, "filter");
    });

    for (val in optionValues){
      var option = document.createElement('option');
      option.setAttribute('value', optionValues[val]);
      option.text = optionValues[val];

      selectTag.appendChild(option);
    }

    filteByFilter.appendChild(pTag);
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
    imageContainer.addEventListener('click', function (e){
      showImageModal(e);
    })
    
    // Image HTML Element:
    var imageElement = document.createElement('img');
    var imageSrc = imageSrc;
    imageElement.setAttribute('src',imageSrc);
    imageElement.setAttribute('class','image');
    imageElement.setAttribute('data-position',image);

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
  if (!sortFilterActive && !filterByActive){
    galleryApp.append(gallery);
  }

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
      currentImagesData = imagesData;
      callback(currentImagesData, true);
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