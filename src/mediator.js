import Firebase from 'firebase';
import { EventEmitter } from 'events';

import config from './config/index';

const mediator = Object.assign(new EventEmitter(), {
  // TOOD: check how to remove this attr
  loggedInHero: false,
  storage: {},
});

let dbRef;
export function db() {
  if (!dbRef) dbRef = new Firebase(config.firebasePath);
  return dbRef;
}

// TOOD: check how to move it another place
//       maybe move it to reducers
export function fechStorage() {
  return Promise.all([

    db().child('tableExperience').once('value').then(data => {
      mediator.storage.tableExperience = data.val();
    }),

    db().child('skills').once('value').then(data => {
      mediator.storage.skills = data.val();
    }),

    db().child('heroImages').once('value').then(data => {
      mediator.storage.heroImages = data.val();
    }),

    db().child('things').once('value').then(data => {
      mediator.storage.things = data.val();
    }),

    db().child('islands').once('value').then(data => {
      mediator.storage.islands = data.val();
    }),

    db().child('heroes').once('value').then(data => {
      mediator.storage.heroes = data.val();
    }),

  ]);
}

export default mediator;
