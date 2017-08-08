import React from 'react';

let beer = require('../../images/beer.png');

class MainContent extends React.Component {
  render() {
    return (
      <main className="footer bigMargins">
        <p>...so, what the heck am I looking at?</p>
        <p>This app uses Twit.js and socket.io to live stream tweets from around the world,<br/> where a ':)' will +1 to the happiness counter and <br/> ':(' will +1 to the sadness counter.</p>
        <p>Hosted on Heroku.</p>
        <p>Yes, the CSS is terrible.</p>
        <p>Cheers. <img src={beer} /></p>
        <p>COMING SOON: Add your own two words!</p>
        <br/>
      </main>
    );
  }
}

MainContent.defaultProps = {
};

export default MainContent;
