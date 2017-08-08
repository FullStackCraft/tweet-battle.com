import React from 'react';
import {Scatter} from 'react-chartjs-2';



class Chart extends React.Component {
  render() {
    console.log(this.props.chartData);
    return (
      <div>
        <h2>Live Plot</h2>
        <Scatter data={this.props.chartData} redraw/>
      </div>
    );
  }
}

Chart.defaultProps = {
};

export default Chart;
