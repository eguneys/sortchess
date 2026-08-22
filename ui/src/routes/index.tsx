import { Title } from '@solidjs/meta';
import { Router } from '../router';
import './Home.scss'
import Footer from '../components/Footer';
import PlaySortChessHeader, { arr_shuffle } from '../components/PlaySortChessHeader';
import GameInfoCard from '../components/GameInfoCard';
import SortChess3 from '../components/SortChess3';
import { createMemo, createSignal, For, Show } from 'solid-js';

export default function Home() {
  return (
    <main class='home-main google-sans-flex-450'>
      <Title>Sort Chess - Play Sort Chess</Title>
      <PlaySortChessHeader />
      <div class='regular-wrapper'>
        <Regular />
      </div>
      <Footer />
    </main>
  );
}

import './Regular.scss'
import { FEN } from '@lichess-org/chessground/types';
import { opposite } from 'chessops';
import { AdvantageOfRange, arr_pick, FenCpEvalAndRange, getRegular, HintsOfPuzzles, pickPatterns, randomPuzzlePicker } from '../state/puzzle_picker';
import SortChess3WithRankings, { createSortChess3RankingComputation } from '../components/SortChess3WithRankings';
import Hint3Regular from '../components/Hint3Regular';

function Regular() {

  const Regular = createMemo(() => getRegular())

  const [triggerNext, setTriggerNext] = createSignal(undefined, { equals: false })

  const SelectPuzzles = createMemo(() => {
    triggerNext()
    let regular = Regular()
    return randomPuzzlePicker(regular)
  })
  const sortChess3Computation = createMemo(() => createSortChess3RankingComputation({ selectPuzzles: SelectPuzzles() }))


  const checkSortOrder = () => {
    if (revealed()) {
      setRevealed(false)
      setHintRevealed(false)
      setTriggerNext()

    } else {
      setRevealed(true)
    }
  }
  const [hintRevealed, setHintRevealed] = createSignal(false)

  const hints = createMemo(() => {
    return HintsOfPuzzles(SelectPuzzles())
  })

  const [revealed, setRevealed] = createSignal(false)

  return (<>
    <div class='info-wrapper'>
      <GameInfoCard date={new Date()} id="abc" />
    </div>

    <SortChess3WithRankings revealed={revealed()} computation={sortChess3Computation()} />
    <div class='actions'>
      <Hint3Regular revealed={revealed()} hintRevealed={hintRevealed()} hints={hints()} onRevealed={() => setHintRevealed(true)} />

      <p class='flex-col-end'>
        Rank positions by how much white is better
        <small>Always white to move</small>
      </p>
      <button onClick={checkSortOrder}>{revealed() ? 'Next Puzzle' : 'Submit'}</button>
    </div>
  </>)
}
