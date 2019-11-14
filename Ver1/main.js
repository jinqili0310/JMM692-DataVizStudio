// Initiate scroll page
new fullpage("#fullpage", {
  lockAnchors: false,
  anchors: ["1", "2", "3", "4", "5", "6", "7", "8"],
  navigation: true,
  navigationPosition: "right",
  navigationTooltips: [
    "page #1",
    "page #2",
    "page #3",
    "page #4",
    "page #5",
    "page #6",
    "page #7",
    "page #8"
  ],
  showActiveTooltip: false,
  slidesNavigation: true,
  slidesNavPosition: "bottom",
  sectionsColor: [
    "#000000",
    "#640303",
    "#000000",
    "#baed91",
    "#f2a2e8",
    "#b2cefe",
    "#ffe7d1",
    "#c299fc"
  ]
});

// Show on view
var scroll =
  window.requestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };

var elementsToShow = document.querySelectorAll(".show-on-scroll");

function loop() {
  elementsToShow.forEach(function(element) {
    if (isElementInViewport(element)) {
      element.classList.add("is-visible");
    } else {
      element.classList.remove("is-visible");
    }
  });

  scroll(loop);
}

loop();

// Helper function from: http://stackoverflow.com/a/7557433/274826
function isElementInViewport(el) {
  // special bonus for those using jQuery
  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }
  var rect = el.getBoundingClientRect();
  return (
    (rect.top <= 0 && rect.bottom >= 0) ||
    (rect.bottom >=
      (window.innerHeight || document.documentElement.clientHeight) &&
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight)) ||
    (rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight))
  );
}

const ImageLoop = (() => {
  let s;

  return {
    settings() {
      return {
        image: document.querySelectorAll('.team__img'),
        link: document.querySelectorAll('.team__link'),
        intervalTime: 250
      };
    },

    init() {
      s = this.settings();
      this.bindEvents();
    },

    bindEvents() {
      this.hideImg();
      this.hoverImg();
    },

    hideImg() {
      [].forEach.call(s.image, img => {
        [].forEach.call(img.children, (moreImg, idx) => {
          if (idx !== 0) {
            moreImg.style.display = 'none';
          }
        });
      });
    },

    hoverImg() {
      [].forEach.call(s.link, link => {
        let interval;
        let count = 0;

        link.addEventListener('mouseenter', e => {
          const target = e.target.children[0];
          // Idx 1 because of the span tag/preloader
          const img = target.children[1].children;
          const length = img.length;

          interval = setInterval(() => {
            img[count].style.display = 'none';

            if (count === length - 1) {
              count = 0;
            } else {
              count++;
            }

            img[count].style.display = 'block';
          }, s.intervalTime);
        });

        link.addEventListener('mouseleave', () => {
          clearInterval(interval);
        });
      });
    }
  };
})();

ImageLoop.init();
