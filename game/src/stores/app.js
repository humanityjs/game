import { observable, action } from 'mobx';
import db from '../lib/db';

class App {
  @observable initData = {};

  @action
  async fetchInitData() {
    const skills = await db().child('skills').once('value');
    const tableExperience = await db().child('tableExperience').once('value');
    const things = await db().child('things').once('value');
    this.initData = {
      skills: skills.val(),
      tableExperience: tableExperience.val(),
      things: things.val(),
    };
  }
}


export default new App();
