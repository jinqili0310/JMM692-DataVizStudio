// Initiate scroll page
new fullpage("#fullpage", {
  lockAnchors: false,
  anchors: ["firstPage", "secondPage"],
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
    "page #8",
    "page #9"
  ],
  showActiveTooltip: false,
  slidesNavigation: true,
  slidesNavPosition: "bottom",
  sectionsColor: [
    "#fea3aa",
    "#f8b88b",
    "#faf884",
    "#baed91",
    "#f2a2e8",
    "#b2cefe",
    "#ffe7d1",
    "#c299fc",
    "#8186d5"
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
