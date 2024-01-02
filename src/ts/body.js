

// ============================================================================
// States
// ============================================================================

function toggleActive(x) {
  if (x.classList.contains("active")) {
      x.classList.remove("active");
  } else {
      x.classList.add("active");
  }
}

// function toggleDisplay(x) {
//     if (x.style.display === "none") {
//         x.style.display = "block";
//         } else {
//             if (x.style.display === "block") {
//                 x.style.display = "none";
//                 }
//             }
//      }


// Fetch all the details element.
const details = document.querySelectorAll("details");

// Add the onclick listeners.
details.forEach((targetDetail) => {
  targetDetail.addEventListener("click", () => {
    // Close all the details that are not targetDetail.
    details.forEach((detail) => {
      if (detail !== targetDetail) {
        detail.removeAttribute("open");
      }
    });
  });
});

// ============================================================================
// Preloader
// ============================================================================

const preloader = document.querySelector(".preloader");

window.addEventListener("load", () => {
  setTimeout(hideLoader, 500);
});

function hideLoader(){
  preloader.classList.add("preloader_hidden");
}





// ============================================================================
// Values
// ============================================================================

var mode = getStoredValue('myPageMode');

function storeValue(key, value) {
    if (localStorage) {
        localStorage.setItem(key, value);
    } else {
        $.cookies.set(key, value);
    }
}

function getStoredValue(key) {
    if (localStorage) {
        return localStorage.getItem(key);
    } else {
        return $.cookies.get(key);
    }
}






// ============================================================================
// Aside Handler
// ============================================================================


var aside_left_menu = document.getElementById("aside_left_menu");

function toggleLeftMenu() {
  if (aside_left_menu.classList.contains("active")) {
    aside_left_menu.classList.remove("active");
    storeValue("aside_left_menu_active", "hide");
  } else {
    aside_left_menu.classList.add("active");
    storeValue("aside_left_menu_active", "show");
  }
}

function getStateLeftMenu() {
  let aside_left_menu_active = getStoredValue("aside_left_menu_active");
  if (aside_left_menu_active == "show") {
    aside_left_menu.classList.add("active");
  } else if (aside_left_menu_active == "hide") {
    aside_left_menu.classList.remove("active");
  }
}

window.onload = function() {
  getStateLeftMenu();
};




// ============================================================================
// Scroll
// ============================================================================


// Vertical Scroll Function
function scrollSmooth(distance, speed) {
  var int = setInterval(function() {
      window.scrollTo(0, speed);
      speed += 10;
      if (speed >= distance) clearInterval(int);
      }, 20);
  }

// When the user clicks on the button, scroll to the top of the document
function buttonScrollUp() {
  button_up.addEventListener("click", function() {
      element = document.getElementById("content_cover");
      yOffset = 0; 
      yDistance = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: yDistance, behavior: "smooth"});
  })
}

//
function buttonScrollDown() {
  button_down.addEventListener("click", function() {
      element = document.getElementById("main");
      yOffset = -100; 
      yDistance = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: yDistance, behavior: "smooth"});
      // var speed = 10;
      // scrollSmooth(yDistance, speed)
  })
}

// Get the buttons:
var button_up   = document.getElementById("cover_arrow_up");
if (button_up   !== null){
  buttonScrollUp();
}
var button_down = document.getElementById("content_cover_arrow");
if (button_down !== null){
  buttonScrollDown();
}

//
function scrollButton() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      button_up.style.display = "block";
      } else {
          button_up.style.display = "none";
      }
  }

// When the user scrolls down 100px from the top of the document, show the button
if (button_up   !== null){
  window.onscroll = function() {scrollButton()};
}


// ============================================================================
// Buttons
// ============================================================================


// Read More Button
var c = document.getElementsByClassName("button_previous");
var k;
for (k = 0; k < c.length; k++) {
  c[k].addEventListener("click", function() {
      this.classList.toggle("active");
      var x = this.previousElementSibling;
      var y = c[k];
      toggleActive(x)
      toggleActive(y)            
      })
  }


  
// ============================================================================
// Ribbon
// ============================================================================


// Ribbon Navigation Button
var ribbon = document.getElementById("ribbon");
var ribbonNavigationButton = document.getElementById("ribbon_header_button");
var ribbonNavigation = document.getElementById("ribbon_nav");
var ribbonNavigationLinks = document.getElementsByClassName("ribbon_nav_list_item_link");
ribbonNavigationButton.addEventListener("click", function() {
  var l = ribbonNavigationLinks.length;
  var s;
  var d = 200;
  for (i = 0; i < l; i++) {
      (function(i) {
          if (ribbon.classList.contains("active")) {
              t = d * (l - i - 1);
              s = 0;
              setTimeout(function() { toggleActive(ribbonNavigationLinks[i]); }, t);
          } else {
              t = d * i;
              s = d * l*5;
              setTimeout(function() { toggleActive(ribbonNavigationLinks[i]); }, t);
          }
      })(i);
  }
  setTimeout(toggleActive(ribbon), s);
  setTimeout(toggleActive(ribbonNavigation), s);
  setTimeout(toggleActive(ribbonNavigationButton), s);
})

////////////



// Cookie Consent
// (function() {
  //     if (!localStorage.getItem("cookieconsent")) {
  //         document.body.innerHTML += "\
  //         <div class="cookieconsent"">\
  //             This site uses cookies. By continuing to use this website, you agree to their use. \
  //             <a href="#" style="color:#CCCCCC;">I Understand</a>\
  //         </div>\
  //         ";
  //         document.querySelector(".cookieconsent a").onclick = function(e) {
  //             e.preventDefault();
  //             document.querySelector(".cookieconsent").style.display = "none";
  //             localStorage.setItem("cookieconsent", true);
  //         };
  //     }
  // })();