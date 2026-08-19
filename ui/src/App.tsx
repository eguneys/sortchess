import { Title } from '@solidjs/meta';
import { Loading } from 'solid-js';
import { paths, Router } from './router';
import './index.scss'
import './App.scss';

// The app root: the router and the site-wide layout live here. Pages are
// the modules under src/routes.
export default function App() {
  return (
    <Router>
      {(props) => (
        <>
          <Title>Sort Chess</Title>
          <nav>
          </nav>
          <div class='main-wrapper'>
            <Loading fallback={<main>Loading…</main>}>{props.children}</Loading>
          </div>
        </>
      )}
    </Router>
  );
}
