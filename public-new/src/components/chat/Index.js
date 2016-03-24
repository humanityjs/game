import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Messages from './Messages';
import Participants from './Participants';
import Controls from './Controls';

import { on } from '../../lib/dom';

export default class extends Component {
  componentDidMount() {
    this.resizeHandle();
  }

  getStyles() {
    return {
      base: {
        height: 150,
        position: 'fixed',
        width: 'calc(100% - 30px)',
        bottom: 40,
      },
      resizer: {
        width: '100%',
        height: 2,
        cursor: 'row-resize',
        position: 'absolute',
        top: 0,
        left: 0,
      },
    };
  }

  resizeHandle() {
    const resizer = ReactDOM.findDOMNode(this.refs.resizer);
    const wrapper = ReactDOM.findDOMNode(this.refs.wrapper);
    let start;
    let wrapperHeight;

    on(resizer, 'dragstart', (e) => {
      start = e.clientY;
      wrapperHeight = parseInt(wrapper.style.height, 10);
    });

    on(resizer, 'drag', (e) => {
      if (e.clientY === 0) return;
      wrapper.style.height = `${wrapperHeight + (start - e.clientY)}px`;
    });
  }

  render() {
    const styles = this.getStyles();

    return (
      <div
        ref="wrapper"
        style={styles.base}
        className="uk-panel uk-panel-box"
      >
        <div
          ref="resizer"
          draggable="true"
          style={styles.resizer}
        />
        <div className="uk-grid uk-height-1-1">
          <div
            className="uk-width-2-3"
            style={{ height: 'calc(100% - 45px)' }}
          >
            <Messages />
          </div>
          <div className="uk-width-1-3 uk-height-1-1">
            <Participants />
          </div>
        </div>
        <div className="uk-width-2-3" style={{ marginTop: -30 }}>
          <Controls />
        </div>
      </div>
    );
  }
}
