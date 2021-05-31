import { Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet'

import PlantSelectionPage from './pages/PlantSelectionPage';
import PlantViewPage from './pages/PlantViewPage';
import AboutPage from './pages/AboutPage';

const Main = () => {
  return (
	<div>
        <Helmet>
          <title>Matcha & Me</title>
        </Helmet>
    <Switch>
      <Route exact path='/' component={PlantSelectionPage}></Route>
      <Route exact path='/about' component={AboutPage}></Route>
      <Route path='/plants' component={PlantViewPage}></Route>
    </Switch>
	</div>
  );
}

export default Main;

<p>My Token = {window.token}</p>