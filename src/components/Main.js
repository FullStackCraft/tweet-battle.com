require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

import Header from './header/Header.js'
import Meter from './meter/Meter.js'
import MainContent from './mainContent/MainContent.js'
import Chart from './chart/Chart.js'
import Footer from './footer/Footer.js'

const initialChartState = {
  labels: ['Scatter'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      backgroundColor: 'rgba(75,192,192,0.4)',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [
        { x: 0, y: 0 },
      ]
    }
  ],
    animation: false
}

class AppComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      chartData: initialChartState
    };
    this.addPointToChart = this.addPointToChart.bind(this);
  }
  addPointToChart(iPercent) {
    var chartData = this.state.chartData;
    var oValues = Object.values(chartData);
    var oValuesValues = Object.values(oValues);
    var aData = oValuesValues[1][0].data; // my god...
    console.log(aData);
    var iNextX = aData[aData.length - 1].x; // last x value in array, plus 1
    iNextX = iNextX + 1;
    console.log(iNextX);
    console.log(iPercent);
    aData.push({x: iNextX, y: iPercent}); // add the percentage data point
		var oldDataSet = oValues[1];
		var newDataSet = {
			...oldDataSet
		}; // copy of old data set...
		newDataSet.data = aData; // except for our new data
		var newChartState = {
			...initialChartState,
			datasets: [newDataSet]
		};
    this.setState(chartData: newChartState);
  }
  render() {
    return (
      <div className='wrapper'>
        <Header/>
        <Meter addPointToChart={this.addPointToChart}/>
        <MainContent/>
        <Chart chartData={this.state.chartData}/>
        <Footer/>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
