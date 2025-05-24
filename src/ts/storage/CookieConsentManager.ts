// ============================================================================
// Cookie Consent Manager
// ============================================================================

// interface CookieConsentOptions {
//     message: string;
//     buttonText: string;
//     cssClass: string;
// }

// export default class CookieConsentManager {
//     private options: CookieConsentOptions;

//     constructor(options?: Partial<CookieConsentOptions>) {
//         this.options = {
//             message: "This site uses cookies. By continuing to use this website, you agree to their use.",
//             buttonText: "I Understand",
//             cssClass: "cookieconsent",
//             ...options
//         };

//         this.initializeCookieConsent();
//     }

//     private initializeCookieConsent(): void {
//         if (!localStorage.getItem("cookieconsent")) {
//             const consentHtml = `
//                 <div class="${this.options.cssClass}" role="dialog" aria-label="Cookie Consent">
//                     ${this.options.message}
//                     <button>${this.options.buttonText}</button>
//                 </div>
//             `;

//             document.body.insertAdjacentHTML('beforeend', consentHtml);
//             this.addClickListener();
//         }
//     }

//     private addClickListener(): void {
//         const consentButton = document.querySelector(`.${this.options.cssClass} button`);
//         if (consentButton) {
//             consentButton.addEventListener('click', (e) => this.handleConsent(e));
//         }
//     }

//     private handleConsent(e: Event): void {
//         e.preventDefault();
//         const consentDiv = document.querySelector(`.${this.options.cssClass}`);
//         if (consentDiv) {
//             consentDiv.style.display = "none";
//         }
//         localStorage.setItem("cookieconsent", "true");
//     }
// }

// // Usage
// new CookieConsentManager({
//     message: "We use cookies to improve your experience.",
//     buttonText: "Got it!"
// });

// (function() {
//       if (!localStorage.getItem("cookieconsent")) {
//           document.body.innerHTML += "\
//           <div class="cookieconsent"">\
//               This site uses cookies. By continuing to use this website, you agree to their use. \
//               <a href="#" style="color:#CCCCCC;">I Understand</a>\
//           </div>\
//           ";
//           document.querySelector(".cookieconsent a").onclick = function(e) {
//               e.preventDefault();
//               document.querySelector(".cookieconsent").style.display = "none";
//               localStorage.setItem("cookieconsent", true);
//           };
//       }
//   })();
