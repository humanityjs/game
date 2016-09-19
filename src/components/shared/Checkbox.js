import React, { PropTypes, Component } from 'react';

export default class Checkbox extends Component {
  onChange(e) {
    const { onChange } = this.props;
    if (onChange) onChange(e.target.value);
  }
  render() {
    const { label, ...otherProps } = this.props;
    return (
      <label {...otherProps}>
        <input
          onChange={::this.onChange}
          type="checkbox"
        /> {label}
      </label>
    );
  }
}

Checkbox.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
};
