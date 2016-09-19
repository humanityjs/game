import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      label: PropTypes.string,
    })),
    onChange: PropTypes.func,
    label: PropTypes.string,
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
    const { items, className, label } = this.props;
    const { value } = this.state;
    const selectedItem = items.find(item => item.key == value);

    const selectClassNames = classNames('uk-button uk-form-select', className);
    return (
      <div className={selectClassNames}>
        <span>{selectedItem ? selectedItem.label : (label || 'Select')}</span>
        {' '}
        <i className="uk-icon-caret-down" />
        <select
          onChange={::this.onChange}
          value={value}
        >
          {!selectedItem ? <option value={''}>Select</option> : null}
          {items.map((item, index) =>
            <option key={index} value={item.key}>
              {item.label}
            </option>
          )}
        </select>
      </div>
    );
  }
}
