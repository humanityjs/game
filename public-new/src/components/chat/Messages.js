import React, { Component } from 'react';

import { db } from '../../mediator';

import moment from 'moment';

export default class extends Component {
  state = { messages: [] };
  componentDidMount() {
    db().child('chat').orderByChild('time').startAt(Date.now())
      .on('child_added', (data) => {
        const { messages } = this.state;
        this.setState({
          messages: messages.concat([data.val()]),
        });
      });
  }
  render() {
    const { messages } = this.state;
    return (
      <div className="uk-panel uk-panel-box uk-panel-box-secondary uk-height-1-1">
        <div className="uk-height-1-1" style={{ overflow: 'auto' }}>
          {messages.map(item => (
            <div>[{moment(item.time).format('MMMM Do, h:mm:ss')}] {item.message}</div>
          ))}
        </div>
      </div>
    );
  }
}
