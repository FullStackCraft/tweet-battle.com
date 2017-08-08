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
    this.addPointToChart = this.addPointToChart.bind(this);
    // if a :) is found, add to the number
    socket.on('happy', this.happyCount);
    // if a :( is found, add to the number
    socket.on('sad', this.sadCount);

    setInterval(this.addPointToChart, 1000); // add a point to the chart every second

  }
  happyCount(msg) {
    this.setState({iHappyCount: this.state.iHappyCount + 1});
    this.state.sHappyMsg = msg;
    this.calculatePercent(this.state.iHappyCount, this.state.iSadCount);
  }
  sadCount(msg) {
    this.setState({iSadCount: this.state.iSadCount + 1});
    this.state.sSadMsg = msg;
    this.calculatePercent(this.state.iHappyCount, this.state.iSadCount);
  }
  addPointToChart() {
    this.props.addPointToChart(this.state.fPercent);
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

  calculatePercent(iHappyCount, iSadCount) {
    var fPercent = iHappyCount / (iHappyCount + iSadCount) * 100.00;
    var sColor = blendColors(red, green, fPercent / 100);
    var sMarginLeftPercent = (50 - Math.round(fPercent)).toString() + "%";
    this.setState({fPercent: Math.round(fPercent), sMeterColor: sColor, sMarginLeftPercent: sMarginLeftPercent});
  }

  render() {
    return (
      <div className="wrapper">
          <article className="main" style={{background: this.state.sMeterColor}}>
            <p><span id="percent">{this.state.fPercent}</span>%</p>
            <br/>
            <div style={{marginLeft: this.state.sMarginLeftPercent}}></div>
          </article>
          <aside className="aside aside-1">:)<br/><br/>{this.state.iHappyCount}</aside>
          <aside className="aside aside-2">:(<br/><br/>{this.state.iSadCount}</aside>
      </div>
    );
  }

}

Meter.defaultProps = {
};

export default Meter;
