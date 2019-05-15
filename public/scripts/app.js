/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

 // global data container to be populated later
 let tweetData;

$(function() {

  function populateTweet(tweet, tweetInfo){
    const { user, content } = tweetInfo

    // adding to header
    tweet.find('.tweet__avatar').attr('src', user.avatars.small);
    tweet.find('.tweet__name').text(user.name);
    tweet.find('.handle').text(user.handle);

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

  function handleSubmit(event) {
    event.preventDefault();
    const textarea = $('.new-tweet__input ');
    console.log('text: ', textarea);
    if (!textarea.val()) {
      alert('please tweet something!');
      return;
    }
    if (textarea.val().length > config.MAX_CHARS) {
      alert('tweet too long! less is more!');
      return;
    }
    $.post('/tweets', $(this).serialize());
    textarea.val('');
    loadTweets();
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

  function populatePage (data) {
    tweetData = data;
    const tweetContainer = $('.tweet-container');
    addTweetsFactory(tweetContainer)(tweetData);
  }

  function attachHandlers() {
    $('#new-tweet__form').on('submit', handleSubmit);
    $('.nav-bar__button').on('click', handleComposeClick)
  }

  function loadTweets(){
    $.get({
      url: '/tweets',
      success: data => populatePage(data),
      error: (err) => alert(`tweets not loading!, ${err}`),
      });
  }

  attachHandlers();

  loadTweets();

});