import React from 'react';
import { Router, Route, IndexRedirect, hashHistory } from 'react-router';

import HomePage from './components/pages/Home';
import NotFoundPage from './components/pages/NotFound';
import HeroPage from './components/pages/Hero';
import App from './components/App';
import HeroInventoryPage from './components/pages/HeroInventory';

import Preferences from './components/pages/preferences/Index';
import PreferencesGeneralPage from './components/pages/preferences/General';
import PreferencesImagesPage from './components/pages/preferences/Images';

import IslandPage from './components/pages/Island';

import Combats from './components/pages/combats/Index';
import CombatsDuelPage from './components/pages/combats/Duel';
import CombatsChaoticPage from './components/pages/combats/Chaotic';
import CombatsGroupPage from './components/pages/combats/Group';

import mediator from './mediator';

export default (
  <Router history={hashHistory}>
    <Route component={App}>
      <Route path="/" getComponent={(location, cb) => {
        cb(null, mediator.loggedInHero ? HeroPage : HomePage);
      }}
      />
      <Route path="preferences" component={Preferences}>
        <IndexRedirect to="/preferences/general" />
        <Route path="general" component={PreferencesGeneralPage} />
        <Route path="images" component={PreferencesImagesPage} />
      </Route>
      <Route path="hero/inventory" component={HeroInventoryPage} />
      <Route path="island" component={IslandPage} />
      <Route path="combats" component={Combats}>
        <IndexRedirect to="/combats/duel" />
        <Route path="duel" component={CombatsDuelPage} />
        <Route path="chaotic" component={CombatsChaoticPage} />
        <Route path="group" component={CombatsGroupPage} />
      </Route>
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
);
