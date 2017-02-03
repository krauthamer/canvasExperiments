function filterGreen(image, idx){
	image.data[idx] = 0; 
	image.data[idx+2] = 0; 
	return 
}

function filterRed(image, idx){
	image.data[idx+1] = 0; 
	image.data[idx+2] = 0; 
}

function filterBlue(image, idx){
	image.data[idx] = 0; 
	image.data[idx+1] = 0; 
}

function mysobel(currImageData, newImageData, w, h) {
    arr = tracking.Image.sobel(currImageData, w, h);
    for(var idx = 0; idx < arr.length; idx ++){
        newImageData[idx] = arr[idx]
    }
    return newImageData; 
}