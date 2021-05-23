import { Switch, Route } from 'react-router-dom';

import PlantSelectionPage from './pages/PlantSelectionPage';
import PlantViewPage from './pages/PlantViewPage';
import AboutPage from './pages/AboutPage';

const Main = () => {
  return (
    <Switch>
      <Route exact path='/' component={PlantSelectionPage}></Route>
      <Route exact path='/about' component={AboutPage}></Route>
      <Route path='/plants' component={PlantViewPage}></Route>
    </Switch>
  );
}

export default Main;

<p>My Token = {window.token}</p>