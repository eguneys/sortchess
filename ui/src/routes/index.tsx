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
import { AdvantageOfRange, arr_pick, FenCpEvalAndRange, getRegular, pickPatterns } from '../state/puzzle_picker';
import SortChess3WithRankings from '../components/SortChess3WithRankings';

function Regular() {

  const Regular = createMemo(() => getRegular())

  const [triggerNext, setTriggerNext] = createSignal(undefined, { equals: false })

  const SelectPuzzles = createMemo(() => {
    triggerNext()

    let { puzzle_pattern, color_pattern } = pickPatterns()

    let regular = Regular()

    let result = puzzle_pattern.map((pattern, i) => {
      let range_index = regular.ranges.findIndex(_ => _.advantage === pattern && _.color === color_pattern[i])

      let range = regular.ranges[range_index]
      let binned_eval = regular.binned_evals[range_index]

      let bin = arr_pick(binned_eval.slice(0))

      let fen_cp_eval = arr_pick(bin)

      return { range, fen_cp_eval }
    })
    arr_shuffle(result)
    return result as [FenCpEvalAndRange, FenCpEvalAndRange, FenCpEvalAndRange]
  })


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

    return arr_shuffle(SelectPuzzles().map(puzzle => AdvantageOfRange(puzzle.range)))
  })


  const [revealed, setRevealed] = createSignal(false)
  return (<>
    <div class='info-wrapper'>
      <GameInfoCard date={new Date()} id="abc" />
    </div>

    <SortChess3WithRankings revealed={revealed()} selectPuzzles={SelectPuzzles()} />
    <div class='actions'>
      <Show when={!revealed()}>
        <Show when={hintRevealed()} fallback={
          <button class='give-hint' onClick={() => setHintRevealed(true)}>Hint</button>
        }>
          <div class='hints'>
            <For each={hints()}>{hint =>
              <span>{hint}</span>
            }</For>
          </div>
        </Show>
      </Show>
      <p class='flex-col-end'>
        Rank positions by how much white is better
        <small>Always white to move</small>
      </p>
      <button onClick={checkSortOrder}>{revealed() ? 'Next Puzzle' : 'Submit'}</button>
    </div>
  </>)
}
