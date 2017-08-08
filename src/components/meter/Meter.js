import React from 'react';
import io from 'socket.io-client'; // client side of socket
const socket = io('http://localhost:8000');
let beer = require('../../images/beer.png');
const red = "#f45642";
const green = "#41f44a";

function blend_colors(color1, color2, percentage) {
      // check input
      color1 = color1 || '#000000';
      color2 = color2 || '#ffffff';
      percentage = percentage || 0.5;

      // 1: validate input, make sure we have provided a valid hex
      if (color1.length != 4 && color1.length != 7)
        throw new error('colors must be provided as hexes');

      if (color2.length != 4 && color2.length != 7)
        throw new error('colors must be provided as hexes');

      if (percentage > 1 || percentage < 0)
        throw new error('percentage must be between 0 and 1');

      // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
      //      the three character hex is just a representation of the 6 hex where each character is repeated
      //      ie: #060 => #006600 (green)
      if (color1.length == 4)
        color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
      else
        color1 = color1.substring(1);
      if (color2.length == 4)
        color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
      else
        color2 = color2.substring(1);

      // 3: we have valid input, convert colors to rgb
      color1 = [
        parseInt(color1[0] + color1[1], 16),
        parseInt(color1[2] + color1[3], 16),
        parseInt(color1[4] + color1[5], 16)
      ];
      color2 = [
        parseInt(color2[0] + color2[1], 16),
        parseInt(color2[2] + color2[3], 16),
        parseInt(color2[4] + color2[5], 16)
      ];

      // 4: blend
      var color3 = [
        (1 - percentage) * color1[0] + percentage * color2[0],
        (1 - percentage) * color1[1] + percentage * color2[1],
        (1 - percentage) * color1[2] + percentage * color2[2]
      ];

      // 5: convert to hex
      color3 = '#' + int_to_hex(color3[0]) + int_to_hex(color3[1]) + int_to_hex(color3[2]);

      // return hex
      return color3;
    }

    /*
        convert a Number to a two character hex string
        must round, or we will end up with more digits than expected (2)
        note: can also result in single digit, which will need to be padded with a 0 to the left
        @param: num         => the number to conver to hex
        @returns: string    => the hex representation of the provided number
    */
    function int_to_hex(num) {
      var hex = Math.round(num).toString(16);
      if (hex.length == 1)
        hex = '0' + hex;
      return hex;
    }



class Meter extends React.Component {
  constructor() {
    super();
    this.state = {
      iHappyCount: 0,
      sHappyMsg: 0,
      iSadCount: 0,
      sSadMsg: 0,
      fPercent: 100,
      sMeterColor: green,
      sMarginLeftPercent: '100%'
    }
    this.calculatePercent = this.calculatePercent.bind(this);
    this.happyCount = this.happyCount.bind(this);
    this.sadCount = this.sadCount.bind(this);
    // if a :) is found, add to the number
    socket.on('happy', this.happyCount);
    // if a :( is found, add to the number
    socket.on('sad', this.sadCount);
  }
  happyCount(msg) {
    console.log("in happy");
    this.setState({iHappyCount: this.state.iHappyCount + 1});
    this.state.sHappyMsg = msg;
    this.calculatePercent(this.state.iHappyCount, this.state.iSadCount);
  }
  sadCount(msg) {
    console.log("in sad");
    this.setState({iSadCount: this.state.iSadCount + 1});
    this.state.sSadMsg = msg;
    this.calculatePercent(this.state.iHappyCount, this.state.iSadCount);
  }
  calculatePercent(iHappyCount, iSadCount) {
    var fPercent = iHappyCount / (iHappyCount + iSadCount) * 100.00;
    var sColor = blend_colors(red, green, fPercent / 100);
    var sMarginLeftPercent = (50 - Math.round(fPercent)).toString() + "%";
    this.setState({fPercent: Math.round(fPercent), sMeterColor: sColor, sMarginLeftPercent: 50 - fPercent});
  }

  render() {
    return (
      <div className="wrapper">
          <header className="header">World Happiness Meter</header>
          <h1>Tweets worldwide:</h1>
          <h2>:) vs :(</h2>
          <article className="main" style={{background: this.state.sMeterColor}}>
            <p><span id="percent">{this.state.fPercent}</span>%</p>
            <br/>
            <div style={{marginLeft: this.state.sMarginLeftPercent}}></div>
          </article>
          <aside className="aside aside-1">:)<br/><br/>{this.state.iHappyCount}</aside>
          <aside className="aside aside-2">:(<br/><br/>{this.state.iSadCount}</aside>
          <footer className="footer bigMargins">
            <p>...so, what the heck am I looking at?</p>
            <p>This app uses Twit.js and socket.io to live stream tweets from around the world,<br/> where a ':)' will +1 to the happiness counter and <br/> ':(' will +1 to the sadness counter.</p>
            <p>Hosted on Heroku.</p>
            <p>Yes, the CSS is terrible.</p>
            <p>Cheers. <img src={beer} /></p>
            <br/>
          </footer>
          <aside className="aside aside-1"><br/><br/></aside>
          <aside className="aside aside-2"><br/><br/></aside>
          <footer className="footer">Copyright Chris Frewin 2017</footer>
        </div>
    );
  }
}

Meter.defaultProps = {
};

export default Meter;
