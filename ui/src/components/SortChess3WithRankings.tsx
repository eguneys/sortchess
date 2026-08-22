import { FEN } from "@lichess-org/chessground/types"
import { createMemo, createSignal } from "solid-js"
import { AdvantageOfRange, FenCpEvalAndRange } from "../state/puzzle_picker"
import SortChess3 from "./SortChess3"

export default function SortChess3WithRankings(props: { revealed: boolean, selectPuzzles: [FenCpEvalAndRange, FenCpEvalAndRange, FenCpEvalAndRange] }) {

    const SelectPuzzles = createMemo(() => props.selectPuzzles)

    const revealed = createMemo(() => props.revealed)

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


    return (<>
        <div class='slide-wrapper'>
            <SortChess3 fens={[SelectPuzzles()[0].fen_cp_eval.fen, SelectPuzzles()[1].fen_cp_eval.fen, SelectPuzzles()[2].fen_cp_eval.fen]} onSortOrder={setSortOrder} />
        </div>
        <div class={['rankings', { correct: revealed() && isCorrect(), 'semi-correct': revealed() && isSemiCorrect(), 'wrong': revealed() && isTotallyWrong() }]}>
            <ShowRank reveal={revealed()} rank={3} advantage={AdvantageOfRank(3)} cpEval={cpEvalOfRank(3)} fen={fenOfRank(3)} />
            <ShowRank reveal={revealed()} rank={2} advantage={AdvantageOfRank(2)} cpEval={cpEvalOfRank(2)} fen={fenOfRank(2)} />
            <ShowRank reveal={revealed()} rank={1} advantage={AdvantageOfRank(1)} cpEval={cpEvalOfRank(1)} fen={fenOfRank(1)} />
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

