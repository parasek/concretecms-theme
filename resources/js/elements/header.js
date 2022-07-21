import throttle from 'lodash/throttle';

const htmlNode = document.documentElement;

function handleScroll() {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 10) {
        htmlNode.classList.add('scrolled');
    } else {
        htmlNode.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', throttle(handleScroll, 300));
