function countCharsLeft(event) {
  const left = config.MAX_CHARS - event.target.value.length;
  const counter = $(this).find('.new-tweet__counter')
  counter.text(left);
  if (left < 0) {
    counter.addClass('invalid');
  } else {
    counter.removeClass('invalid');
  }
}

$('.new-tweet').on('input', countCharsLeft);

