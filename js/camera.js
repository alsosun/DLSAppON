var pictureSource;   // picture source
var destinationType; // sets the format of returned value

// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
   
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    // Uncomment to view the base64-encoded image data
    // console.log(imageData);

    // Get image handle
    //
    var smallImage = document.getElementById('smallImage');

    // Unhide image elements
    //
    smallImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI
    // Get image handle
    //
    //var largeImage = document.getElementById('largeImage');

    // Unhide image elements
    //
    //largeImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    //largeImage.src = imageURI;
    
    //store pic to std value
    $("#pic").hide()
    var stvalue = $("#assess-st-select option:selected").val();
    var currentassessment = localStorage.getItem("currentassess")
    localStorage.setItem(currentassessment + "piclink" + stvalue, imageURI)
    var size = scale2(497, 298, 15, 1),
               w = size.width,
                h = size.height,
               markup = "<img src='" + imageURI + "' width='" + w + "' height='" + h + "' />";
    $("#pic").html(markup)
    $("#pic").show()
   
}
function scale2(width, height, padding, border) {

    var scrWidth = $(window).width() - 30,
        scrHeight = $(window).height() - 30,
        ifrPadding = 2 * padding,
        ifrBorder = 2 * border,
        ifrWidth = width + ifrPadding + ifrBorder,
        ifrHeight = height + ifrPadding + ifrBorder,
        h, w;

    if (ifrWidth < scrWidth && ifrHeight < scrHeight) {
        w = ifrWidth;
        h = ifrHeight;
    } else if ((ifrWidth / scrWidth) > (ifrHeight / scrHeight)) {
        w = scrWidth;
        h = (scrWidth / ifrWidth) * ifrHeight;
    } else {
        h = scrHeight;
        w = (scrHeight / ifrHeight) * ifrWidth;
    }

    return {
        'width': w - (ifrPadding + ifrBorder),
        'height': h - (ifrPadding + ifrBorder)
    };
};
// A button will call this function
//
function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 50,
        destinationType: destinationType.FILE_URI
    });
}

// A button will call this function
//
function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL
    });
}

// A button will call this function
//
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source
    });
}

// Called if something bad happens.
//
function onFail(message) {
    alert('No Image selected because: ' + message);
}



