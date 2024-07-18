import { Component, Fragment } from 'react';
import './style.css';
import axios from 'axios';

const tweetsEndpointURL = "https://app.codescreen.com/api/assessments/tweets";

//Your API token. This is needed to successfully authenticate when calling the tweets endpoint.
//This needs to be added to the Authorization header (using the Bearer authentication scheme) in the request you send to the tweets endpoint.
const apiToken = "8c5996d5-fb89-46c9-8821-7063cfbc18b1"

export default class Tweets extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      tweetsData: [],
      mostPopularHashTag: "N/A",
      mostTweetsInOneDay: 0,
      longestTweetIdPrefix: "N/A",
      mostDaysBetweenTweets: 0,
      loading: false,
    }
  }

  handleUsernameChange = (event) => {
    this.setState({
      username: event.target.value
    });
  }

  handleFormSubmit = async () => {
    this.setState({
      loading: true,
    })
    const { username } = this.state;
    try {
      const result = await axios.get(tweetsEndpointURL, {
        headers: {
          Authorization: `Bearer ${apiToken}`
        },
        params: {
          username: username
        }
      });
      const mostPopularHashTag = this.getMostPopularHashTag(result.data);
      const mostTweetsInOneDay = this.getMostTweetsInOneDay(result.data);
      const longestTweetIdPrefix = this.getLongestTweetIdPrefix(result.data);
      const mostDaysBetweenTweets = this.getMostDaysBetweenTweets(result.data);

      this.setState({
        tweetsData: result.data,
        mostPopularHashTag,
        mostTweetsInOneDay,
        longestTweetIdPrefix,
        mostDaysBetweenTweets,
        loading: false,
      })
    } catch (error) {
      console.error(error);
      this.setState({
        loading: false,
      })
    }
  }

  /**
    * Retrieves the most popular hash tag tweeted by the given user.
    * Note that the string returned by this method should not include the hashtag itself.
    * For example, if the most popular hash tag is "#React", this method should return "React".
    * If there are no tweets for the given user, this method should return "N/A".
  */
  getMostPopularHashTag(tweets) {
    const hashTagMap = {};
      let maxCount = 0;
      let mostPopularHashTag = 'N/A';

      tweets.forEach(tweet => {
          const words = tweet.text.split(' ');
          words.forEach(word => {
              if (word.startsWith('#')) {
                  const hashTag = word.slice(1).toLowerCase();
                  hashTagMap[hashTag] = (hashTagMap[hashTag] || 0) + 1;
                  if (hashTagMap[hashTag] > maxCount) {
                      maxCount = hashTagMap[hashTag];
                      mostPopularHashTag = hashTag;
                  }
              }
          });
      });

      return mostPopularHashTag;
  }

  /**
    * Retrieves the highest number of tweets that were created on any given day by the given user.
    * A day's time period here is defined from 00:00:00 to 23:59:59
    * If there are no tweets for the given user, this method should return 0.
  */
  getMostTweetsInOneDay(tweets) {
      const dateTweetCountMap = {};
      let maxCount = 0;

      tweets.forEach(tweet => {
          const date = new Date(tweet.createdAt);
          const dateString = date.toISOString().split('T')[0];
          dateTweetCountMap[dateString] = (dateTweetCountMap[dateString] || 0) + 1;
          if (dateTweetCountMap[dateString] > maxCount) {
              maxCount = dateTweetCountMap[dateString];
          }
      });

      return maxCount || 0;
  }

  /**
    * Finds the first 6 characters of the ID of the longest tweet for the given user.
    * For example, if the ID of the longest tweet is "0b88c8e3-5ade-48a3-a5a0-8ce356c02d2a",
    * then this function should return "0b88c8".
    * You can assume there will only be one tweet that is the longest.
    * If there are no tweets for the given user, this method should return "N/A".
  */
  getLongestTweetIdPrefix(tweets) {
      let maxTextLength = 0;
      let idOfMaxTextLengthTweet = null;

      tweets.forEach(tweet => {
          const textLength = tweet.text.length;
          if (textLength > maxTextLength) {
              maxTextLength = textLength;
              idOfMaxTextLengthTweet = tweet.id;
          }
      });

      if (idOfMaxTextLengthTweet) {
          return idOfMaxTextLengthTweet.slice(0, 6);
      } else {
          return 'N/A';
      }
  }

  /**
    * Retrieves the most number of days between tweets by the given user.
    * This should always be rounded down to the complete number of days, i.e. if the time is 12 days & 3 hours, this
    * method should return 12.
    * If there are no tweets for the given user, this method should return 0.
  */
  getMostDaysBetweenTweets(tweets) {
      if (tweets.length === 0) {
          return 0;
      }

      // Sort tweets by createdAt in ascending order
      tweets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      let maxDaysBetweenTweets = 0;

      for (let i = 0; i < tweets.length - 1; i++) {
          const currentDate = new Date(tweets[i].createdAt);
          const nextDate = new Date(tweets[i + 1].createdAt);

          // Calculate the difference in days
          const diffInTime = nextDate.getTime() - currentDate.getTime();
          const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

          if (diffInDays > maxDaysBetweenTweets) {
              maxDaysBetweenTweets = diffInDays;
          }
      }

      return maxDaysBetweenTweets;
  }



  render() {
    const {
      username,
      mostPopularHashTag,
      mostTweetsInOneDay,
      longestTweetIdPrefix,
      mostDaysBetweenTweets,
      loading,
    } = this.state;
    return (
        <Fragment>
          <input
              onChange={this.handleUsernameChange}
              placeholder="Enter user name"
              className="username-input-box"
              value={username}
          />
          <button
            onClick={this.handleFormSubmit}
            className="submit-button"
          >
            {loading ? (
              <span className="loader"/>
            ) : (
              <span className="submit-button-text">
                Submit
              </span>
            )}
          </button>
          {loading ? (
            <div className="stats-loader-container">
              <div className="loader loader_stats"/>
            </div>
          ) : (
            <div className="grid-container">
              <div className="tweets-data-container">
                <div
                  className="stats-box"
                >
                  <span className="stats-box-heading">
                    Most Popular hashtag:
                  </span>
                  <span
                    data-testid="most-popular-hashtag"
                    className="stats-box-info"
                  >
                    {mostPopularHashTag}
                  </span>
                </div>
              </div>
              <div className="tweets-data-container">
                <div
                  className="stats-box"
                >
                  <span className="stats-box-heading">
                    Most Tweets In One Day:
                  </span>
                  <span
                    className="stats-box-info"
                    data-testid="most-tweets-in-one-day"
                  >
                    {mostTweetsInOneDay}
                  </span>
                </div>
              </div>
              <div className="tweets-data-container">
                <div
                  className="stats-box"
                >
                  <span className="stats-box-heading">
                    Longest Tweet ID:
                  </span>
                  <span
                    className="stats-box-info"
                    data-testid="highest-tweet-id-prefix"
                  >
                    {longestTweetIdPrefix}
                  </span>
                </div>
              </div>
              <div className="tweets-data-container">
                <div
                  className="stats-box"
                >
                  <span className="stats-box-heading">
                    Most days between tweets:
                  </span>
                  <span
                    className="stats-box-info"
                    data-testid="most-days-between-tweets"
                  >
                    {mostDaysBetweenTweets}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Fragment>
    )
  }
}
