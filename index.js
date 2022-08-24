import './style.css';
import BezierEasing from 'bezier-easing';

const circle = Array.from(document.querySelectorAll('.circle.red'));

const runAnimation = (to, duration, callback) => {
  const styleKeysTo = Object.keys(to);
  const styleValuesTo = Object.values(to);

  const startTime = performance.now();

  const run = (currentTime) => {
    const elapsedTime = currentTime - startTime;

    if (elapsedTime >= duration) {
      callback(to);
      return;
    } else {
      const timeRate = (1.0 * elapsedTime) / duration;
      const numberRate = BezierEasing(0.32, 0.05, 0.57, 1.93)(timeRate);

      const resultState = styleValuesTo.reduce((prev, next, index) => {
        return {
          ...prev,
          [`${styleKeysTo[index]}`]: 1.0 * numberRate * next,
        };
      }, {});

      callback(resultState);
      requestAnimationFrame(run);
    }
  };

  requestAnimationFrame(run);
};

const animate = (ref, to, duration) => {
  return runAnimation(to, duration, (resultState) => {
    if (Array.isArray(ref)) {
      ref.forEach((ele) => {
        ele.style.transform = `translateX(${resultState.translateX}%)`;
        ele.style.opacity = resultState.opacity;
      });
      return;
    }

    ref.style.transform = `translateX(${resultState.translateX}%)`;
    ref.style.opacity = resultState.opacity;
  });
};

const stagger = (refs, to, duration, staggerDelay) => {
  const startTime = performance.now();

  if (!Array.isArray(refs)) return;

  refs.forEach((ref, index) => {
    const applyAnimate = (currentTime) => {
      const elapsedTime = currentTime - startTime;

      if (elapsedTime >= index * staggerDelay) {
        animate(ref, to, duration);
        return;
      } else {
        requestAnimationFrame(applyAnimate);
      }
    };

    requestAnimationFrame(applyAnimate);
  });
};

stagger(
  circle,
  {
    translateX: 500,
    opacity: 1,
  },
  2000,
  1000
);
