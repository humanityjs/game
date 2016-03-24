import React, { Component } from 'react';

import mediator, { db } from '../../mediator';

export default class extends Component {
  state = { participants: [] };
  componentDidMount() {
    const amOnline = db().child('.info/connected');
    const participantRef = db().child('participants/' + mediator.id);

    amOnline.on('value', (data) => {
      if (data.val()) {
        participantRef.onDisconnect().remove();
        participantRef.set(true);
      }
    });

    db().child('participants').on('child_added', (data) => {
      this.setState({
        participants: this.state.participants.concat([data.key()]),
      });
    });
    db().child('participants').on('child_removed', (data) => {
      const { participants } = this.state;
      participants.splice(participants.indexOf(data.key()), 1);
      this.setState({
        participants,
      });
    });
  }
  render() {
    const { participants } = this.state;

    return (
      <div className="uk-panel uk-panel-box uk-panel-box-secondary uk-height-1-1">
        Participants
        <div style={{ overflow: 'auto' }}>
          {participants.map(item => (
            <div>{item}</div>
          ))}
        </div>
      </div>
    );
  }
}
