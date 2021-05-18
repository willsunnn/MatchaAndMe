import { Switch, Route } from 'react-router-dom';

import PlantSelectionPage from './pages/PlantSelectionPage';
import PlantViewPage from './pages/PlantViewPage';

const Main = () => {
  return (
    <Switch>
      <Route exact path='/' component={PlantSelectionPage}></Route>
      <Route exact path='/plant' component={PlantViewPage}></Route>
    </Switch>
  );
}

export default Main;

<p>My Token = {window.token}</p>