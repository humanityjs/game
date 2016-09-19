import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

const Menu = (props, context) => {
  const { router } = context;

  const items = [{
    label: 'Duel',
    path: '/combats/duel',
  }, {
    label: 'Group',
    path: '/combats/group',
  }, {
    label: 'Chaotic',
    path: '/combats/chaotic',
  }, {
    label: 'Territorial',
    path: '/combats/territorial',
  }, {
    label: 'Current',
    path: '/combats/current',
  }, {
    label: 'Past',
    path: '/combats/past',
  }];

  return (
    <div className="uk-flex uk-flex-center">
      <nav className="uk-navbar">
        <ul className="uk-navbar-nav">
          {items.map((item, index) => (
            <li
              key={index}
              className={classNames({ 'uk-active': router.isActive(item.path) })}
            >
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

Menu.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default Menu;
