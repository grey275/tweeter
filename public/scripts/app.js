/* * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(function() {

  function populateTweet(tweetMarkup, tweetInfo){
    const { user, content, _id, likes } = tweetInfo
    tweetMarkup.attr('id', _id);
    // adding to header
    tweetMarkup.find('.tweet__avatar').attr('src', user.avatars.small);
    tweetMarkup.find('.tweet__name').text(user.name);
    tweetMarkup.find('.tweet__handle').text(user.handle);

    // adding to footer
    tweetMarkup.find('.tweet__text').text(content.text);
    tweetMarkup.find('.tweet__created-at') .text(moment(content.created_at).fromNow());
  }


  function addTweet(parent, tweetInfo) {
    const tweet = $('<article>').addClass('tweet');
    tweet.load('content/tweet-template.html', (template) => {
      populateTweet(tweet, tweetInfo);
      tweet.appendTo(parent);
    });
  }

  // unfortunately I couldn't get this to work sooner enough, so this is dead code for now
  function likeTweet(tweet_id) {
    $.post({
      url: '/tweets/like',
      data: {_id: "5cded97f9aa945112dafb8f9"},
      success: (data) => {
        const tweet = $('#' + tweet_id);
        tweet.addClass('liked');
        $(tweet).children('')
      }
    });
  }

  // dead code, see above
  function handleLike(event) {
    $(this).preventDefault();
    likeTweet(this.attr('id'));
  }

  // simple closure to pass in the container
  const addTweets = (container, tweetsInfo) => {
    for (let tweetInfo of tweetsInfo) {
      addTweet(container, tweetInfo)
    }
    return addTweets;
  }

  function validationError(msg) {
    const errorElement = $('.new-tweet__error');
    errorElement
      .text(msg)
      .slideDown({ duration: 75 })
  }

  function handleSubmit(event) {
    event.preventDefault();
    const textarea = $('.new-tweet__input ');

    // trim to prevent whitespace only tweets
    if (!textarea.val().trim()) {
      validationError('Please tweet something!');
      return;
    }
    if (textarea.val().length > config.MAX_CHARS) {
      validationError('Tweet too long! less is more!');
      return;
    }
    $.post({
      url: '/tweets/new',
      data: $(this).serialize(),
      success: function(data) { loadTweets($('.tweet-container')) },
    });
    textarea.val('');
    $('.new-tweet__counter').text(config.MAX_CHARS);
  }

  function handleComposeClick(event) {
    const button = $('.nav-bar__button');
    if (button.hasClass('active')) {
      button.removeClass('active')
    } else {
      button.addClass('active')
    }
    const newTweet = $('.new-tweet');
    newTweet.slideToggle({ duration: 100, })
    $('.new-tweet__input').focus();
  }

  function populatePage (data, tweetContainer) {
    const reversed = data.reverse()

    addTweets(tweetContainer, reversed);
    tweetContainer.hideLoading();
    $('.tweet').removeClass('hidden');
  }

  function attachHandlers() {
    $('.new-tweet__form').on('submit', handleSubmit);
    $('.nav-bar__button').on('click', handleComposeClick)
  }


  function loadTweets(tweetContainer){
    const tweets = $('.tweet');

    // selector assigning display: none
    tweets.addClass('hidden');

    // shows the loading spinner
    tweetContainer.showLoading()
    tweets.remove();
    $.get({
      url: '/tweets',
      success: data => {
        tweetData = data;
        populatePage(data, tweetContainer);
        attachHandlers();
      },
      error: (err) => alert(`tweets not loading!, ${err}`),
      });
  }

  loadTweets($('.tweet-container'));

});