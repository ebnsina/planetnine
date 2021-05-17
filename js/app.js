gsap.registerPlugin(ScrollTrigger);

const mainContainer = document.querySelector('#main');
const fillBackground = document.querySelector('fill-background');
const loaderInner = document.querySelector('.loader .inner');
const loaderProgress = document.querySelector('.loader .progress');
const loader = document.querySelector('.loader');

gsap.set(loader, { autoAlpha: 1 });

gsap.set(loaderInner, {
  scaleY: 0.0005,
  transformOrigin: 'bottom',
});

const progressTl = gsap.to(loaderProgress, {
  paused: true,
  scaleX: 0,
  ease: 'none',
  transformOrigin: 'right',
});

let loadedImageCount = 0;
let imageCount;

const imageLoad = imagesLoaded(mainContainer);
imageCount = imageLoad.images.length;

updateProgress(0);

imageLoad.on('progress', function () {
  loadedImageCount++;
  updateProgress(loadedImageCount);
});

function updateProgress(value) {
  gsap.to(progressTl, {
    progress: value / imageCount,
    duration: 0.3,
    ease: 'power1.out',
  });
}

imageLoad.on('done', function () {
  gsap.to(progressTl, {
    autoAlpha: 0,
    onComplete: initLoader,
  });
});

function initLoader() {
  const image = document.querySelector('.loader-image img');
  const mask = document.querySelector('.loader-image-mask');
  const line1 = document.querySelector('.x-title-one');
  const line2 = document.querySelector('.x-title-two');
  const lines = document.querySelectorAll('.loader-title-mask');
  const loaderContent = document.querySelector('.loader-content');

  const tlLoaderIn = gsap.timeline({
    defaults: {
      duration: 1.1,
      ease: 'power2.out',
    },
    onComplete: () =>
      document.querySelector('body').classList.remove('is-loading'),
  });

  tlLoaderIn
    .set(loaderContent, { autoAlpha: 1 })
    .to(
      loaderInner,
      {
        scale: 1,
        transformOrigin: 'bottom',
        ease: 'power2.inOut',
      },
      '+=1'
    )
    .addLabel('revealImage')
    .from(mask, { yPercent: 100 }, 'addLabel-=0.6')
    .from(image, { yPercent: -80 }, 'addLabel-=0.6')
    .from(
      [line1, line2],
      { yPercent: 100, stagger: 0.1, autoAlpha: 0 },
      'addLabel-=0.4'
    );

  const tlLoaderOut = gsap.timeline({
    defaults: {
      duration: 1.2,
      ease: 'power2.inOut',
    },
    delay: 1,
  });

  tlLoaderOut
    .to(lines, { yPercent: -500, stagger: 0.2 }, 0)
    .to([loader, loaderContent], { yPercent: -100 }, 0.2)
    .from('#main', { y: 150 }, 0.2);

  const tlLoader = gsap.timeline();

  tlLoader.add(tlLoaderIn).add(tlLoaderOut);
}

function initNavigation() {
  const mainNavLinks = gsap.utils.toArray('.main-nav a');
  const mainNavLinksReverse = gsap.utils.toArray('.main-nav a').reverse();

  mainNavLinks.forEach((link) => {
    link.addEventListener('mouseleave', (e) => {
      link.classList.add('animate-out');

      setTimeout(() => {
        link.classList.remove('animate-out');
      }, 300);
    });
  });

  function navAnimation(direction) {
    const scrollingDown = direction === 1;
    const links = scrollingDown ? mainNavLinks : mainNavLinksReverse;

    return gsap.to(links, {
      duration: 0.3,
      stagger: 0.05,
      autoAlpha: () => (scrollingDown ? 0 : 1),
      y: () => (scrollingDown ? 20 : 0),
      ease: 'Power4.out',
    });
  }

  ScrollTrigger.create({
    start: 100,
    end: 'bottom bottom-=20',
    toggleClass: {
      targets: '#root',
      className: 'has-scrolled',
    },
    onEnter: ({ direction }) => navAnimation(direction),
    onLeaveBack: ({ direction }) => navAnimation(direction),
  });
}

function heroTextAnimation() {
  const heroTitleTexts = gsap.utils.toArray('.title span');
  const heroSubtitleText = gsap.utils.toArray('.subtitle');

  const tl = gsap.timeline();

  tl.from(heroTitleTexts, {
    duration: 0.9,
    yPercent: 100,
    stagger: 0.1,
    ease: 'Power4.in',
  });

  tl.to(heroSubtitleText, {
    duration: 1,
    yPercent: 101,
    x: 0,
    scale: 1,
    autoAlpha: 1,
    ease: 'Power4.out',
  });
}

function ctaAnimation() {
  const ctaBtn = document.querySelector('#cta-btn');

  ctaBtn.addEventListener('mouseenter', animateBtn);
  ctaBtn.addEventListener('mouseleave', animateBtn);

  const tl = new TimelineMax();

  tl.to(ctaBtn.children[0], {
    duration: 0.4,
    attr: { width: 160, fill: '#495bbe' },
    autoAlpha: 0.8,
    ease: Elastic.easeOut.config(1, 1),
  });

  tl.to('text', 0.2, { fill: '#fff', ease: Linear.easeNone }, 0);

  tl.reversed(true);

  function animateBtn() {
    tl.reversed(!tl.reversed());
  }
}

function init() {
  initNavigation();
  heroTextAnimation();
  ctaAnimation();
}

window.addEventListener('load', init);
