var React = require('react');

// An example component.
// See docs on Components here: https://facebook.github.io/react/docs/components-and-props.html
module.exports = class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.state = {
      count: 0
    };
    this.initialCount = this.state.count;
  }

  handleIncrement() {
    this.setState({ count: this.state.count + 1 });
  }

  handleReset() {
    this.setState({ count: this.initialCount });
  }

  render() {
    return (
      <div>
        <span> Count: {this.state.count} </span>
        <button onClick={this.handleIncrement}> increment </button>
        <button onClick={this.handleReset}> reset </button>
      </div>
    );
  }
};
