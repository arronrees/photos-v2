import './reset.css';
import './style.css';
import gsap from 'gsap';
import imgsLoaded from 'imagesloaded';

function initLoadImages() {
  const loader = document.querySelector('#loader') as HTMLElement;
  const loaderBar = document.querySelector(
    '#loader .loader__line__bar'
  ) as HTMLElement;

  const imagesLoaded: any = imgsLoaded(
    document.querySelectorAll('img'),
    { background: true },
    () => {
      console.log('all images loaded');

      init();

      loader.classList.add('complete');
    }
  );

  const totalImages = imagesLoaded.images.length;
  let currentImagesLoaded = 0;
  let percentage = 1;

  imagesLoaded.on('progress', () => {
    currentImagesLoaded = imagesLoaded.progressedCount;
    percentage = Math.ceil((currentImagesLoaded / totalImages) * 100);

    loaderBar.style.width = `${percentage}%`;
  });
}

function initIntroAnimation() {
  const intro = document.querySelector('#intro') as HTMLElement;
  const enter = document.querySelector('#intro .enter') as HTMLElement;
  const title = document.querySelector('#intro .wrap--title h1') as HTMLElement;
  const subTitle = document.querySelector(
    '#intro .wrap--subtitle p'
  ) as HTMLElement;
  const titleLetters = document.querySelectorAll(
    '#intro h1 span'
  ) as NodeListOf<HTMLElement>;
  const subtitleLetters = document.querySelectorAll(
    '#intro p span'
  ) as NodeListOf<HTMLElement>;

  const tl = gsap.timeline({
    defaults: { duration: 0.4, ease: 'power1.inOut' },
  });

  tl.delay(0.8)
    .fromTo(
      titleLetters,
      { autoAlpha: 0, x: -15, y: 60 },
      { autoAlpha: 1, x: 0, y: 0, stagger: 0.05 }
    )
    .fromTo(
      subtitleLetters,
      { autoAlpha: 0, x: -15 },
      { autoAlpha: 1, x: 0, stagger: 0.03 }
    )
    .fromTo(enter, { autoAlpha: 0 }, { autoAlpha: 1 });

  enter.addEventListener('click', (e) => {
    e.preventDefault();

    tl.to(enter, { autoAlpha: 0 })
      .to([title, subTitle], { yPercent: 100 }, '-=0.25')
      .to(intro, {
        autoAlpha: 0,
        duration: 1,
      });
  });
}

function init() {
  initIntroAnimation();
  initImageMove();
  initImageTransition();
  initCursorFollow();
}

//
function initImageMove() {
  const grid = document.querySelector('.grid') as HTMLElement;
  const columns = grid.querySelectorAll('.column') as NodeListOf<HTMLElement>;

  let halfHeight: number = window.innerHeight / 2;
  let halfWidth: number = window.innerWidth / 2;

  let mouseX: number = 0;
  let mouseY: number = 0;

  let percentageX: number = 0;
  let percentageY: number = 0;

  let ballX: number = 0;
  let ballY: number = 0;

  let speed = 0.0095;

  window.addEventListener('resize', () => {
    halfHeight = window.innerHeight / 2;
    halfWidth = window.innerWidth / 2;
  });

  function animate() {
    let distX: number = mouseX - ballX;
    let distY: number = mouseY - ballY;

    percentageX = ((ballX - halfWidth) / halfWidth) * 75;
    percentageY = ((ballY - halfHeight) / halfHeight) * 125;

    ballX = ballX + distX * speed;
    ballY = ballY + distY * speed;

    grid.style.transform = `translate(${percentageX}vw, ${percentageY}vh)`;

    columns.forEach((col, i) => {
      if (i % 2 === 0) {
        col.style.transform = `translateY(${percentageY / 5}vh)`;
      } else {
        col.style.transform = `translateY(-${percentageY / 5}vh)`;
      }
    });

    requestAnimationFrame(animate);
  }

  animate();

  document.addEventListener('mousemove', ({ pageX, pageY }) => {
    mouseX = pageX;
    mouseY = pageY;
  });
}

function initImageTransition() {
  const wrapper = document.querySelector('.wrapper') as HTMLElement;
  const images = document.querySelectorAll(
    '.grid .column .img'
  ) as NodeListOf<HTMLElement>;

  const cover = document.querySelector('.cover') as HTMLElement;
  const coverSlide = cover.querySelector('.cover__slide') as HTMLElement;

  const imgBlock = cover.querySelector('.img__block') as HTMLElement;
  const coverImg = cover.querySelector('.cover__img') as HTMLElement;
  const imgOverlay = cover.querySelector('.img__overlay') as HTMLElement;

  gsap.set(cover, { scaleX: 0 });

  let screenHeight: number = window.innerHeight;
  let screenWidth: number = window.innerWidth;

  window.addEventListener('resize', () => {
    screenHeight = window.innerHeight;
    screenWidth = window.innerWidth;
  });

  function enterCover(imageUrl: string, width: number, height: number) {
    coverImg.style.backgroundImage = `url('${imageUrl}')`;

    const aspectRatio = width / height;

    let maxWidth, maxHeight;

    if (aspectRatio > 1) {
      // landscape
      maxWidth = 0.7 * screenWidth;
      maxHeight = maxWidth / aspectRatio;
    } else {
      // portrait
      maxHeight = 0.7 * screenHeight;
      maxWidth = maxHeight * aspectRatio;
    }

    imgBlock.style.width = `${maxWidth}px`;
    imgBlock.style.height = `${maxHeight}px`;

    const tl = gsap.timeline({
      defaults: { duration: 0.7, ease: 'power3.inOut' },
    });

    if (
      !gsap.isTweening([
        cover,
        wrapper,
        coverSlide,
        imgBlock,
        imgOverlay,
        coverImg,
      ])
    ) {
      tl.fromTo(cover, { scaleX: 0 }, { scaleX: 1 })
        .fromTo(wrapper, { scale: 1 }, { scale: 0.9, ease: 'power1.inOut' }, 0)
        .fromTo(coverSlide, { scaleX: 1 }, { scaleX: 0 })
        .fromTo(imgBlock, { scaleX: 0 }, { scaleX: 1 }, '-=0.65')
        .fromTo(imgOverlay, { scaleX: 1 }, { scaleX: 0 })
        .fromTo(coverImg, { scale: 1.15 }, { scale: 1 }, '-=0.7')
        .to(imgOverlay, { transformOrigin: 'left', duration: 0 })
        .to(coverSlide, { transformOrigin: 'left', duration: 0 })
        .to(cover, { transformOrigin: 'right', duration: 0 })
        .to(wrapper, { scale: 1, duration: 0 });
    }
  }

  function exitCover() {
    const tl = gsap.timeline({
      defaults: { duration: 0.65, ease: 'power2.inOut' },
    });

    if (
      !gsap.isTweening([
        cover,
        wrapper,
        coverSlide,
        imgBlock,
        imgOverlay,
        coverImg,
      ])
    ) {
      tl.fromTo(imgOverlay, { scaleX: 0 }, { scaleX: 1 })
        .fromTo(coverSlide, { scaleX: 0 }, { scaleX: 1 }, '-=0.5')
        .fromTo(cover, { scaleX: 1 }, { scaleX: 0 })
        .to(imgOverlay, { transformOrigin: 'right', duration: 0 })
        .to(coverSlide, { transformOrigin: 'right', duration: 0 })
        .to(cover, { transformOrigin: 'left', duration: 0 });
    }
  }

  images.forEach((img) => {
    const image = img.querySelector('img') as HTMLImageElement;

    img.addEventListener('click', (e) => {
      e.preventDefault();

      enterCover(image.src, image.naturalWidth, image.naturalHeight);
    });
  });

  cover.addEventListener('click', (e) => {
    e.preventDefault();

    exitCover();
  });
}

function initCursorFollow() {
  const cursor = document.querySelector('#cursor') as HTMLElement;

  let cursorX = 0;
  let cursorY = 0;

  let ballX = 0;
  let ballY = 0;

  let speed = 0.1;

  function animate() {
    let distX = cursorX - ballX;
    let distY = cursorY - ballY;

    ballX = ballX + distX * speed;
    ballY = ballY + distY * speed;

    cursor.style.left = `${ballX}px`;
    cursor.style.top = `${ballY}px`;

    requestAnimationFrame(animate);
  }

  animate();

  function cursorFollow({ pageX, pageY }: MouseEvent) {
    cursorX = pageX;
    cursorY = pageY;
  }

  document.addEventListener('mousemove', cursorFollow);
}

document.addEventListener('DOMContentLoaded', () => {
  initLoadImages();
});
