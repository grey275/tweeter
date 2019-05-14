const newTweetTextSelector  = '.container .new-tweet form';
const MAX_CHARS = 140;

function countCharsLeft(event) {
  const left = 140 - event.target.value.length;
  const counter = $(this) .children('.counter')
  counter.text(left);
  if (left < 0) {
    counter.addClass('invalid');
  } else {
    counter.removeClass('invalid');
  }
}

$(newTweetTextSelector).on('input', countCharsLeft);

