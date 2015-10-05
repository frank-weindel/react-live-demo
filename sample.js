import React from 'react';

const Alert = React.createClass({
  render() {
    const style = {
      padding: '5px 5px',
      fontWeight: 'bold',
      border: '1px solid red',
      textTransform: 'uppercase'
    };
    return <div style={style}><h3><u>{this.props.title}</u></h3>{this.props.children}</div>
  }
});

const App = React.createClass({
  propTypes: {

  },
  getDefaultProps() {

    return {

    };
  },
  getInitialState() {
    return {

    };
  },
  render() {
    return (
      <Alert title="This is a test">Lorem ipsum</Alert>
    );
  }
});

export default App;
