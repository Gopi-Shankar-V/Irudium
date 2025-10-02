import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';

export const useScrollReveal = () => {
  useEffect(() => {
    const sr = ScrollReveal({
      origin: 'top',
      distance: '60px',
      duration: 2500,
      delay: 400,
      // reset: true  // animation repeat
    });

    // Home page animations
    sr.reveal('.home__data, .experience, .skills, .contact__container');
    sr.reveal('.home__img', { delay: 600 });
    sr.reveal('.home__scroll', { delay: 800 });
    sr.reveal('.work__card, .services__card', { interval: 100 });
    sr.reveal('.about__content', { origin: 'right' });
    sr.reveal('.about__img', { origin: 'left' });

    // Additional animations for different sections
    sr.reveal('.stats__item', { interval: 200 });
    sr.reveal('.testimonial__card', { interval: 150 });
    sr.reveal('.process__step', { interval: 100 });
    sr.reveal('.tech__item', { interval: 80 });
    sr.reveal('.industry__card', { interval: 120 });
    sr.reveal('.blog__card', { interval: 100 });
    sr.reveal('.feature__item', { origin: 'bottom', interval: 150 });

    return () => {
      sr.destroy();
    };
  }, []);
};