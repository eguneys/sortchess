import { Title } from '@solidjs/meta';
import { Router } from '../router';
import './Home.scss'
import Footer from '../components/Footer';
import PlaySortChessHeader from '../components/PlaySortChessHeader';
import GameInfoCard from '../components/GameInfoCard';
import SortChess3 from '../components/SortChess3';
import { createMemo } from 'solid-js';

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

import './Regular.scss'

const getRegular = async () => {
  const origin = location.origin;
  const response = await fetch(new URL('/games/fen_evals_compact.json', origin));
  const regular: Array<{ fen: string; cp_eval: number }> =
    await response.json();
  return regular ?? []
}


function Regular() {

  const Regular = createMemo(() => getRegular())


  return (<>
    <div class='info-wrapper'>
      <GameInfoCard title="Regular Sort Chess 3" date={new Date()} id="abc" />
    </div>
    <div class='slide-wrapper'>
      <SortChess3 fens={[Regular()[0].fen, Regular()[1].fen, Regular()[2].fen]} />
    </div>
    <div class='rankings'>
      <div class='rank'>3.</div>
      <div class='rank'>2.</div>
      <div class='rank'>1.</div>
    </div>
    <div class='actions'>
      <p>Rank positions by how much white is better.</p>
      <button>Submit</button>
    </div>
  </>)
}