///////////////
// Slideshos //
///////////////

var slideshow   = document.getElementById('slideshow');

var controlPrev =       document.getElementById("slideshow_control_prev");
var controlNext =       document.getElementById("slideshow_control_next");
var controlDots =       document.getElementsByClassName("slideshow_control_dot");
var slideIndex  = 0;
var slides, dots;

if (slideshow   !== null){
    showSlides();
}



//
// function removeActive(i, items) {
//     for (i = 0; i < items.length; i++) {
//         items[i].classList.remove("active");
//     }
// }

//
// function addActive(i, items) {
//     if (items.length > 0) {
//         items[slideIndex - 1].classList.add("active");
//     }
// }

function currentSlide(index) {
    if (index > slides.length) {index = 1}
    else if(index < 1){index = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
        }
    slides[index - 1].classList.add("active");
    if (dots.length > 0) {
    dots[index-1].className += " active";
    }
}

function plusSlides(position) {
    slideIndex += position;
    if (slideIndex > slides.length) {slideIndex = 1}
    else if(slideIndex < 1){slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
        }
    slides[slideIndex - 1].classList.add("active");
    if (dots.length > 0) {
    dots[slideIndex-1].className += " active";
    }
}


function showSlides() {
    var i;
    slides = document.getElementsByClassName("slideshow_slide");
    dots = document.getElementsByClassName("slideshow_control_dot");
    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    slideIndex++;
    if (slideIndex> slides.length) {slideIndex = 1}    
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
        }
    slides[slideIndex - 1].classList.add("active");
    if (dots.length > 0) {
        dots[slideIndex-1].className += " active";
    }
    setTimeout(showSlides, 5000); // Change image every 3 seconds
}


// Button Previous -ok
controlPrev.addEventListener("click", function() {
    plusSlides(-1)
})

// Button Next -ok
controlNext.addEventListener("click", function() {
    plusSlides(1)
})

// 
for (let j = 0; j < controlDots.length; j++) { 
    let button = controlDots[j]; button.addEventListener("click", function() { currentSlide(j+1); }); 
}