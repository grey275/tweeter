/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(function() {

  function populateTweet(tweet, tweetInfo){
    const { user, content } = tweetInfo

    // adding to header
    const header = tweet.find('header');
    header.find('.avatar').attr('src', user.avatars.small);
    header.find('.name').text(user.name);
    header.find('.handle').text(user.handle);

    // adding to footer
    const footer = tweet.find('footer');
    footer.find('.text').text(content.text);
    footer.find('.created-at')
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

  function tweetAdderFactory(elm) {
    return (tweetsInfo, status) => {
      if (status !== 'success') {
        alert('failed to get tweets');
        return;
      }
      for (let tweetInfo of tweetsInfo) {
        addTweet(elm, tweetInfo)
      }
    }
  }



  $.get({
    url: '/tweets',
    success: tweetAdderFactory($('.container .tweet-container')),
    error: (err) => alert('tweets not loading!'),
    });
});