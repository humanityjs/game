import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Button = (props) => {
  const { className, label, icon, size, type, ...otherProps } = props;
  const buttonClassNames = classNames('uk-button', className, {
    [`uk-button--${size}`]: size,
    [`uk-button-${type}`]: type,
  });

  return (
    <button
      type="button"
      className={buttonClassNames}
      {...otherProps}
    >
      {label}
      {icon ? <i className={`uk-icon-${icon}`} /> : null}
    </button>
  );
};

const BUTTON_SIZES = ['mini', 'small', 'default', 'large'];
const BUTTON_TYPES = ['primary', 'success', 'danger', 'link'];

Button.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.oneOf(BUTTON_SIZES),
  type: PropTypes.oneOf(BUTTON_TYPES),
};

export default Button;
