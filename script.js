document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".nav-bar a");
    for (const link of navLinks) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const listItems = document.querySelectorAll('.tech-stack li');

    listItems.forEach(item => {
        const img = item.querySelector('img');
        const originalSrc = img.src;
        const hoverSrc = item.dataset.hoverSrc;

        item.addEventListener('mouseenter', function() {
            img.src = hoverSrc;
        });

        item.addEventListener('mouseleave', function() {
            img.src = originalSrc;
        });
    });
});

// document.addEventListener("DOMContentLoaded", function() {
//     const contactItems= document.querySelectorAll('.contact-header div');
//     contactItems.forEach(item => {
//         const img = item.querySelector('img');
//         const originalSrc = img.src
//         const hoverSrc = item.dataset.hoverSrc;

//         item.addEventListener('mouseenter', function(){
//             img.src = hoverSrc
//         })
//         item.addEventListener('mouseleave', function(){
//             img.src = originalSrc
//         })
//     })
// })
