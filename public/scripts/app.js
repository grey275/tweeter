/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(function() {

  function populateTweet(tweet, tweetInfo){
    const { user, content } = tweetInfo

    // adding to header
    tweet.find('.tweet__avatar').attr('src', user.avatars.small);
    tweet.find('.tweet__name').text(user.name);
    tweet.find('.tweet__handle').text(user.handle);

    // adding to footer
    tweet.find('.tweet__text').text(content.text);
    tweet.find('.tweet__created-at')
      .text(moment(content.created_at).fromNow()
    );
  }


  function addTweet(parent, tweetInfo) {
    const tweet = $('<article>').addClass('tweet');
    tweet.load('content/tweet-template.html', (template) => {
      populateTweet(tweet, tweetInfo);
      tweet.appendTo(parent);
    });
  }

  function addTweetsFactory(elm) {
    const addTweets = (tweetsInfo) => {
      for (let tweetInfo of tweetsInfo) {
        addTweet(elm, tweetInfo)
      }
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
    if (!textarea.val().trim()) {
      validationError('Please tweet something!');
      return;
    }
    if (textarea.val().length > config.MAX_CHARS) {
      validationError('Tweet too long! less is more!');
      return;
    }
    $.post({
      url: '/tweets',
      data: $(this).serialize(),
      success: function(data) { loadTweets($('.tweet-container')) },
    });
    textarea.val('');
    $('.new-tweet__counter').text('140');
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
    addTweetsFactory(tweetContainer)(reversed);
    tweetContainer.hideLoading();
    $('.tweet').removeClass('hidden');
  }

  function attachHandlers() {
    $('.new-tweet__form').on('submit', handleSubmit);
    $('.nav-bar__button').on('click', handleComposeClick)
  }


  function loadTweets(tweetContainer){
    const tweets = $('.tweet');
    tweets.addClass('hidden');
    tweetContainer.showLoading()
    $.get({
      url: '/tweets',
      success: data => { console.log('loaded'); populatePage(data, tweetContainer); },
      error: (err) => alert(`tweets not loading!, ${err}`),
      });
  }

  attachHandlers();

  loadTweets($('.tweet-container'));

});