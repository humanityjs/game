import React, { Component } from 'react';

import Button from '../shared/Button';

import { db } from '../../mediator';

export default class extends Component {
  state = { message: '' };
  onSend() {
    const { message } = this.state;
    db().child('chat').push({
      message,
      time: Date.now(),
    });
    this.setState({ message: '' });
  }
  render() {
    const { message } = this.state;

    return (
      <div>
        <form className="uk-form">
          <input
            type="text"
            placeholder=""
            value={message}
            onChange={e => this.setState({ message: e.target.value })}
            className="uk-width-9-10"
          />
          <Button
            onClick={::this.onSend}
            label="Send"
            className="uk-button-primary"
          />
        </form>
      </div>
    );
  }
}
