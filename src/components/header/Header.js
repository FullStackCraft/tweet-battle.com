import React from 'react';

class MainContent extends React.Component {
  render() {
    return (
      <div>
        <h1>World Happiness Meter</h1>
        <h2>Tweets Worldwide: ''<code>:)</code>'' vs. '<code>:(</code>'</h2>
      </div>
    );
  }
}

MainContent.defaultProps = {
};

export default MainContent;
