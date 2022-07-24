// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


  window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  var prevScrollpos = window.pageYOffset;
  window.onscroll = function() {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
      const navbar = document.getElementById('top')
      var currentScrollPos = window.pageYOffset
        if (prevScrollpos > currentScrollPos) {
          navbar.classList.remove("scrolled");
        } else {
          navbar.classList.add("scrolled");
        }
        prevScrollpos = currentScrollPos;
      }
    }
  }