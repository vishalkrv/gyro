import React from 'react';
import { Switch, Route } from 'react-router';

class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" render={props => 'Hello World'} />
      </Switch>
    );
  }
}

export default App;
