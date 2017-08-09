import React from 'react';
import io from 'socket.io-client'; // client side of socket
import {blendColors, intToHex} from '../../utils/colorHelpers';
const socket = io('http://localhost:8000'); // make sure it is from where the server is serving
const red = "#f45642";
const green = "#41f44a";

class Meter extends React.Component {
  constructor() {
    super();
    this.state = {
      bInitialTrackersLoaded: false,
      sTracker1: '',
      sTracker2: '',
      sDesiredTracker1: '',
      sDesiredTracker2: '',
      iTracker1Count: 0,
      sTracker1Tweet: '',
      iTracker2Count: 0,
      sTracker2Tweet: '',
      fPercent: 0,
      sMeterColor: green,
      sMarginLeftPercent: '100%'
    }
    this.calculatePercent = this.calculatePercent.bind(this);
    this.tracker1Count = this.tracker1Count.bind(this);
    this.tracker2Count = this.tracker2Count.bind(this);
    this.addPointToChart = this.addPointToChart.bind(this);
    this.newTrackerValues = this.newTrackerValues.bind(this);
    this.setInitialTrackers = this.setInitialTrackers.bind(this);
    this.handleChangeTracker1 = this.handleChangeTracker1.bind(this);
    this.handleChangeTracker2 = this.handleChangeTracker2.bind(this);

    // set the intial trackers --> a ':)' and a ':('
    socket.on('initialTrackers', this.setInitialTrackers)
    // if a :) is found, add to the number
    socket.on('tracker1', this.tracker1Count);
    // if a :( is found, add to the number
    socket.on('tracker2', this.tracker2Count);

  }
  setInitialTrackers(msg) {
    console.log('initializing trackers');
    socket.emit('initializedTrackers'); // tell the server we finally got the initial trackers, this will end the interval on the server
    console.log(msg);
    this.setState({bInitialTrackersLoaded: true, sTracker1: msg.tracker1, sTracker2: msg.tracker2, sDesiredTracker1: msg.tracker1, sDesiredTracker2: msg.tracker2});
    setInterval(this.addPointToChart, 1000); // add a point to the chart every second now that the trackers loaded
  }
  tracker1Count(msg) {
    this.setState({iTracker1Count: this.state.iTracker1Count + 1});
    this.state.sTracker1Tweet = msg;
    this.calculatePercent(this.state.iTracker1Count, this.state.iTracker2Count);
  }
  tracker2Count(msg) {
    this.setState({iTracker2Count: this.state.iTracker2Count + 1});
    this.state.sTracker2Tweet = msg;
    this.calculatePercent(this.state.iTracker1Count, this.state.iTracker2Count);
  }
  addPointToChart() {
    this.props.addPointToChart(this.state.fPercent);
  }
  newTrackerValues() {
    if (this.state.sTracker1 !== '' && this.state.sTracker2 !== '') {
      this.setState({sTracker1: this.state.sDesiredTracker1,
                     sTracker2: this.state.sDesiredTracker2,
                     iTracker1Count: 0,
                     sTracker1Tweet: '',
                     iTracker2Count: 0,
                     sTracker2Tweet: '',
                     fPercent: 0,
                     sMeterColor: green,
                     sMarginLeftPercent: '100%'}); // reset a lot of parts of state
      socket.emit('updateTrackers', {tracker1: this.state.sDesiredTracker1, tracker2: this.state.sDesiredTracker2});
    }
    // TODO: warning popup when values are not filled
  }
  handleChangeTracker1(event) {
    this.setState({sDesiredTracker1: event.target.value});
  }
  handleChangeTracker2(event) {
    this.setState({sDesiredTracker2: event.target.value});
  }
  // TODO: for dynamic socket.io
//   var events = {
//     event1: 'callback1',
//     event2: 'callback2',
//     ...
//     eventN: 'callbackN'
// };
//
// var setCB = function(ev) {
//     var callback = events[ev];
//     socket.on(event, function() {
//         this[callback].apply(this, arguments);
//     });
// };
//
// for (var event in events) {
//   setCB(event);
// }

  calculatePercent(iTracker1Count, iTracker2Count) {
    var fPercent = iTracker1Count / (iTracker1Count + iTracker2Count) * 100.00;
    var sColor = blendColors(red, green, fPercent / 100);
    var sMarginLeftPercent = (50 - Math.round(fPercent)).toString() + "%";
    this.setState({fPercent: Math.round(fPercent), sMeterColor: sColor, sMarginLeftPercent: sMarginLeftPercent});
  }

  render() {
    return (
      <div>
        { this.state.bInitialTrackersLoaded &&
          <div>
            <h2>Tweets Worldwide: '<code>{this.state.sTracker1}</code>' vs. '<code>{this.state.sTracker2}</code>'</h2>
            <div className="wrapper">
                <article className="main" style={{background: this.state.sMeterColor}}>
                  <p><span id="percent">{this.state.fPercent}</span>%</p>
                  <br/>
                  <div style={{marginLeft: this.state.sMarginLeftPercent}}></div>
                </article>
                <aside className="aside aside-1">{this.state.sTracker1}<br/><br/>{this.state.iTracker1Count}</aside>
                <aside className="aside aside-2">{this.state.sTracker2}<br/><br/>{this.state.iTracker2Count}</aside>
            </div>
            <div className="wrapper">
              <article className="main">
                <p>Or, enter your own two words to track!</p>
                <input value={this.state.sDesiredTracker1} onChange={this.handleChangeTracker1}></input>
                <input value={this.state.sDesiredTracker2} onChange={this.handleChangeTracker2}></input>
                <button onClick={this.newTrackerValues}>GO!</button>
              </article>
            </div>
          </div> }
    </div>
    );
  }

}

Meter.defaultProps = {
};

export default Meter;
