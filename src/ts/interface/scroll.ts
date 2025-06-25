// ============================================================================
// Interface | Scroll
// ============================================================================

// Vertical Scroll Function
// export function scrollSmooth(distance: number, speed: number) {
//     var int = setInterval(function() {
//         window.scrollTo(0, speed);
//         speed += 10;
//         if (speed >= distance) clearInterval(int);
//         }, 20);
//     }

//   // When the user clicks on the button, scroll to the top of the document
//   export function buttonScrollUp() {
//     button_up.addEventListener("click", function() {
//         let element = document.getElementById("content_cover");
//         let yOffset = 0;
//         let yDistance = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
//         window.scrollTo({top: yDistance, behavior: "smooth"});
//     })
//   }

//   //
// export function buttonScrollDown() {
//     button_down.addEventListener("click", function() {
//         let element = document.getElementById("main");
//         let yOffset = -100;
//         let yDistance = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
//         window.scrollTo({top: yDistance, behavior: "smooth"});
//         // var speed = 10;
//         // scrollSmooth(yDistance, speed)
//     })
//   }

//   // Get the buttons:
//   var button_up   = document.getElementById("cover_arrow--up");
//   if (button_up   !== null){
//     buttonScrollUp();
//   }
//   var button_down = document.getElementById("content_cover_arrow");
//   if (button_down !== null){
//     buttonScrollDown();
//   }

//   //
//   export function scrollButton() {
//     if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
//         button_up.style.display = "block";
//         } else {
//             button_up.style.display = "none";
//         }
//     }

//   // When the user scrolls down q(100) from the top of the document, show the button
//   if (button_up   !== null){
//     window.onscroll = function() {scrollButton()};
//   }

//   export {};
