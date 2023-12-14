// This line adds an event listener for the 'DOMContentLoaded' event, 
// which fires when the initial HTML document has been completely loaded and parsed.
document.addEventListener("DOMContentLoaded", function () {
  // This line selects all anchor (a) elements with an href attribute that starts with "#".
   const links = document.querySelectorAll('a[href^="#"]');
   // This line iterates through each selected anchor element.
   links.forEach(anchor => {
     // This line adds a click event listener to each anchor element.
     anchor.addEventListener('click', function (e) {
       // This line prevents the default behavior of the click event, 
     // which is to navigate to the linked URL (in this case, the "#" anchor).
       e.preventDefault();
 
     // This line finds the target element based on the href attribute of the clicked anchor.
     // It uses the querySelector method to select the element with the corresponding ID.
     // The this.getAttribute('href') extracts the value of the href attribute.
       document.querySelector(this.getAttribute('href')).scrollIntoView({
         // This line scrolls the document to bring the target element into view, 
     // with a smooth scrolling effect specified by the 'behavior' option.
         behavior: 'smooth'
       });
     });
   });
 });