import { Title } from '@solidjs/meta';
import { Router } from '../router';
import './Home.scss'
import Footer from '../components/Footer';
import PlaySortChessHeader from '../components/PlaySortChessHeader';
import GameInfoCard from '../components/GameInfoCard';
import SortChess3 from '../components/SortChess3';
import { createMemo, createSignal, For, Show } from 'solid-js';

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
import { FEN } from '@lichess-org/chessground/types';



type FenEval = { fen: string, cp_eval: number }
const Advantages = ['winning', 'big_advantage', 'slight_advantage', 'equal']
type Advantage = typeof Advantages[number]

type Color = 'white' | 'black'

type Range = {
  advantage: Advantage
  color: Color
  min: number
  max: number
}


const getRegular = async () => {
  const origin = location.origin;
  const response = await fetch(new URL('/games/binned_evals_with_ranges.json', origin));
  const regular: { ranges: Range[], binned_evals: FenEval[][][] } =
    await response.json();
  return regular ?? []
}

const PuzzlePatterns: Advantage[][] =
  [
    ['equal', 'equal', 'slight_advantage'],
    ['equal', 'slight_advantage', 'big_advantage'],
    ['slight_advantage', 'slight_advantage', 'big_advantage'],
    ['slight_advantage', 'big_advantage', 'winning'],
    ['equal', 'big_advantage', 'winning'],
  ]

function Regular() {

  const Regular = createMemo(() => getRegular())

  const [triggerNext, setTriggerNext] = createSignal(undefined, { equals: false })

  const SelectPuzzles = createMemo(() => {
    triggerNext()
    let regular = Regular()

    let puzzle_pattern = PuzzlePatterns[Math.floor(Math.random() * PuzzlePatterns.length)]

    let result = puzzle_pattern.map(pattern => {
      let range = regular.ranges.findIndex(_ => _.advantage === pattern)

      let binned_eval = regular.binned_evals[range]

      let bin = binned_eval[Math.floor(Math.random() * binned_eval.length)]

      bin = bin.filter(_ => _.fen.includes('w'))
      let fen_cp_eval = bin[Math.floor(Math.random() * bin.length)]

      return fen_cp_eval
    })
    arr_shuffle(result)
    return result
  })

  const [sortOrder, setSortOrder] = createSignal([0, 1, 2])

  const checkSortOrder = () => {
    if (revealed()) {

      setRevealed(false)
      setHintRevealed(false)
      setTriggerNext()

    } else {
      setRevealed(true)
    }
  }

  function fenOfRank(rank: number) {
    return SelectPuzzles()[sortOrder().indexOf(3 - rank)].fen
  }
  function cpEvalOfRank(rank: number) {
    return SelectPuzzles()[sortOrder().indexOf(3 - rank)].cp_eval / 100
  }
  function AdvantageOfRank(rank: number) {
    let regular = Regular()
    let puzzle = (SelectPuzzles()[sortOrder().indexOf(3 - rank)])
    let index = regular.binned_evals.findIndex(binned_evals => {
      return binned_evals.some(_ => _.find(_ => _ === puzzle))
    })

    return regular.ranges[index].advantage
  }

  const [hintRevealed, setHintRevealed] = createSignal(false)

  const hints = createMemo(() => {

    let ranks = arr_shuffle([1, 2, 3])

    return ranks.map(rank => AdvantageOfRank(rank))
  })


  const [revealed, setRevealed] = createSignal(false)
  const isCorrect = () => cpEvalOfRank(3) < cpEvalOfRank(2) && cpEvalOfRank(2) < cpEvalOfRank(1)
  const isSemiCorrect = () => !isCorrect() && (cpEvalOfRank(3) < cpEvalOfRank(2) || cpEvalOfRank(2) < cpEvalOfRank(1))
  const isTotallyWrong = () => !isCorrect() && !isSemiCorrect()

  return (<>
    <div class='info-wrapper'>
      <GameInfoCard title="Regular Sort Chess 3" date={new Date()} id="abc" />
    </div>
    <div class='slide-wrapper'>
      <SortChess3 fens={[SelectPuzzles()[0].fen, SelectPuzzles()[1].fen, SelectPuzzles()[2].fen]} onSortOrder={setSortOrder} />
    </div>
    <div class={['rankings', { correct: revealed() && isCorrect(), 'semi-correct': revealed() && isSemiCorrect(), 'wrong': revealed() && isTotallyWrong() }]}>
      <ShowRank reveal={revealed()} rank={3} advantage={AdvantageOfRank(3)} cpEval={cpEvalOfRank(3)} fen={fenOfRank(3)} />
      <ShowRank reveal={revealed()} rank={2} advantage={AdvantageOfRank(2)} cpEval={cpEvalOfRank(2)} fen={fenOfRank(2)} />
      <ShowRank reveal={revealed()} rank={1} advantage={AdvantageOfRank(1)} cpEval={cpEvalOfRank(1)} fen={fenOfRank(1)} />
    </div>
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
        <small>It's always white to move</small>
      </p>
      <button onClick={checkSortOrder}>{revealed() ? 'Next Puzzle' : 'Submit'}</button>
    </div>
  </>)
}

function ShowRank(props: { reveal: boolean, rank: number, advantage: string, cpEval: number, fen: FEN }) {
  // 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/1NBQKBNR_w_KQkq_-_0_1'
  const link = createMemo(() => `https://lichess.org/analysis/standard/${props.fen.replaceAll(' ', '_')}`)

  return (<>
    <div class='rank'>
      <span class='index'>#{props.rank}</span>
      <span class='advantage'>{props.reveal ? props.advantage : '----'}</span>
      <span class='cp-eval'>{props.reveal ? props.cpEval.toFixed(2) : '----'}</span>
      <a class='copy' href={link()} target='_blank'>View on Lichess</a>
    </div >
  </>)
}


export function arr_shuffle<A>(array: Array<A>) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array
}
