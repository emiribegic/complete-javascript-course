'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTO = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling (Smooth scroll 🥺)

btnScrollTO.addEventListener('click', e => {
  // Get Y of section 1
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect()); // e.target points btnScrollTO
  console.log('Current scroll (X/Y), ', window.pageXOffset, window.pageYOffset);
  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling

  // Old way
  // window.scrollTo(s1coords.left, s1coords.top);
  // To scroll to the section 1, no matter where the page is scroll down, add pageOffset
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scroll({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // New way
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation

// Attaching same event handler to multiple elements is bad practice -> USE EVENT DELEGATION
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth',
//     });
//   });
// });

// Event delegation
// 1. Add event handler to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Event happens only nav__link is clicked
  if (e.target.classList.contains('nav__link')) {
    // e.target is where the event occurs
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // Guard clause - if there is no click event (returns falsy value), it returns immediately and no later code will be excuted
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
// const handleHover = (e, opacity) => {
// Event handler usually accepts one param which is event (e)!

const handleHover = function (e) {
  // console.log(e.currentTarget);
  // console.log(this);
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this; // current element is not selected link itself
    });

    logo.style.opacity = this;
  }
};

// Passing 'argument' in handler

// 'mouseenter' is similar but 'mouseover' is bubbled, hover
nav.addEventListener('mouseover', handleHover.bind(0.5));
// bind() is another function and bind argument 0.5 with handleHover, so 'this' is 0.5 in handleHover

// This works as above but not so beautiful
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });

// Opposite of 'mouseover' - when mouse goes away from element
nav.addEventListener('mouseout', handleHover.bind(1));

// This works as above but not so beautiful
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

// Sticky navigation: Scroll Event - not so efficient and better avoid implementing (bc each scroll event will be occured and it is bad performance)

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   // To make nav sticky when scrolling reaches first section
//   // current scroll position of Y, depends on viewport
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky navigation: Intersection Observer API
// const obsCallback = function (entries, observer) {
//   // takes two arguments as above
//   // will be called each time target element is intersecting root element at threshold (percentage 0.1 = 10%) = when section 1 intersects 10% of viewport
//   entries.forEach(entry => console.log(entry)); // check intersectionRatio, it should be > 10%
// };
// const obsOptions = {
//   root: null, // target element or null means entire viewport
//   threshold: [0, 0.2], // percentage of intersection at which callback will be called
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1); // target element

// When header is 100% gone, stick the nav to the top
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries; // same as entries[0]
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // 0% of header is visible = out of viewport
  rootMargin: `-${navHeight}px`, // box of px is applied outside of the element, px is only allowed, stops header 90px before threshold (end)
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  // Remove hidden className from sections intersecting viewport
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  // Once all the job is doen, no need to observe anymore
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, // greater than 0 so that it will show up a bit later
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');⭐️
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]'); // imgs which have data-src attribute

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // Remove lazy-img class
  // DO NOT just remove bc it is to slow to load img so put them in loading event handler
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // Remove observer once everything is done
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // not letting users know we are using lazy images
});
imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curSlide = 0; // current slide
  const maxSlide = slides.length;
  const dotContainer = document.querySelector('.dots');

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // Change color of dots when active
  const activateDot = function (slide) {
    // 1. first select all dots and deactivate them
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    // 2. activate them when their data-slide attribute is corresponded number
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
      // curSlide = 0: 0-1 = -1 * 100 = -100% and so on
    });
  };

  // Click to next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Click to previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0); // When the page is reloaded, still works
  };
  init();

  // Event handlers

  // Allow keydown to slide
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide(); // short-circuiting
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset; // get value of data-slide as 0 ~ 3
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

/*
///////////////////////////////////////
// Selecting, Creating, and Deleting Elements

// Selecting elements
console.log(document.documentElement); // <html></html>
console.log(document.head); // <head></head>
console.log(document.body); // <body></body>

// Selecting all tags and classes and return as HTMLCollection
// Not used so often
console.log(document.getElementsByTagName('button')); // Select all tags
console.log(document.getElementsByClassName('btn')); // Select all classes

// Creating and inserting elements
// insertAdjacentHTML()
// const h4 = document.querySelector('h4');
// h4.insertAdjacentHTML(
//   'beforeend',
//   `<h3>I just want to test if this will be rendered correctly!</h3>`
// );

// Prepend - insert Node object b4 the first child of the ParentNode
const header = document.querySelector('header');
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent =
//   'We use cookies for imporoved and functionality and analytics.';
message.innerHTML =
  'We use cookies for imporoved and functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);

// Append - insert Node object after the last child of the ParenetNode
header.append(message);

// before / after methods
// header.before(message);
// header.after(message);

// Deleting elements
const closeCookie = document.querySelector('.btn--close-cookie');
closeCookie.addEventListener('click', () => message.remove());
*/

/*
///////////////////////////////////////
// Styles, attributes and classes

// Styles
message.style.background = '#37383d';
message.style.width = '120%';

// Thoes inline styles can be logged like this
console.log(message.style.background);

// But styles in CSS, we need to use getComputedStyle
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// message.style.height = getComputedStyle(message).height + 30 + 'px'; // this doesn't work, because returns value is string
console.log(message.style.height);

// Change CSS value
// To change color declared in the root
document.documentElement.style.setProperty('--color-primary', 'pink');

// Attribute
const logo = document.querySelector('.nav__logo');
// To get standard attribute
console.log(logo.src); // absolute path
console.log(logo.alt);
console.log(logo.className);

// To get non-standard
console.log(logo.getAttribute('src')); // relative path

// Set attribute
logo.setAttribute('designer', 'Mau');
console.log(logo.getAttribute('designer')); // Mau

// Data attribute
console.log(logo.dataset.versionNumber); // 3.0

// DO NOT set classes like this, this overrides the existing class
// logo.className = 'Mau'
// USE classList.add / remove / toggle / contains
console.log(logo.classList.contains('nav__logo')); // true
*/

/*
///////////////////////////////////////
// Event handlers
const h1 = document.querySelector('h1');
const alertH1 = e => {
  alert('Eventhandler');

  // Prevent from listening after one time
  // h1.removeEventListener('mouseenter', alertH1);
};

h1.addEventListener('mouseenter', alertH1);
// Prevent from liestening after cetrain time
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 5000);
*/

/*
///////////////////////////////////////
// Event propagation

// Create random color - rgb(255, 255, 255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// grandchild, event is also happened at child and parent bc event bubbles up until the parent element
document.querySelector('.nav__link').addEventListener('click', function (e) {
  // arrow function does not work with 'this' properly bc it points to parent or global scope
  this.style.background = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  // Stop event propagation, prevents event from arriving the parent element - NOT GOOD PRACTICE THO!
  // e.stopPropagation();
});

// child, event is also happened at parent bc event bubbles up to the parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.background = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

// parent, event is happened here only
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.background = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});
*/

/*
///////////////////////////////////////
// DOM Traversing

// Goind downwards: child
const h1 = document.querySelector('h1');
console.log(h1.querySelectorAll('.highlight')); // NodeList, returns no matter how deep children are located
console.log(h1.childNodes); // NodeList of all children, text, br, everything!
console.log(h1.children); // works only for direct children element
h1.firstElementChild.style.color = 'white'; // first child element
h1.lastElementChild.style.color = 'pink'; // last child element

// Going upwards: parents
console.log(h1.parentNode); // direct parent
console.log(h1.parentElement); // parent element

// Take the closest element and its parent that match selector string
h1.closest('.header').style.background = 'var(--gradient-secondary)';

// Going sideways: siblings
console.log(h1.previousElementSibling); // previous element
console.log(h1.nextElementSibling); // next element
console.log(h1.previousSibling); // previous Node
console.log(h1.nextSibling); // next Node

// To get all the siblings
// Get the parents element and get all the child elements of it
console.log(h1.parentElement.children);

// All siblings except h1
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

/*
///////////////////////////////////////
// Lifecycle DOM events - do not use them too much!!
// When HTML is fully loaded but styles and images are not
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

// When images and styles are also loaded
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// // Right before a user leaves the page
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = ''; // historical reason we have to set empty string
// });
*/
