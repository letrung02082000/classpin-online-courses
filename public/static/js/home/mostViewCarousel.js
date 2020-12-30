const prev2 = document.querySelector('.prev2');
const next2 = document.querySelector('.next2');

const track2 = document.querySelector('.track2');

let carouselWidth2 = document.querySelector('.carousel-container2').offsetWidth;

window.addEventListener('resize', () => {
    carouselWidth2 = document.querySelector('.carousel-container2').offsetWidth;
});

let index2 = 0;

next2.addEventListener('click', () => {
    index2++;
    prev2.classList.add('show');
    track2.style.transform = `translateX(-${index2 * carouselWidth2}px)`;

    if (track2.offsetWidth - index2 * carouselWidth2 < carouselWidth2) {
        next2.classList.add('hide');
    }
});

prev2.addEventListener('click', () => {
    index2--;
    next2.classList.remove('hide');
    if (index2 === 0) {
        prev2.classList.remove('show');
    }
    track2.style.transform = `translateX(-${index2 * carouselWidth2}px)`;
});
