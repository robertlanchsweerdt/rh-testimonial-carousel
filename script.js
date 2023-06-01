const testimonialsContainer = document.querySelector(
  '.rh-testimonial__radial-container'
);
const slider = document.querySelector('.rh-testimonials__slider');
const slides = slider.querySelectorAll('.rh-testimonial__slide');
let sliderRadialBtns;
let newIndex = 0;
let offset = 0;
const slidesCount = slides.length;

let slideInterval;
const transitionSpeed = 3000;

let isDragging = false,
  startPos = 0,
  endPos = 0;

setupRadialBtns();
disableDefault();
activateListeners();

// create radial buttons

function setupRadialBtns() {
  for (let i = 0; i < slidesCount; i++) {
    const radialDiv = document.createElement('div');
    radialDiv.classList.add('rh-testimonial__radial-btn');
    testimonialsContainer.appendChild(radialDiv);
  }

  sliderRadialBtns = testimonialsContainer.querySelectorAll(
    '.rh-testimonial__radial-btn'
  );

  // add active class to first radial button
  sliderRadialBtns[0].classList.add('rh-radial-active');
}

function moveSlider(newIndex) {
  const activeSlide = slider.querySelector('.active');
  activeSlide.classList.remove('active');
  slides[newIndex].classList.add('active');

  updateButtons(newIndex);
  clearInterval(slideInterval);
  slideInterval = setInterval(autoSlide, transitionSpeed);
}

function computeReposition(offset) {
  const currentIndex = [...slides].indexOf(slider.querySelector('.active'));
  newIndex = currentIndex + offset;

  if (newIndex < 0) {
    newIndex = slidesCount - 1;
  }
  if (newIndex > slidesCount - 1) {
    newIndex = 0;
  }
  moveSlider(newIndex);
}

function activateListeners() {
  // add event listener to slides
  slides.forEach((slide, index) => {
    // touch and mouse events
    slide.addEventListener('pointerdown', pointerDown);
    slide.addEventListener('pointerup', pointerUp);
    slide.addEventListener('pointermove', pointerMove);
  });

  sliderRadialBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      newIndex = [...sliderRadialBtns].indexOf(e.target);
      moveSlider(newIndex);
    });
  });
}

function disableDefault() {
  // disable context menu
  slider.oncontextmenu = function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
}

function pointerDown(e) {
  endPos = 0;
  startPos = e.clientX;
  isDragging = true;
  slider.classList.add('grabbing');
}

function pointerMove(e) {
  if (isDragging) {
    endPos = e.clientX;
  }
}

function pointerUp(e) {
  isDragging = false;
  slider.classList.remove('grabbing');

  if (endPos === 0) return;

  if (startPos > endPos) {
    offset = 1;
    computeReposition(offset);
  }
  if (startPos < endPos) {
    offset = -1;
    computeReposition(offset);
  }
}

function updateButtons(index) {
  sliderRadialBtns.forEach(
    (btn) => (btn.className = 'rh-testimonial__radial-btn')
  );

  sliderRadialBtns[index].className =
    'rh-testimonial__radial-btn rh-radial-active';
}

function autoSlide() {
  offset = 1;
  computeReposition(offset);
}

slideInterval = setInterval(autoSlide, transitionSpeed);
