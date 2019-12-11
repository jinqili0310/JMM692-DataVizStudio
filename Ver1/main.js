// Initiate scroll page
new fullpage("#fullpage", {
  lockAnchors: false,
  anchors: ["1", "2", "3", "4", "5", "6", "7", "8"],
  navigation: true,
  navigationPosition: "right",
  navigationTooltips: [
    "Title",
    "Intro",
    "Characters",
    "Timeline",
    "Movies",
    "Google",
    "Twitter"
  ],
  showActiveTooltip: false,
  slidesNavigation: true,
  slidesNavPosition: "bottom",
  sectionsColor: [
    "#a87272",
    "#000000",
    "#000000",
    "#000000",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff"
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

(function() {

  // VARIABLES
  const timeline = document.querySelector(".timeline ol"),
    elH = document.querySelectorAll(".timeline li > div"),
    arrows = document.querySelectorAll(".timeline .arrows .arrow"),
    arrowPrev = document.querySelector(".timeline .arrows .arrow__prev"),
    arrowNext = document.querySelector(".timeline .arrows .arrow__next"),
    firstItem = document.querySelector(".timeline li:first-child"),
    lastItem = document.querySelector(".timeline li:last-child"),
    xScrolling = 280,
    disabledClass = "disabled";

  // START
  window.addEventListener("load", init);

  function init() {
    setEqualHeights(elH);
    animateTl(xScrolling, arrows, timeline);
    setSwipeFn(timeline, arrowPrev, arrowNext);
    setKeyboardFn(arrowPrev, arrowNext);
  }

  // SET EQUAL HEIGHTS
  function setEqualHeights(el) {
    let counter = 0;
    for (let i = 0; i < el.length; i++) {
      const singleHeight = el[i].offsetHeight;

      if (counter < singleHeight) {
        counter = singleHeight;
      }
    }

    for (let i = 0; i < el.length; i++) {
      el[i].style.height = `${counter}px`;
    }
  }

  // CHECK IF AN ELEMENT IS IN VIEWPORT
  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // SET STATE OF PREV/NEXT ARROWS
  function setBtnState(el, flag = true) {
    if (flag) {
      el.classList.add(disabledClass);
    } else {
      if (el.classList.contains(disabledClass)) {
        el.classList.remove(disabledClass);
      }
      el.disabled = false;
    }
  }

  // ANIMATE TIMELINE
  function animateTl(scrolling, el, tl) {
    let counter = 0;
    for (let i = 0; i < el.length; i++) {
      el[i].addEventListener("click", function() {
        if (!arrowPrev.disabled) {
          arrowPrev.disabled = true;
        }
        if (!arrowNext.disabled) {
          arrowNext.disabled = true;
        }
        const sign = (this.classList.contains("arrow__prev")) ? "" : "-";
        if (counter === 0) {
          tl.style.transform = `translateX(-${scrolling}px)`;
        } else {
          const tlStyle = getComputedStyle(tl);
          // add more browser prefixes if needed here
          const tlTransform = tlStyle.getPropertyValue("-webkit-transform") || tlStyle.getPropertyValue("transform");
          const values = parseInt(tlTransform.split(",")[4]) + parseInt(`${sign}${scrolling}`);
          tl.style.transform = `translateX(${values}px)`;
        }

        setTimeout(() => {
          isElementInViewport(firstItem) ? setBtnState(arrowPrev) : setBtnState(arrowPrev, false);
          isElementInViewport(lastItem) ? setBtnState(arrowNext) : setBtnState(arrowNext, false);
        }, 1100);

        counter++;
      });
    }
  }

  // ADD SWIPE SUPPORT FOR TOUCH DEVICES
  function setSwipeFn(tl, prev, next) {
    const hammer = new Hammer(tl);
    hammer.on("swipeleft", () => next.click());
    hammer.on("swiperight", () => prev.click());
  }

  // ADD BASIC KEYBOARD FUNCTIONALITY
  function setKeyboardFn(prev, next) {
    document.addEventListener("keydown", (e) => {
      if ((e.which === 37) || (e.which === 39)) {
        const timelineOfTop = timeline.offsetTop;
        const y = window.pageYOffset;
        if (timelineOfTop !== y) {
          window.scrollTo(0, timelineOfTop);
        }
        if (e.which === 37) {
          prev.click();
        } else if (e.which === 39) {
          next.click();
        }
      }
    });
  }

})();


// CHART 1

var margin = {
    top: 50,
    right: 10,
    bottom: 120,
    left: 130
  },
  width = (3/5)*(window.innerWidth)  - margin.left - margin.right,
  height = window.innerHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#chart1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

var xLabel = svg.append("text")
  .attr("y", height + 50)
  .attr("x", width / 2)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Median Score on Rotten Tomatoes (%)");

var yLabel = svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -110)
  .attr("x", -400)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Box Office in Total ($)");

  var yLabel = svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -110)
    .attr("x", -210)
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .text("(Adjusted for Inflaction in 2019)");

//Read the data
d3.json("../Data/Chart1.json").then(function(data) {
  console.log(data);

  // Add X axis
  var x = d3.scaleLinear()
    .domain([80, 100])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([2000000000, 16000000000])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add the tooltip container to the vis container
  // it's invisible and its position/contents are defined during mouseover
  var tooltip = d3.select("#chart1").append("div")
    .attr("class", "tooltip")
    .style("background", "white")
    .style("padding", "4px")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("border-color", "#888")
    .style("opacity", 0);

  // tooltip mouseover event handler
  var tipMouseover = function(d) {
    var color = colorScale(d.character);
    var html = "<span style='color:" + color + ";'> <b>" + d.character + "</span><br/> </b>" +
      "Median Score on Rotten Tomatoes: " + "<b>" +d.rottenTomatoes + "% </b>" +"<br/>" +
      "Box Office in Total: <b>$" + d.boxOffice + "</b> </span>";

    tooltip.html(html)
      .style("left", (d3.event.pageX + 15) + "px")
      .style("top", (d3.event.pageY - 28) + "px")
      .transition()
      .duration(200) // ms
      .style("opacity", 0.95); // started as 0!

  };
  // tooltip mouseout event handler
  var tipMouseout = function(d) {
    tooltip.transition()
      .duration(300) // ms
      .style("opacity", 0); // don't care about position!
  };

var colorScale = d3.scaleOrdinal(d3.schemePaired);

var node = svg.selectAll("g.node")
    .data(data, function(d) { return d.character; });

var nodeEnter = node.enter()
    .append("g")
    .attr("class", "node");

var defs = nodeEnter.append("defs");

defs.append('pattern')
  .attr("id", function(d) {
    return "image"+ d.id;
  })
  .attr("width", 60)
  .attr("height", 60)
  .append("image")
  .attr("xlink:href", function(d) {
    return d.image_url;
  })
  .attr("width", 60)
  .attr("height", 60);

  nodeEnter.append("circle")
      .attr("cx", function(d) {
        return x(d.rottenTomatoes);
      })
      .attr("cy", function(d) {
        return y(d.boxOffice);
      })
      .style("stroke", function(d) {
        return colorScale(d.character);
      })
      .style("stroke-width", 5)
      .attr("fill",function(d) {
        return "url(#image"+ d.id +")";
      })
      .attr("r", 30)
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout);

  return svg.node();

});


// CHART 2

var locale = d3.timeFormatLocale({
  "dateTime": "%a %e %b %Y %X",
  "date": "%Y-%m",
  "time": "%Hh%M",
  "periods": ["am", "pm"],
  "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

var timeFormat = function(date) {
  return (
    d3.timeYear(date) < date ? locale.format("Search Interest on Google <br> in %b, %Y") :
    d3.timeFormat("%Y")
  )(date);
};

var data2 = [{
    "date": new Date('2004-01'),
    "Iron Man": 2,
    "Hulk": 10,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2004-02'),
    "Iron Man": 2,
    "Hulk": 9,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2004-03'),
    "Iron Man": 2,
    "Hulk": 8,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2004-04'),
    "Iron Man": 2,
    "Hulk": 8,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2004-05'),
    "Iron Man": 3,
    "Hulk": 8,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2004-06'),
    "Iron Man": 2,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 8,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2004-07'),
    "Iron Man": 3,
    "Hulk": 8,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 19,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2004-08'),
    "Iron Man": 2,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2004-09'),
    "Iron Man": 2,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2004-10'),
    "Iron Man": 3,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2004-11'),
    "Iron Man": 2,
    "Hulk": 6,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2004-12'),
    "Iron Man": 2,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2005-01'),
    "Iron Man": 2,
    "Hulk": 6,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2005-02'),
    "Iron Man": 2,
    "Hulk": 6,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2005-03'),
    "Iron Man": 2,
    "Hulk": 6,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2005-04'),
    "Iron Man": 2,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2005-05'),
    "Iron Man": 3,
    "Hulk": 6,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2005-06'),
    "Iron Man": 3,
    "Hulk": 6,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2005-07'),
    "Iron Man": 3,
    "Hulk": 9,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2005-08'),
    "Iron Man": 3,
    "Hulk": 10,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2005-09'),
    "Iron Man": 2,
    "Hulk": 10,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2005-10'),
    "Iron Man": 3,
    "Hulk": 8,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2005-11'),
    "Iron Man": 2,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2005-12'),
    "Iron Man": 2,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2006-01'),
    "Iron Man": 2,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2006-02'),
    "Iron Man": 2,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2006-03'),
    "Iron Man": 2,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2006-04'),
    "Iron Man": 2,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2006-05'),
    "Iron Man": 3,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2006-06'),
    "Iron Man": 3,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2006-07'),
    "Iron Man": 4,
    "Hulk": 8,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 6,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2006-08'),
    "Iron Man": 3,
    "Hulk": 8,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2006-09'),
    "Iron Man": 3,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2006-10'),
    "Iron Man": 4,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2006-11'),
    "Iron Man": 3,
    "Hulk": 6,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2006-12'),
    "Iron Man": 3,
    "Hulk": 6,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2007-01'),
    "Iron Man": 5,
    "Hulk": 6,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2007-02'),
    "Iron Man": 3,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2007-03'),
    "Iron Man": 3,
    "Hulk": 6,
    "Thor": 5,
    "Captain America": 4,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2007-04'),
    "Iron Man": 4,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 10,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2007-05'),
    "Iron Man": 4,
    "Hulk": 7,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 21,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2007-06'),
    "Iron Man": 4,
    "Hulk": 8,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2007-07'),
    "Iron Man": 6,
    "Hulk": 8,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2007-08'),
    "Iron Man": 6,
    "Hulk": 11,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 1,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2007-09'),
    "Iron Man": 10,
    "Hulk": 8,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2007-10'),
    "Iron Man": 6,
    "Hulk": 8,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2007-11'),
    "Iron Man": 5,
    "Hulk": 11,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2007-12'),
    "Iron Man": 6,
    "Hulk": 10,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2008-01'),
    "Iron Man": 6,
    "Hulk": 9,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2008-02'),
    "Iron Man": 8,
    "Hulk": 8,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2008-03'),
    "Iron Man": 10,
    "Hulk": 18,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2008-04'),
    "Iron Man": 24,
    "Hulk": 12,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2008-05'),
    "Iron Man": 77,
    "Hulk": 20,
    "Thor": 6,
    "Captain America": 2,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2008-06'),
    "Iron Man": 25,
    "Hulk": 57,
    "Thor": 6,
    "Captain America": 3,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2008-07'),
    "Iron Man": 15,
    "Hulk": 27,
    "Thor": 5,
    "Captain America": 2,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2008-08'),
    "Iron Man": 12,
    "Hulk": 16,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2008-09'),
    "Iron Man": 15,
    "Hulk": 15,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2008-10'),
    "Iron Man": 18,
    "Hulk": 18,
    "Thor": 6,
    "Captain America": 2,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2008-11'),
    "Iron Man": 13,
    "Hulk": 15,
    "Thor": 5,
    "Captain America": 2,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2008-12'),
    "Iron Man": 11,
    "Hulk": 14,
    "Thor": 6,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2009-01'),
    "Iron Man": 9,
    "Hulk": 13,
    "Thor": 6,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2009-02'),
    "Iron Man": 8,
    "Hulk": 12,
    "Thor": 6,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2009-03'),
    "Iron Man": 8,
    "Hulk": 11,
    "Thor": 6,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2009-04'),
    "Iron Man": 8,
    "Hulk": 12,
    "Thor": 6,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2009-05'),
    "Iron Man": 9,
    "Hulk": 12,
    "Thor": 6,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2009-06'),
    "Iron Man": 9,
    "Hulk": 11,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2009-07'),
    "Iron Man": 12,
    "Hulk": 11,
    "Thor": 6,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 0,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2009-08'),
    "Iron Man": 11,
    "Hulk": 12,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2009-09'),
    "Iron Man": 9,
    "Hulk": 11,
    "Thor": 6,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2009-10'),
    "Iron Man": 8,
    "Hulk": 11,
    "Thor": 6,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 3,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2009-11'),
    "Iron Man": 8,
    "Hulk": 11,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2009-12'),
    "Iron Man": 19,
    "Hulk": 11,
    "Thor": 5,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 0,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2010-01'),
    "Iron Man": 13,
    "Hulk": 12,
    "Thor": 6,
    "Captain America": 1,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2010-02'),
    "Iron Man": 12,
    "Hulk": 12,
    "Thor": 5,
    "Captain America": 2,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2010-03'),
    "Iron Man": 17,
    "Hulk": 10,
    "Thor": 5,
    "Captain America": 2,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2010-04'),
    "Iron Man": 38,
    "Hulk": 10,
    "Thor": 6,
    "Captain America": 2,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2010-05'),
    "Iron Man": 83,
    "Hulk": 11,
    "Thor": 11,
    "Captain America": 3,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2010-06'),
    "Iron Man": 26,
    "Hulk": 10,
    "Thor": 7,
    "Captain America": 2,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 0,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2010-07'),
    "Iron Man": 20,
    "Hulk": 11,
    "Thor": 11,
    "Captain America": 3,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2010-08'),
    "Iron Man": 18,
    "Hulk": 11,
    "Thor": 9,
    "Captain America": 2,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2010-09'),
    "Iron Man": 21,
    "Hulk": 10,
    "Thor": 7,
    "Captain America": 2,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2010-10'),
    "Iron Man": 20,
    "Hulk": 10,
    "Thor": 7,
    "Captain America": 3,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2010-11'),
    "Iron Man": 13,
    "Hulk": 10,
    "Thor": 6,
    "Captain America": 3,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2010-12'),
    "Iron Man": 12,
    "Hulk": 11,
    "Thor": 10,
    "Captain America": 2,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2011-01'),
    "Iron Man": 13,
    "Hulk": 11,
    "Thor": 8,
    "Captain America": 3,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2011-02'),
    "Iron Man": 10,
    "Hulk": 10,
    "Thor": 10,
    "Captain America": 6,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2011-03'),
    "Iron Man": 9,
    "Hulk": 10,
    "Thor": 9,
    "Captain America": 4,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2011-04'),
    "Iron Man": 10,
    "Hulk": 11,
    "Thor": 32,
    "Captain America": 4,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2011-05'),
    "Iron Man": 10,
    "Hulk": 13,
    "Thor": 67,
    "Captain America": 4,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2011-06'),
    "Iron Man": 9,
    "Hulk": 12,
    "Thor": 22,
    "Captain America": 6,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2011-07'),
    "Iron Man": 12,
    "Hulk": 12,
    "Thor": 20,
    "Captain America": 28,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 6,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2011-08'),
    "Iron Man": 11,
    "Hulk": 12,
    "Thor": 20,
    "Captain America": 19,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2011-09'),
    "Iron Man": 9,
    "Hulk": 11,
    "Thor": 21,
    "Captain America": 9,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2011-10'),
    "Iron Man": 10,
    "Hulk": 12,
    "Thor": 16,
    "Captain America": 13,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2011-11'),
    "Iron Man": 9,
    "Hulk": 11,
    "Thor": 11,
    "Captain America": 8,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2011-12'),
    "Iron Man": 9,
    "Hulk": 13,
    "Thor": 10,
    "Captain America": 6,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2012-01'),
    "Iron Man": 8,
    "Hulk": 13,
    "Thor": 10,
    "Captain America": 5,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2012-02'),
    "Iron Man": 8,
    "Hulk": 13,
    "Thor": 8,
    "Captain America": 4,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2012-03'),
    "Iron Man": 9,
    "Hulk": 16,
    "Thor": 11,
    "Captain America": 4,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 4,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2012-04'),
    "Iron Man": 14,
    "Hulk": 20,
    "Thor": 14,
    "Captain America": 6,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2012-05'),
    "Iron Man": 27,
    "Hulk": 35,
    "Thor": 27,
    "Captain America": 13,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2012-06'),
    "Iron Man": 17,
    "Hulk": 25,
    "Thor": 18,
    "Captain America": 7,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 12,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2012-07'),
    "Iron Man": 18,
    "Hulk": 21,
    "Thor": 13,
    "Captain America": 6,
    "Star Lord": 0,
    "Ant-Man": 1,
    "Doctor Strange": 0,
    "Spider-Man": 30,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2012-08'),
    "Iron Man": 15,
    "Hulk": 19,
    "Thor": 12,
    "Captain America": 6,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 11,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2012-09'),
    "Iron Man": 15,
    "Hulk": 20,
    "Thor": 13,
    "Captain America": 6,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 9,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2012-10'),
    "Iron Man": 27,
    "Hulk": 32,
    "Thor": 12,
    "Captain America": 6,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 9,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2012-11'),
    "Iron Man": 18,
    "Hulk": 16,
    "Thor": 10,
    "Captain America": 4,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 10,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2012-12'),
    "Iron Man": 18,
    "Hulk": 16,
    "Thor": 10,
    "Captain America": 4,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 9,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2013-01'),
    "Iron Man": 17,
    "Hulk": 15,
    "Thor": 10,
    "Captain America": 4,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2013-02'),
    "Iron Man": 21,
    "Hulk": 14,
    "Thor": 10,
    "Captain America": 4,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2013-03'),
    "Iron Man": 25,
    "Hulk": 15,
    "Thor": 9,
    "Captain America": 3,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2013-04'),
    "Iron Man": 64,
    "Hulk": 14,
    "Thor": 15,
    "Captain America": 4,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2013-05'),
    "Iron Man": 100,
    "Hulk": 16,
    "Thor": 13,
    "Captain America": 5,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2013-06'),
    "Iron Man": 39,
    "Hulk": 19,
    "Thor": 11,
    "Captain America": 5,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2013-07'),
    "Iron Man": 29,
    "Hulk": 20,
    "Thor": 12,
    "Captain America": 5,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 8,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2013-08'),
    "Iron Man": 30,
    "Hulk": 17,
    "Thor": 15,
    "Captain America": 4,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2013-09'),
    "Iron Man": 26,
    "Hulk": 14,
    "Thor": 14,
    "Captain America": 4,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2013-10'),
    "Iron Man": 20,
    "Hulk": 14,
    "Thor": 24,
    "Captain America": 7,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2013-11'),
    "Iron Man": 17,
    "Hulk": 15,
    "Thor": 70,
    "Captain America": 6,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 6,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2013-12'),
    "Iron Man": 18,
    "Hulk": 15,
    "Thor": 32,
    "Captain America": 5,
    "Star Lord": 0,
    "Ant-Man": 1,
    "Doctor Strange": 0,
    "Spider-Man": 8,
    "Black Panther": 1,
    "Captain Marvel": 0
  },
  {
    "date": new Date('2014-01'),
    "Iron Man": 17,
    "Hulk": 14,
    "Thor": 25,
    "Captain America": 5,
    "Star Lord": 0,
    "Ant-Man": 1,
    "Doctor Strange": 0,
    "Spider-Man": 6,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2014-02'),
    "Iron Man": 16,
    "Hulk": 15,
    "Thor": 31,
    "Captain America": 8,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2014-03'),
    "Iron Man": 15,
    "Hulk": 16,
    "Thor": 23,
    "Captain America": 17,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 8,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2014-04'),
    "Iron Man": 17,
    "Hulk": 18,
    "Thor": 19,
    "Captain America": 47,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 21,
    "Black Panther": 1,
    "Captain Marvel": 2
  },
  {
    "date": new Date('2014-05'),
    "Iron Man": 16,
    "Hulk": 16,
    "Thor": 14,
    "Captain America": 17,
    "Star Lord": 0,
    "Ant-Man": 1,
    "Doctor Strange": 0,
    "Spider-Man": 35,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2014-06'),
    "Iron Man": 13,
    "Hulk": 29,
    "Thor": 14,
    "Captain America": 11,
    "Star Lord": 0,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 13,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2014-07'),
    "Iron Man": 14,
    "Hulk": 24,
    "Thor": 16,
    "Captain America": 13,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 0,
    "Spider-Man": 12,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2014-08'),
    "Iron Man": 14,
    "Hulk": 19,
    "Thor": 14,
    "Captain America": 17,
    "Star Lord": 3,
    "Ant-Man": 1,
    "Doctor Strange": 0,
    "Spider-Man": 15,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2014-09'),
    "Iron Man": 12,
    "Hulk": 14,
    "Thor": 12,
    "Captain America": 12,
    "Star Lord": 1,
    "Ant-Man": 0,
    "Doctor Strange": 0,
    "Spider-Man": 11,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2014-10'),
    "Iron Man": 14,
    "Hulk": 15,
    "Thor": 15,
    "Captain America": 10,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 1,
    "Spider-Man": 9,
    "Black Panther": 1,
    "Captain Marvel": 2
  },
  {
    "date": new Date('2014-11'),
    "Iron Man": 12,
    "Hulk": 14,
    "Thor": 12,
    "Captain America": 8,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2014-12'),
    "Iron Man": 12,
    "Hulk": 14,
    "Thor": 12,
    "Captain America": 7,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 0,
    "Spider-Man": 8,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2015-01'),
    "Iron Man": 13,
    "Hulk": 15,
    "Thor": 12,
    "Captain America": 9,
    "Star Lord": 1,
    "Ant-Man": 3,
    "Doctor Strange": 0,
    "Spider-Man": 8,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2015-02'),
    "Iron Man": 12,
    "Hulk": 15,
    "Thor": 11,
    "Captain America": 8,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 0,
    "Spider-Man": 8,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2015-03'),
    "Iron Man": 13,
    "Hulk": 17,
    "Thor": 11,
    "Captain America": 7,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2015-04'),
    "Iron Man": 18,
    "Hulk": 19,
    "Thor": 14,
    "Captain America": 10,
    "Star Lord": 1,
    "Ant-Man": 2,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2015-05'),
    "Iron Man": 23,
    "Hulk": 24,
    "Thor": 18,
    "Captain America": 15,
    "Star Lord": 1,
    "Ant-Man": 2,
    "Doctor Strange": 1,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 2
  },
  {
    "date": new Date('2015-06'),
    "Iron Man": 15,
    "Hulk": 18,
    "Thor": 12,
    "Captain America": 9,
    "Star Lord": 1,
    "Ant-Man": 3,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2015-07'),
    "Iron Man": 14,
    "Hulk": 26,
    "Thor": 12,
    "Captain America": 10,
    "Star Lord": 1,
    "Ant-Man": 22,
    "Doctor Strange": 0,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2015-08'),
    "Iron Man": 14,
    "Hulk": 18,
    "Thor": 11,
    "Captain America": 11,
    "Star Lord": 1,
    "Ant-Man": 11,
    "Doctor Strange": 1,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 2
  },
  {
    "date": new Date('2015-09'),
    "Iron Man": 14,
    "Hulk": 17,
    "Thor": 11,
    "Captain America": 9,
    "Star Lord": 1,
    "Ant-Man": 5,
    "Doctor Strange": 0,
    "Spider-Man": 6,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2015-10'),
    "Iron Man": 13,
    "Hulk": 16,
    "Thor": 12,
    "Captain America": 9,
    "Star Lord": 1,
    "Ant-Man": 4,
    "Doctor Strange": 0,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2015-11'),
    "Iron Man": 12,
    "Hulk": 15,
    "Thor": 11,
    "Captain America": 12,
    "Star Lord": 1,
    "Ant-Man": 7,
    "Doctor Strange": 1,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2015-12'),
    "Iron Man": 12,
    "Hulk": 15,
    "Thor": 11,
    "Captain America": 11,
    "Star Lord": 1,
    "Ant-Man": 7,
    "Doctor Strange": 1,
    "Spider-Man": 6,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2016-01'),
    "Iron Man": 12,
    "Hulk": 15,
    "Thor": 11,
    "Captain America": 10,
    "Star Lord": 1,
    "Ant-Man": 3,
    "Doctor Strange": 1,
    "Spider-Man": 6,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2016-02'),
    "Iron Man": 12,
    "Hulk": 15,
    "Thor": 11,
    "Captain America": 12,
    "Star Lord": 1,
    "Ant-Man": 3,
    "Doctor Strange": 1,
    "Spider-Man": 6,
    "Black Panther": 3,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2016-03'),
    "Iron Man": 13,
    "Hulk": 25,
    "Thor": 11,
    "Captain America": 22,
    "Star Lord": 0,
    "Ant-Man": 3,
    "Doctor Strange": 1,
    "Spider-Man": 7,
    "Black Panther": 2,
    "Captain Marvel": 2
  },
  {
    "date": new Date('2016-04'),
    "Iron Man": 16,
    "Hulk": 15,
    "Thor": 12,
    "Captain America": 35,
    "Star Lord": 1,
    "Ant-Man": 3,
    "Doctor Strange": 3,
    "Spider-Man": 7,
    "Black Panther": 3,
    "Captain Marvel": 2
  },
  {
    "date": new Date('2016-05'),
    "Iron Man": 20,
    "Hulk": 16,
    "Thor": 15,
    "Captain America": 73,
    "Star Lord": 1,
    "Ant-Man": 4,
    "Doctor Strange": 1,
    "Spider-Man": 8,
    "Black Panther": 5,
    "Captain Marvel": 3
  },
  {
    "date": new Date('2016-06'),
    "Iron Man": 14,
    "Hulk": 16,
    "Thor": 11,
    "Captain America": 19,
    "Star Lord": 0,
    "Ant-Man": 2,
    "Doctor Strange": 1,
    "Spider-Man": 7,
    "Black Panther": 2,
    "Captain Marvel": 2
  },
  {
    "date": new Date('2016-07'),
    "Iron Man": 12,
    "Hulk": 15,
    "Thor": 12,
    "Captain America": 12,
    "Star Lord": 0,
    "Ant-Man": 2,
    "Doctor Strange": 1,
    "Spider-Man": 7,
    "Black Panther": 2,
    "Captain Marvel": 2
  },
  {
    "date": new Date('2016-08'),
    "Iron Man": 10,
    "Hulk": 12,
    "Thor": 11,
    "Captain America": 11,
    "Star Lord": 0,
    "Ant-Man": 1,
    "Doctor Strange": 1,
    "Spider-Man": 6,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2016-09'),
    "Iron Man": 10,
    "Hulk": 12,
    "Thor": 10,
    "Captain America": 13,
    "Star Lord": 0,
    "Ant-Man": 1,
    "Doctor Strange": 2,
    "Spider-Man": 5,
    "Black Panther": 2,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2016-10'),
    "Iron Man": 10,
    "Hulk": 13,
    "Thor": 10,
    "Captain America": 9,
    "Star Lord": 0,
    "Ant-Man": 1,
    "Doctor Strange": 9,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2016-11'),
    "Iron Man": 9,
    "Hulk": 13,
    "Thor": 11,
    "Captain America": 8,
    "Star Lord": 0,
    "Ant-Man": 1,
    "Doctor Strange": 24,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2016-12'),
    "Iron Man": 10,
    "Hulk": 13,
    "Thor": 10,
    "Captain America": 8,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 8,
    "Spider-Man": 7,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2017-01'),
    "Iron Man": 9,
    "Hulk": 12,
    "Thor": 10,
    "Captain America": 8,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 5,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2017-02'),
    "Iron Man": 9,
    "Hulk": 11,
    "Thor": 11,
    "Captain America": 6,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 6,
    "Spider-Man": 5,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2017-03'),
    "Iron Man": 9,
    "Hulk": 11,
    "Thor": 12,
    "Captain America": 6,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 4,
    "Spider-Man": 6,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2017-04'),
    "Iron Man": 9,
    "Hulk": 12,
    "Thor": 20,
    "Captain America": 6,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 2,
    "Spider-Man": 6,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2017-05'),
    "Iron Man": 9,
    "Hulk": 11,
    "Thor": 12,
    "Captain America": 7,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 2,
    "Spider-Man": 6,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2017-06'),
    "Iron Man": 10,
    "Hulk": 11,
    "Thor": 12,
    "Captain America": 7,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 2,
    "Spider-Man": 10,
    "Black Panther": 4,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2017-07'),
    "Iron Man": 12,
    "Hulk": 12,
    "Thor": 17,
    "Captain America": 8,
    "Star Lord": 1,
    "Ant-Man": 2,
    "Doctor Strange": 2,
    "Spider-Man": 28,
    "Black Panther": 2,
    "Captain Marvel": 2
  },
  {
    "date": new Date('2017-08'),
    "Iron Man": 9,
    "Hulk": 11,
    "Thor": 14,
    "Captain America": 6,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 1,
    "Spider-Man": 10,
    "Black Panther": 2,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2017-09'),
    "Iron Man": 8,
    "Hulk": 10,
    "Thor": 14,
    "Captain America": 5,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 1,
    "Spider-Man": 8,
    "Black Panther": 1,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2017-10'),
    "Iron Man": 9,
    "Hulk": 11,
    "Thor": 39,
    "Captain America": 5,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 1,
    "Spider-Man": 9,
    "Black Panther": 3,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2017-11'),
    "Iron Man": 9,
    "Hulk": 12,
    "Thor": 84,
    "Captain America": 6,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 2,
    "Spider-Man": 7,
    "Black Panther": 3,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2017-12'),
    "Iron Man": 10,
    "Hulk": 12,
    "Thor": 36,
    "Captain America": 7,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 2,
    "Spider-Man": 7,
    "Black Panther": 3,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2018-01'),
    "Iron Man": 8,
    "Hulk": 10,
    "Thor": 33,
    "Captain America": 5,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 1,
    "Spider-Man": 5,
    "Black Panther": 10,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2018-02'),
    "Iron Man": 10,
    "Hulk": 11,
    "Thor": 32,
    "Captain America": 7,
    "Star Lord": 1,
    "Ant-Man": 2,
    "Doctor Strange": 2,
    "Spider-Man": 6,
    "Black Panther": 100,
    "Captain Marvel": 1
  },
  {
    "date": new Date('2018-03'),
    "Iron Man": 11,
    "Hulk": 12,
    "Thor": 30,
    "Captain America": 8,
    "Star Lord": 1,
    "Ant-Man": 2,
    "Doctor Strange": 2,
    "Spider-Man": 6,
    "Black Panther": 47,
    "Captain Marvel": 2
  },
  {
    "date": new Date('2018-04'),
    "Iron Man": 14,
    "Hulk": 14,
    "Thor": 28,
    "Captain America": 11,
    "Star Lord": 1,
    "Ant-Man": 3,
    "Doctor Strange": 3,
    "Spider-Man": 7,
    "Black Panther": 26,
    "Captain Marvel": 15
  },
  {
    "date": new Date('2018-05'),
    "Iron Man": 19,
    "Hulk": 17,
    "Thor": 37,
    "Captain America": 14,
    "Star Lord": 2,
    "Ant-Man": 5,
    "Doctor Strange": 5,
    "Spider-Man": 9,
    "Black Panther": 30,
    "Captain Marvel": 19
  },
  {
    "date": new Date('2018-06'),
    "Iron Man": 12,
    "Hulk": 13,
    "Thor": 24,
    "Captain America": 7,
    "Star Lord": 1,
    "Ant-Man": 5,
    "Doctor Strange": 2,
    "Spider-Man": 7,
    "Black Panther": 11,
    "Captain Marvel": 4
  },
  {
    "date": new Date('2018-07'),
    "Iron Man": 11,
    "Hulk": 12,
    "Thor": 19,
    "Captain America": 6,
    "Star Lord": 1,
    "Ant-Man": 22,
    "Doctor Strange": 2,
    "Spider-Man": 7,
    "Black Panther": 7,
    "Captain Marvel": 4
  },
  {
    "date": new Date('2018-08'),
    "Iron Man": 11,
    "Hulk": 12,
    "Thor": 19,
    "Captain America": 7,
    "Star Lord": 1,
    "Ant-Man": 8,
    "Doctor Strange": 2,
    "Spider-Man": 8,
    "Black Panther": 6,
    "Captain Marvel": 6
  },
  {
    "date": new Date('2018-09'),
    "Iron Man": 11,
    "Hulk": 11,
    "Thor": 17,
    "Captain America": 6,
    "Star Lord": 1,
    "Ant-Man": 5,
    "Doctor Strange": 1,
    "Spider-Man": 21,
    "Black Panther": 7,
    "Captain Marvel": 12
  },
  {
    "date": new Date('2018-10'),
    "Iron Man": 10,
    "Hulk": 11,
    "Thor": 15,
    "Captain America": 6,
    "Star Lord": 1,
    "Ant-Man": 6,
    "Doctor Strange": 1,
    "Spider-Man": 12,
    "Black Panther": 6,
    "Captain Marvel": 3
  },
  {
    "date": new Date('2018-11'),
    "Iron Man": 9,
    "Hulk": 11,
    "Thor": 14,
    "Captain America": 5,
    "Star Lord": 1,
    "Ant-Man": 3,
    "Doctor Strange": 1,
    "Spider-Man": 10,
    "Black Panther": 5,
    "Captain Marvel": 3
  },
  {
    "date": new Date('2018-12'),
    "Iron Man": 10,
    "Hulk": 11,
    "Thor": 16,
    "Captain America": 6,
    "Star Lord": 1,
    "Ant-Man": 4,
    "Doctor Strange": 1,
    "Spider-Man": 18,
    "Black Panther": 5,
    "Captain Marvel": 9
  },
  {
    "date": new Date('2019-01'),
    "Iron Man": 9,
    "Hulk": 11,
    "Thor": 16,
    "Captain America": 5,
    "Star Lord": 1,
    "Ant-Man": 3,
    "Doctor Strange": 1,
    "Spider-Man": 16,
    "Black Panther": 6,
    "Captain Marvel": 8
  },
  {
    "date": new Date('2019-02'),
    "Iron Man": 8,
    "Hulk": 11,
    "Thor": 13,
    "Captain America": 5,
    "Star Lord": 0,
    "Ant-Man": 3,
    "Doctor Strange": 1,
    "Spider-Man": 9,
    "Black Panther": 7,
    "Captain Marvel": 15
  },
  {
    "date": new Date('2019-03'),
    "Iron Man": 11,
    "Hulk": 12,
    "Thor": 17,
    "Captain America": 8,
    "Star Lord": 1,
    "Ant-Man": 3,
    "Doctor Strange": 1,
    "Spider-Man": 10,
    "Black Panther": 6,
    "Captain Marvel": 85
  },
  {
    "date": new Date('2019-04'),
    "Iron Man": 26,
    "Hulk": 17,
    "Thor": 30,
    "Captain America": 17,
    "Star Lord": 1,
    "Ant-Man": 5,
    "Doctor Strange": 2,
    "Spider-Man": 10,
    "Black Panther": 6,
    "Captain Marvel": 39
  },
  {
    "date": new Date('2019-05'),
    "Iron Man": 31,
    "Hulk": 17,
    "Thor": 36,
    "Captain America": 20,
    "Star Lord": 1,
    "Ant-Man": 4,
    "Doctor Strange": 3,
    "Spider-Man": 15,
    "Black Panther": 6,
    "Captain Marvel": 22
  },
  {
    "date": new Date('2019-06'),
    "Iron Man": 15,
    "Hulk": 12,
    "Thor": 19,
    "Captain America": 8,
    "Star Lord": 1,
    "Ant-Man": 2,
    "Doctor Strange": 1,
    "Spider-Man": 18,
    "Black Panther": 4,
    "Captain Marvel": 12
  },
  {
    "date": new Date('2019-07'),
    "Iron Man": 15,
    "Hulk": 11,
    "Thor": 20,
    "Captain America": 8,
    "Star Lord": 1,
    "Ant-Man": 2,
    "Doctor Strange": 2,
    "Spider-Man": 38,
    "Black Panther": 3,
    "Captain Marvel": 7
  },
  {
    "date": new Date('2019-08'),
    "Iron Man": 13,
    "Hulk": 12,
    "Thor": 17,
    "Captain America": 8,
    "Star Lord": 1,
    "Ant-Man": 2,
    "Doctor Strange": 1,
    "Spider-Man": 17,
    "Black Panther": 3,
    "Captain Marvel": 5
  },
  {
    "date": new Date('2019-09'),
    "Iron Man": 12,
    "Hulk": 10,
    "Thor": 14,
    "Captain America": 6,
    "Star Lord": 1,
    "Ant-Man": 1,
    "Doctor Strange": 1,
    "Spider-Man": 13,
    "Black Panther": 3,
    "Captain Marvel": 4
  }
];

var chart2 = d3_timeseries()
  .addSerie(data2, {
    x: 'date',
    y: 'Iron Man'
  }, {
    interpolate: 'step-before'
  })
  .addSerie(null, {
    x: 'date',
    y: 'Hulk'
  }, {
    interpolate: 'linear'
  })
  .addSerie(null, {
    x: 'date',
    y: 'Thor'
  }, {
    interpolate: 'linear'
  })
  .addSerie(null, {
    x: 'date',
    y: 'Captain America'
  }, {
    interpolate: 'linear'
  })
  .addSerie(null, {
    x: 'date',
    y: 'Star Lord'
  }, {
    interpolate: 'linear'
  })
  .addSerie(null, {
    x: 'date',
    y: 'Ant-Man'
  }, {
    interpolate: 'linear'
  })
  .addSerie(null, {
    x: 'date',
    y: 'Doctor Strange'
  }, {
    interpolate: 'linear'
  })
  .addSerie(null, {
    x: 'date',
    y: 'Spider-Man'
  }, {
    interpolate: 'linear'
  })
  .addSerie(null, {
    x: 'date',
    y: 'Black Panther'
  }, {
    interpolate: 'linear'
  })
  .addSerie(null, {
    x: 'date',
    y: 'Captain Marvel'
  }, {
    interpolate: 'linear'
  })
  .xscale.tickFormat(timeFormat)
  .margin.top(100)
  .margin.left(28)
  .margin.right(15)
  .width((3/5)*(window.innerWidth))
  .height(window.innerHeight);


chart2('#chart2');

// CHARACTER INTRO
// $(document).ready(function() {
  $(".im").on("click", function() {
     $(".introContainer").remove();
    $(".charIntro").append("<div id='IMintro' class='container introContainer'><div class='gifContainer'><img class='charGif' src='../Assets/IM.gif'></div><div class='row'><div class='col-sm-2 name'>Iron Man</div><div class='col-sm-4 paragraph my-auto'>Inventor Tony Stark applies his genius for high-tech solutions to problems as Iron Man, the armored Avenger.</div><div class='col-sm-2 years indchart'><h5 style='float: center; color: white;font-weight: bold;'>Participated</h5><h6 style='float: center; margin-left: 4vw; color: white;'>2008</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2010</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2012</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2013</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2015</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2016</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2017</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2018</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2019</h6></div><div class='col-sm-4 movies indchart'><h5 style='float: left; color: white; font-weight: bold;'>Movies &nbsp;&nbsp;&nbsp; in &nbsp;&nbsp;&nbsp; MCU &nbsp;&nbsp;&nbsp; Each &nbsp;&nbsp;&nbsp; Year</h5><h6 style='background: #af7aa1; float: left; margin-right: 1vw; color: white;'>Iron Man</h6><h6 style='background: #edc949; float: left; margin-right: 4vw; color: white;'>The Incredible Hulk</h6><h6 style='background: #af7aa1; float: left; margin-right: 12vw; color: white;'>Iron Man 2</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Marvel's The Avengers</h6><h6 style='background: #af7aa1; float: left; margin-right: 12vw; color: white;'>Iron Man 3</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Avengers: Age of Ultron</h6><h6 style='background: #4e79a7; float: left; margin-right: 1vw; color: white;'>Captain America: Civil War</h6><h6 style='background: #59a14f; float: left; margin-right: 2vw; color: white;'>Spider-Man: Homecoming</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Avengers: Infinity War</h6><h6 style='background: #f28e2c; float: left; margin-right: 1vw; color: white;'>Avengers: Endgame</h6></div></div></div>");
  });
  $(".hk").on("click", function() {
     $(".introContainer").remove();
    $(".charIntro").append("<div id='HKintro' class='container introContainer'><div class='gifContainer'><img class='charGif' src='../Assets/HK.gif'></div><div class='row'><div class='col-sm-2 name'>Hulk</div><div class='col-sm-4 paragraph my-auto'>Exposed to heavy doses of gamma radiation, scientist Bruce Banner transforms into the mean, green rage machine called the Hulk.</div><div class='col-sm-2 years indchart'><h5 style='float: center; color: white;font-weight: bold;'>Participated</h5><h6 style='float: center; margin-left: 4vw; color: white;'>2008</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2012</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2013</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2015</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2017</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2018</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2019</h6></div><div class='col-sm-4 movies indchart'><h5 style='float: left; color: white; font-weight: bold;'>Movies &nbsp;&nbsp;&nbsp; in &nbsp;&nbsp;&nbsp; MCU &nbsp;&nbsp;&nbsp; Each &nbsp;&nbsp;&nbsp; Year</h5><h6 style='background: #edc949; float: left; margin-right: 4vw; color: white;'>The Incredible Hulk</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Marvel's The Avengers</h6><h6 style='background: #af7aa1; float: left; margin-right: 12vw; color: white;'>Iron Man 3</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Avengers: Age of Ultron</h6><h6 style='background: #e15759; float: left; margin-right: 4vw; color: white;'>Thor: Ragnarok</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Avengers: Infinity War</h6><h6 style='background: #f28e2c; float: left; margin-right: 1vw; color: white;'>Avengers: Endgame</h6></div></div></div>");
  });

  $(".ca").on("click", function() {
     $(".introContainer").remove();
    $(".charIntro").append("<div id='CAintro' class='container introContainer'><div class='gifContainer'><img class='charGif' src='../Assets/CA1.gif'></div><div class='row'><div class='col-sm-2 name'>Captain America</div><div class='col-sm-4 paragraph my-auto'>America’s World War II Super-Soldier continues his fight in the present as an Avenger and untiring sentinel of liberty.</div><div class='col-sm-2 years indchart'><h5 style='float: center; color: white;font-weight: bold;'>Participated</h5><h6 style='float: center; margin-left: 4vw; color: white;'>2011</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2012</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2014</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2015</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2016</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2017</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2018</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2019</h6></div><div class='col-sm-4 movies indchart'><h5 style='float: left; color: white; font-weight: bold;'>Movies &nbsp;&nbsp;&nbsp; in &nbsp;&nbsp;&nbsp; MCU &nbsp;&nbsp;&nbsp; Each &nbsp;&nbsp;&nbsp; Year</h5><h6 style='background: #4e79a7; float: left; margin-right: 1vw; color: white;'>Captain America: The First Avenger</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Marvel's The Avengers</h6><h6 style='background: #4e79a7; float: left; margin-right: 1vw; color: white;'>Captain America: The Winter Soldier</h6><h6 style='background: #f28e2c; float: left; margin-right: 1vw; color: white;'>Avengers: Age of Ultron</h6><h6 style='background: #76b7b2; float: left; margin-right: 1vw; color: white;'>Ant-Man</h6><h6 style='background: #4e79a7; float: left; margin-right: 1vw; color: white;'>Captain America: Civil War</h6><h6 style='background: #59a14f; float: left; margin-right: 1vw; color: white;'>Spider-Man: Homecoming</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Avengers: Infinity War</h6><h6 style='background: #f28e2c; float: left; margin-right: 1vw; color: white;'>Avengers: Endgame</h6></div></div></div>");
});

$(".am").on("click", function() {
   $(".introContainer").remove();
  $(".charIntro").append("<div id='AMintro' class='container introContainer'><div class='gifContainer'><img class='charGif' src='../Assets/AM.gif'></div><div class='row'><div class='col-sm-2 name'>Ant-Man</div><div class='col-sm-4 paragraph my-auto'>Ex-con Scott Lang uses high-tech equipment to shrink down to insect-size and fight injustice as Ant-Man.</div><div class='col-sm-2 years indchart'><h5 style='float: center; color: white;font-weight: bold;'>Participated</h5><h6 style='float: center; margin-left: 4vw; color: white;'>2008</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2010</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2012</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2013</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2015</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2017</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2018</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2019</h6></div><div class='col-sm-4 movies indchart'><h5 style='float: left; color: white; font-weight: bold;'>Movies &nbsp;&nbsp;&nbsp; in &nbsp;&nbsp;&nbsp; MCU &nbsp;&nbsp;&nbsp; Each &nbsp;&nbsp;&nbsp; Year</h5><h6 style='background: #af7aa1; float: left; margin-right: 14vw; color: white;'>Iron Man</h6><h6 style='background: #af7aa1; float: left; margin-right: 12vw; color: white;'>Iron Man 2</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Marvel's The Avengers</h6><h6 style='background: #af7aa1; float: left; margin-right: 12vw; color: white;'>Iron Man 3</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Avengers: Age of Ultron</h6><h6 style='background: #59a14f; float: left; margin-right: 2vw; color: white;'>Spider-Man: Homecoming</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Avengers: Infinity War</h6><h6 style='background: #f28e2c; float: left; margin-right: 1vw; color: white;'>Avengers: Endgame</h6><h6 style='background: #59a14f; float: left; margin-right: 1vw; color: white;'>Spider-Man: Far From Home</h6></div></div></div>");
});

$(".tr").on("click", function() {
   $(".introContainer").remove();
  $(".charIntro").append("<div id='TRintro' class='container introContainer'><div class='gifContainer'><img class='charGif' src='../Assets/TR.gif'></div><div class='row'><div class='col-sm-2 name'>Thor</div><div class='col-sm-4 paragraph my-auto'>Thor Odinson wields the power of the ancient Asgardians to fight evil throughout the Nine Realms and beyond.</div><div class='col-sm-2 years indchart'><h5 style='float: center; color: white;font-weight: bold;'>Participated</h5><h6 style='float: center; margin-left: 4vw; color: white;'>2011</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2012</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2013</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2015</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2016</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2017</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2018</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2019</h6></div><div class='col-sm-4 movies indchart'><h5 style='float: left; color: white; font-weight: bold;'>Movies &nbsp;&nbsp;&nbsp; in &nbsp;&nbsp;&nbsp; MCU &nbsp;&nbsp;&nbsp; Each &nbsp;&nbsp;&nbsp; Year</h5><h6 style='background: #e15759; float: left; margin-right: 14vw; color: white;'>Thor</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Marvel's The Avengers</h6><h6 style='background: #e15759; float: left; margin-right: 4vw; color: white;'>Thor: The Dark World</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Avengers: Age of Ultron</h6><h6 style='background: #ff9da7; float: left; margin-right: 8vw; color: white;'>Doctor Strange</h6><h6 style='background: #e15759; float: left; margin-right: 4vw; color: white;'>Thor: Ragnarok</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Avengers: Infinity War</h6><h6 style='background: #f28e2c; float: left; margin-right: 1vw; color: white;'>Avengers: Endgame</h6></div></div></div>");
});

$(".sl").on("click", function() {
   $(".introContainer").remove();
    $(".charIntro").append("<div id='SLintro' class='container introContainer'><div class='gifContainer'><img class='charGif' src='../Assets/SL.gif'></div><div class='row'><div class='col-sm-2 name'>Star-Lord</div><div class='col-sm-4 paragraph my-auto'>Would-be thief Peter Quill journeys through space as Star-Lord, the leader of the Guardians of the Galaxy.</div><div class='col-sm-2 years indchart'><h5 style='float: center; color: white;font-weight: bold;'>Participated</h5><h6 style='float: center; margin-left: 4vw; color: white;'>2014</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2017</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2018</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2019</h6></div><div class='col-sm-4 movies indchart'><h5 style='float: left; color: white; font-weight: bold;'>Movies &nbsp;&nbsp;&nbsp; in &nbsp;&nbsp;&nbsp; MCU &nbsp;&nbsp;&nbsp; Each &nbsp;&nbsp;&nbsp; Year</h5><h6 style='background: #9c755f; float: left; margin-right: 4vw; color: white;'>Guardians of the Galaxy</h6><h6 style='background: #9c755f; float: left; margin-right: 4vw; color: white;'>Guardians of the Galaxy Vol. 2</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Avengers: Infinity War</h6><h6 style='background: #f28e2c; float: left; margin-right: 1vw; color: white;'>Avengers: Endgame</h6></div></div></div>");
});

$(".ds").on("click", function() {
   $(".introContainer").remove();
    $(".charIntro").append("<div id='DSintro' class='container introContainer'><div class='gifContainer'><img class='charGif' src='../Assets/DS.gif'></div><div class='row'><div class='col-sm-2 name'>Doctor Strange</div><div class='col-sm-4 paragraph my-auto'>Once a highly successful, yet notably egotistical, surgeon, Doctor Stephen Strange endured a terrible accident that led him to evolve in ways he could have never foreseen.</div><div class='col-sm-2 years indchart'><h5 style='float: center; color: white;font-weight: bold;'>Participated</h5><h6 style='float: center; margin-left: 4vw; color: white;'>2016</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2017</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2018</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2019</h6></div><div class='col-sm-4 movies indchart'><h5 style='float: left; color: white; font-weight: bold;'>Movies &nbsp;&nbsp;&nbsp; in &nbsp;&nbsp;&nbsp; MCU &nbsp;&nbsp;&nbsp; Each &nbsp;&nbsp;&nbsp; Year</h5><h6 style='background: #ff9da7; float: left; margin-right: 8vw; color: white;'>Doctor Strange</h6><h6 style='background: #e15759; float: left; margin-right: 4vw; color: white;'>Thor: Ragnarok</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Avengers: Infinity War</h6><h6 style='background: #f28e2c; float: left; margin-right: 1vw; color: white;'>Avengers: Endgame</h6></div></div></div>");
});

$(".sm").on("click", function() {
   $(".introContainer").remove();
    $(".charIntro").append("<div id='SMintro' class='container introContainer'><div class='gifContainer'><img class='charGif' src='../Assets/SM.gif'></div><div class='row'><div class='col-sm-2 name'>Spider-Man</div><div class='col-sm-4 paragraph my-auto'>With amazing spider-like abilities, teenage science whiz Peter Parker fights crime and dreams of becoming an Avenger as Spider-Man.</div><div class='col-sm-2 years indchart'><h5 style='float: center; color: white;font-weight: bold;'>Participated</h5><h6 style='float: center; margin-left: 4vw; color: white;'>2016</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2017</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2018</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2019</h6></div><div class='col-sm-4 movies indchart'><h5 style='float: left; color: white; font-weight: bold;'>Movies &nbsp;&nbsp;&nbsp; in &nbsp;&nbsp;&nbsp; MCU &nbsp;&nbsp;&nbsp; Each &nbsp;&nbsp;&nbsp; Year</h5><h6 style='background: #4e79a7; float: left; margin-right: 1vw; color: white;'>Captain America: Civil War</h6><h6 style='background: #59a14f; float: left; margin-right: 2vw; color: white;'>Spider-Man: Homecoming</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Avengers: Infinity War</h6><h6 style='background: #f28e2c; float: left; margin-right: 1vw; color: white;'>Avengers: Endgame</h6><h6 style='background: #59a14f; float: left; margin-right: 1vw; color: white;'>Spider-Man: Far From Home</h6></div></div></div>");
});

$(".bp").on("click", function() {
   $(".introContainer").remove();
    $(".charIntro").append("<div id='BPintro' class='container introContainer'><div class='gifContainer'><img class='charGif' src='../Assets/BP.gif'></div><div class='row'><div class='col-sm-2 name'>Black Panther</div><div class='col-sm-4 paragraph my-auto'>As the king of the African nation of Wakanda, T’Challa protects his people as the latest in a legacy line of Black Panther warriors.</div><div class='col-sm-2 years indchart'><h5 style='float: center; color: white;font-weight: bold;'>Participated</h5><h6 style='float: center; margin-left: 4vw; color: white;'>2016</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2018</h6><h6 style='float: center; margin-left: 4vw; color: white;'>2019</h6></div><div class='col-sm-4 movies indchart'><h5 style='float: left; color: white; font-weight: bold;'>Movies &nbsp;&nbsp;&nbsp; in &nbsp;&nbsp;&nbsp; MCU &nbsp;&nbsp;&nbsp; Each &nbsp;&nbsp;&nbsp; Year</h5><h6 style='background: #4e79a7; float: left; margin-right: 8vw; color: white;'>Captain America: Civil War</h6><h6 style='background: #bab0ab; float: left; margin-right: 1vw; color: white;'>Black Panther</h6><h6 style='background: #f28e2c; float: left; margin-right: 4vw; color: white;'>Avengers: Infinity War</h6><h6 style='background: #f28e2c; float: left; margin-right: 1vw; color: white;'>Avengers: Endgame</h6></div></div></div>");
});

$(".cm").on("click", function() {
   $(".introContainer").remove();
    $(".charIntro").append("<div id='CMintro' class='container introContainer'><div class='gifContainer'><img class='charGif' src='../Assets/CM.gif'></div><div class='row'><div class='col-sm-2 name'>Captain Marvel</div><div class='col-sm-4 paragraph my-auto'>Near death, Carol Danvers was transformed into a powerful warrior for the Kree. Now, returning to Earth years later, she must remember her past in order to to prevent a full invasion by shapeshifting aliens, the Skrulls.</div><div class='col-sm-2 years indchart'><h5 style='float: center; color: white;font-weight: bold;'>Participated</h5><h6 style='float: center; margin-left: 4vw; color: white;'>2019</h6></div><div class='col-sm-4 movies indchart'><h5 style='float: left; color: white; font-weight: bold;'>Movies &nbsp;&nbsp;&nbsp; in &nbsp;&nbsp;&nbsp; MCU &nbsp;&nbsp;&nbsp; Each &nbsp;&nbsp;&nbsp; Year</h5><h6 style='background: #e78ac3; float: left; margin-right: 1vw; color: white;'>Captain Marvel</h6><h6 style='background: #f28e2c; float: left; margin-right: 1vw; color: white;'>Avengers: Endgame</h6></div></div></div>");
});
