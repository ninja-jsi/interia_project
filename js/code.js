window.addEventListener('resize', function(){
  if( window.innerHeight  != screen.height){
    elem.style['visibility']='hidden';
    elem.style['display']='none';
    elem.pause();
  }
})

function btn(link){
  location.href = link;
}

function showorhide(id) {
  if (document.getElementById(id).style.display == 'none'){
  document.getElementById(id).style.display = 'block';
  }
  else{
      document.getElementById(id).style.display = 'none';
  }
}

function openvid(val) {
  elem = document.getElementById('myvideo');
  if (elem.requestFullscreen) {
    elem.style['visibility']='visible';
    elem.style['display']='unset';
    elem.setAttribute('src', val)
    elem.load();
    elem.play();
    elem.requestFullscreen();
  }
}

window.addEventListener('scroll', function(){
  var scroll = document.querySelector('.up');
  scroll.classList.toggle("active", window.scrollY > window.innerHeight)
})
function totop(){
  window.scrollTo({
      top: 0
  })
}

document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".navbar ul li a");
  const currentPage = window.location.pathname.split("/").pop(); // Get current page filename

  links.forEach(link => {
      if (link.getAttribute("href") === currentPage) {
          link.classList.add("active"); // Add active class to correct link
      }
  });
});

// Navigation functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('#hamburger-icon');
    const navMenu = document.querySelector('#nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    document.querySelectorAll('#nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});
