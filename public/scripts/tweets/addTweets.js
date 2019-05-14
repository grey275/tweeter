// initial-tweets.json for tweetInfo examples

function populateTweet(tweet, tweetInfo){
  const { user, content } = tweetInfo

  // adding to header
  const header = tweet.find('header');
  header.find('.avatar').attr('src', user.avatars.small);
  header.find('.name').text(user.name);
  header.find('.handle').text(user.handle);

  // adding to footer
  tweet.find('footer .text').text(content.text)
}


function addTweet(parent, tweetInfo) {
  const tweet = $('<article>').addClass('tweet');
  tweet.load('scripts/tweets/tweet.html', (template) => {
    populateTweet(tweet, tweetInfo);
    tweet.appendTo(parent);
  });
}

function addTweets(data, status) {
  if (status !== 'success') {
    console.log('failed to get tweets');
    return;
  }
  for (let tweetInfo of data) {
    addTweet()
  }
}

function tweetAdderFactory(elm) {
  return (tweetsInfo, status) => {
    if (status !== 'success') {
      console.log('failed to get tweets');
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

})
