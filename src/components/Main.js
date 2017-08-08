require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

import Meter from './meter/Meter.js'

class AppComponent extends React.Component {
  render() {
    return (
      <Meter/>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
