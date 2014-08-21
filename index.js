var Twit = require('twit');


function handleError(err, response) {
  if (err || response.statusCode != 200) {
    console.error(err.message);
    console.error('status code was ', response.statusCode);
    process.exit(1);
  }
}

function findShortTweet(tweets) {
  return tweets.filter(function(t) {
    return t.text.length < 100;
  })[0];
}


function generateEmojitionsTweet(tweet) {
  console.log('tweet text is', tweet);
  var text = tweet.text;
  var user = tweet.user.screen_name;

  var res = text.replace(/\bemotion/i, 'emoji');
  return '"' + res + '" -' + '@' + user;
}

function postTweet(tweetText, client) {
  client.post('statuses/update', {status: tweetText}, function(err, data, response) {
    console.log('err is', err, 'data is', data);
  });
}

function createEmojitionsTweet(consumerKey, consumerSecret, accessToken, accessTokenSecret) {
  var client = new Twit({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    access_token: accessToken,
    access_token_secret: accessTokenSecret
  });

  client.get('search/tweets', {q: 'emotions'}, function(err, data, response) {
    handleError(err, response);
    var shortTweet = findShortTweet(data.statuses);
    if (!shortTweet) {
      console.log('no tweets short enough found.');
      return;
    }

    var tweetText = generateEmojitionsTweet(shortTweet);
    postTweet(tweetText, client)
  });
}

module.exports = createEmojitionsTweet;
