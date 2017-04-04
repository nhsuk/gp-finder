jQuery(function($) {

  // Debug flag
  var debugMode = false;

  // Default time delay before checking location
  var callBackTime = 100;

  // # px before tracking a reader
  var readerLocation = 150;

  // Set some flags for tracking & execution
  var timer = 0;
  var scroller = false;
  var endQuarter = false;
  var endHalf = false;
  var endThreeQuarter = false;
  var didComplete = false;

  // Set some time variables to calculate reading time
  var startTime = new Date();
  var beginning = startTime.getTime();
  var totalTime = 0;

  // Get some information about the current page
  var pageTitle = document.title;

  // Track the aticle load
  if (!debugMode) {
      //ga('send', 'event', 'Reading', 'ArticleLoaded', '');

  } else {
      console.log('Start custom analytics');
  }

  $('.results__item a').each(function(){
    $(this).on('click',function(event){
      if(!scroller) {
        currentTime = new Date();
        clickTime = currentTime.getTime();
        timeToClick = Math.round((clickTime - beginning) / 1000);
        if (!debugMode) {
            ga('send', 'event', '(Results: ' + results + ') User clicked item before the fold', timeToClick+'s');
        } else {
            event.preventDefault();
            alert('User clicked item before the fold (Time: ' + timeToClick + 's)');
        }
      }
    })
  })

  // Check the location and track user
  function trackLocation() {
      bottom = $(window).height() + $(window).scrollTop();
      height = $(document).height();
      results = $('.reading-width .sr-only').attr('data-results');
      results_14 = Math.round(results / 4);
      results_12 = Math.round(results / 2);
      results_34 = Math.round(results_14 * 3);


      // If user starts to scroll send an event
      if (bottom > readerLocation && !scroller) {
          currentTime = new Date();
          scrollStart = currentTime.getTime();
          timeToScroll = Math.round((scrollStart - beginning) / 1000);
          if (!debugMode) {
              console.log('started reading ' + timeToScroll);
              ga('send', 'event', 'User started scrolling', timeToScroll+'s');
          } else {
              alert('User started scrolling (Time: ' + timeToScroll + 's)');
          }
          scroller = true;
      }

      if (bottom > $('.results__item').eq(results_14).offset().top + $('.results__item').eq(results_14).outerHeight() && !endQuarter) {
          currentTime = new Date();
          quarterScrollEnd = currentTime.getTime();
          timeToQuarterEnd = Math.round((quarterScrollEnd - scrollStart) / 1000);
          if (!debugMode) {
              ga('send', 'event', '(Results: ' + results + ') User reached quater of the results', timeToQuarterEnd+'s');
          } else {
              alert('User reached quater of the results (Time: ' + timeToQuarterEnd + 's)');
          }
          endQuarter = true;
      }

      if (bottom > $('.results__item').eq(results_12).offset().top + $('.results__item').eq(results_12).outerHeight() && !endHalf) {
          currentTime = new Date();
          halfScrollEnd = currentTime.getTime();
          timeToHalfEnd = Math.round((halfScrollEnd - scrollStart) / 1000);
          if (!debugMode) {
              ga('send', 'event', '(Results: ' + results + ') User reached half of the results', timeToHalfEnd);
          } else {
              alert('User reached half of the results (Time: ' + timeToHalfEnd + 's)');
          }
          endHalf = true;
      }

      if (bottom > $('.results__item').eq(results_34).offset().top + $('.results__item').eq(results_34).outerHeight() && !endThreeQuarter) {
          currentTime = new Date();
          threeQuarterScrollEnd = currentTime.getTime();
          timeToThreeQuarterEnd = Math.round((threeQuarterScrollEnd - scrollStart) / 1000);
          if (!debugMode) {
              ga('send', 'event', '(Results: ' + results + ') User reached three quaters of the results', timeToThreeQuarterEnd);
          } else {
              alert('User reached three quaters of the results (Time: ' + timeToThreeQuarterEnd + 's)');
          }
          endThreeQuarter = true;
      }

      // If user has hit the bottom of page send an event
      if (bottom > $('footer ul.link-list').offset().top + $('footer ul.link-list').outerHeight() && !didComplete) {
          currentTime = new Date();
          end = currentTime.getTime();
          totalTime = Math.round((end - scrollStart) / 1000);
          if (!debugMode) {
              if (totalTime < 20) {
                  _gaq.push(['_setCustomVar', 5, 'ReaderType', 'Scanner', 2]);
              } else {
                  _gaq.push(['_setCustomVar', 5, 'ReaderType', 'Reader', 2]);
              }
              ga('send', 'event', '(Results: ' + results + ') User reached the end of the page', totalTime+'s');
          } else {
              alert('User reached the end of the page (Time: ' + totalTime + 's)');
          }
          didComplete = true;
      }
  }

  // Track the scrolling and track location
  $(window).scroll(function() {
      if (timer) {
          clearTimeout(timer);
      }

      // Use a buffer so we don't call trackLocation too often.
      timer = setTimeout(trackLocation, callBackTime);
  });

});
