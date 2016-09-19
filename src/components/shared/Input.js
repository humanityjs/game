import React, { Component, PropTypes } from 'react';

export default class extends Component {
  static propTypes = {
    onChange: PropTypes.func,
  };

  state = {
    value: null,
  };

  onChange(e) {
    const value = e.target.value;
    const { onChange } = this.props;

    this.setState({ value });

    if (onChange) onChange(value);
  }

  render() {
    const { value } = this.state;
    const { ...props } = this.props;
    delete props.onChange;

    return (
      <input
        value={value}
        onChange={this.onChange.bind(this)}
        {...props}
      />
    );
  }
}
