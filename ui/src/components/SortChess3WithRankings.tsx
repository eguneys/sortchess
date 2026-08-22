import { FEN } from "@lichess-org/chessground/types"
import { createMemo, createSignal } from "solid-js"
import { AdvantageOfRange, FenCpEvalAndRange } from "../state/puzzle_picker"
import SortChess3 from "./SortChess3"

type SortChess3RankingComputationState = {
    fenOf(index: number): FEN
    isCorrect: boolean
    isSemiCorrect: boolean
    isTotallyWrong: boolean
    AdvantageOfRank(rank: number): string
    cpEvalOfRank(rank: number): number
    fenOfRank(rank: number): FEN
}

type SortChess3RankingComputationActions = {
    setSortOrder(order: [number, number, number]): void
}

type SortChess3RankingComputationStore = [SortChess3RankingComputationState, SortChess3RankingComputationActions]

export function createSortChess3RankingComputation(props: { selectPuzzles: [FenCpEvalAndRange, FenCpEvalAndRange, FenCpEvalAndRange] }): SortChess3RankingComputationStore {

    const SelectPuzzles = createMemo(() => props.selectPuzzles)

    const [sortOrder, setSortOrder] = createSignal([0, 1, 2])

    function PuzzleOfRank(rank: number) {
        let puzzle = (SelectPuzzles()[sortOrder().indexOf(3 - rank)])
        return puzzle
    }

    function AdvantageOfRank(rank: number) {
        return AdvantageOfRange(RangeOfRank(rank))
    }

    function RangeOfRank(rank: number) {
        return PuzzleOfRank(rank).range
    }

    function fenOfRank(rank: number) {
        return PuzzleOfRank(rank).fen_cp_eval.fen
    }
    function cpEvalOfRank(rank: number) {
        return PuzzleOfRank(rank).fen_cp_eval.cp_eval / 100
    }
    const isCorrect = () => cpEvalOfRank(3) < cpEvalOfRank(2) && cpEvalOfRank(2) < cpEvalOfRank(1)
    const isSemiCorrect = () => !isCorrect() && (cpEvalOfRank(3) < cpEvalOfRank(2) || cpEvalOfRank(2) < cpEvalOfRank(1))
    const isTotallyWrong = () => !isCorrect() && !isSemiCorrect()

    let state = {
        fenOf(index: number) {
            return SelectPuzzles()[index].fen_cp_eval.fen
        },
        AdvantageOfRank(rank: number) {
            return AdvantageOfRank(rank)
        },
        cpEvalOfRank(rank: number) {
            return cpEvalOfRank(rank)
        },
        fenOfRank(rank: number) {
            return fenOfRank(rank)
        },
        get isCorrect() {
            return isCorrect()
        },
        get isSemiCorrect() {
            return isSemiCorrect()
        },
        get isTotallyWrong() {
            return isTotallyWrong()
        }
    }

    let actions = {
        setSortOrder
    }

    return [state, actions]
}

export default function SortChess3WithRankings(props: { revealed: boolean, computation: SortChess3RankingComputationStore }) {

    let state = createMemo(() => props.computation[0])
    let actions = createMemo(() => props.computation[1])


    const revealed = createMemo(() => props.revealed)
    return (<>
        <div class='slide-wrapper'>
            <SortChess3 fens={[state().fenOf(0), state().fenOf(1), state().fenOf(2)]} onSortOrder={actions().setSortOrder} />
        </div>
        <div class={['rankings', { correct: revealed() && state().isCorrect, 'semi-correct': revealed() && state().isSemiCorrect, 'wrong': revealed() && state().isTotallyWrong }]}>
            <ShowRank reveal={revealed()} rank={3} advantage={state().AdvantageOfRank(3)} cpEval={state().cpEvalOfRank(3)} fen={state().fenOfRank(3)} />
            <ShowRank reveal={revealed()} rank={2} advantage={state().AdvantageOfRank(2)} cpEval={state().cpEvalOfRank(2)} fen={state().fenOfRank(2)} />
            <ShowRank reveal={revealed()} rank={1} advantage={state().AdvantageOfRank(1)} cpEval={state().cpEvalOfRank(1)} fen={state().fenOfRank(1)} />
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

