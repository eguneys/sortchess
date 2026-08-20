import { Title } from '@solidjs/meta';
import { Router } from '../router';
import './Home.scss'
import Footer from '../components/Footer';
import PlaySortChessHeader from '../components/PlaySortChessHeader';
import GameInfoCard from '../components/GameInfoCard';
import SortChess3 from '../components/SortChess3';

export default function Home() {
  return (
    <main class='home-main google-sans-flex-450'>
      <Title>Sort Chess - Hello</Title>
      <PlaySortChessHeader />
      <div class='regular-wrapper'>
        <Regular />
      </div>
      <Footer />
    </main>
  );
}

function Regular() {
  return (<>
    <div class='info-wrapper'>
      <GameInfoCard title="Regular Sort Chess 3" date={new Date()} id="abc" />
    </div>
    <div class='slide-wrapper'>
      <SortChess3 />
    </div>
    <div class='actions'>
      <p>Sort positions by how much white is better.</p>
      <button>Submit</button>
    </div>
  </>)
}