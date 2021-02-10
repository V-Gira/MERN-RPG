import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Users from './user/Users';
import Signup from './user/Signup';
import Signin from './auth/Signin';
import EditProfile from './user/EditProfile';
import Profile from './user/Profile';
import PrivateRoute from './auth/PrivateRoute';
import Menu from './core/Menu';
import NewGame from './game/NewGame';
//import Games from './game/Games'
import Game from './game/Game';
import EditGame from './game/EditGame';
import MyGames from './game/MyGames';
import Party from './party/Party';

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/users' component={Users} />
        <Route path='/signup' component={Signup} />
        <Route path='/signin' component={Signin} />
        <PrivateRoute path='/user/edit/:userId' component={EditProfile} />
        <Route path='/user/:userId' component={Profile} />
        <Route path='/game/:gameId' component={Game} />
        <PrivateRoute path='/teach/games' component={MyGames} />

        <PrivateRoute path='/teach/game/new' component={NewGame} />
        <PrivateRoute path='/teach/game/edit/:gameId' component={EditGame} />
        <PrivateRoute path='/teach/game/:gameId' component={Game} />
        <PrivateRoute path='/learn/:partyId' component={Party} />
      </Switch>
    </div>
  );
};

export default MainRouter;
