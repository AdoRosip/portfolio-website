const textArray = [
  "Frontend Developer",
  "Tech Explorer",
  "Code by day, markets by night",
  "Occasional procrastinator",
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100; // Typing speed in ms
const deletingSpeed = 50; // Deleting speed in ms
const delayBetweenWords = 1500; // Delay before deleting

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-bar a");
  for (const link of navLinks) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      window.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const listItems = document.querySelectorAll(".tech-stack li");

  listItems.forEach((item) => {
    const img = item.querySelector("img");
    const originalSrc = img.src;
    const hoverSrc = item.dataset.hoverSrc;

    item.addEventListener("mouseenter", function () {
      img.src = hoverSrc;
    });

    item.addEventListener("mouseleave", function () {
      img.src = originalSrc;
    });
  });
});

function typeEffect() {
  const typingElement = document.getElementById("typing-effect");
  const currentText = textArray[textIndex];

  if (isDeleting) {
    typingElement.innerText = currentText.substring(0, charIndex--);
  } else {
    charIndex++;
    typingElement.innerText = currentText.substring(0, charIndex);
  }

  let delay = isDeleting ? deletingSpeed : typingSpeed;

  if (!isDeleting && charIndex === currentText.length) {
    delay = delayBetweenWords;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % textArray.length;
  }

  setTimeout(typeEffect, delay);
}

document.addEventListener("DOMContentLoaded", typeEffect);

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

document.getElementById("resume").addEventListener("click", function () {
  // Create a link element
  const link = document.createElement("a");
  link.href = "assets/AdrianRosipalResume.pdf"; // Adjust the path if necessary
  link.download = "AdrianRosipalCV.pdf"; // The name of the downloaded file

  // Append to the body, trigger download, and remove the link
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
