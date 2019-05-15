const newTweetTextSelector  = '.container .new-tweet form';

function countCharsLeft(event) {
  const left = config.MAX_CHARS - event.target.value.length;
  const counter = $(this) .children('.counter')
  counter.text(left);
  if (left < 0) {
    counter.addClass('invalid');
  } else {
    counter.removeClass('invalid');
  }
}

$(newTweetTextSelector).on('input', countCharsLeft);

