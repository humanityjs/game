import React from 'react';
import Menu from '../../combats/Menu';

export default ({ children }) => (
  <div>
    <div>
      <Menu />
    </div>
    <div className="uk-margin-top">
      {children}
    </div>
  </div>
);
