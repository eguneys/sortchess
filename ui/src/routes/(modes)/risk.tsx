import { createMemo, createProjection, createSignal, Show } from "solid-js";
import GameInfoCard from "../../components/GameInfoCard";
import { getRegular, HintsOfPuzzles, randomPuzzlePicker } from "../../state/puzzle_picker";
import SortChess3WithRankings, { createSortChess3RankingComputation } from "../../components/SortChess3WithRankings";
import Hint3Regular from "../../components/Hint3Regular";

import '../Regular.scss'
import './Risk.scss'

type Confidence = 'all-in' | 'sure' | 'not-sure'

export default function Risk() {
    const Regular = createMemo(() => getRegular())

    const [triggerNext, setTriggerNext] = createSignal(undefined, { equals: false })

    const SelectPuzzles = createMemo(() => {
        triggerNext()
        let regular = Regular()
        return randomPuzzlePicker(regular)
    })

    const checkResult = (confidence: Confidence) => {

    }

    const nextPuzzle = () => {
        setRevealed(false)
        setHintRevealed(false)
        setTriggerNext()
    }

    const [hintRevealed, setHintRevealed] = createSignal(false)

    const hints = createMemo(() => {
        return HintsOfPuzzles(SelectPuzzles())
    })

    const [revealed, setRevealed] = createSignal(false)


    const [stackChips, setStackChips] = createSignal(100)
    const [deductFloatFeedback, setDeductFloatFeedback] = createSignal(0)
    const [showFloatFeedback, setShowFloatFeedback] = createSignal(false)

    const deduct = (chips: number) => {
        setStackChips(stackChips() - chips)
        setDeductFloatFeedback(chips)
        setShowFloatFeedback(true)
        setTimeout(() => {
            setShowFloatFeedback(false)
        }, 1000)
    }

    const sortChess3Computation = createMemo(() => createSortChess3RankingComputation({ selectPuzzles: SelectPuzzles() }))

    return (<>
        <div class='regular-wrapper risk-wrapper'>
            <div class='info-wrapper'>
                <GameInfoCard date={new Date()} id="abc" />
            </div>

            <SortChess3WithRankings revealed={revealed()} computation={sortChess3Computation()} />
            <div class='actions'>
                <div class='info-and-hint'>
                    <Show when={!hintRevealed()}>
                        <p class='basic-info'>
                            <small>Rank positions by how much white is better</small>
                            <small>Always white to move</small>
                        </p>
                    </Show>
                    <Hint3Regular revealed={revealed()} hintRevealed={hintRevealed()} hints={hints()} onRevealed={() => setHintRevealed(true)} />
                </div>

                <div class='wager-stack'>
                    Your Stack <span class={['stack-chips', { flash: showFloatFeedback(), lose: showFloatFeedback() && deductFloatFeedback() < 0, win: showFloatFeedback() && deductFloatFeedback() > 0 }]}>{stackChips()}$</span>
                    <span class={['float-feedback', { show: showFloatFeedback(), lose: deductFloatFeedback() < 0, win: deductFloatFeedback() > 0 }]}>
                        {showFloatFeedback() ? deductFloatFeedback() : ''}
                    </span>
                </div>
                <div class='wager-button-group'>
                    <Show when={revealed()} fallback={
                        <div class='wager-buttons'>
                            <button onClick={() => checkResult('not-sure')}>Not Sure</button>
                            <button onClick={() => checkResult('sure')}>Sure</button>
                            <button onClick={() => checkResult('all-in')}>All In</button>
                        </div>
                    }>
                        <div class='filler'></div>
                        <button class='next-button' onClick={nextPuzzle}>{'Next Puzzle'}</button>
                    </Show>
                </div>
            </div>
            <div class='info'>
                <h2>How Risk Chess Works?</h2>
                <p>
                    You still sort 3 chess positions but instead of submitting to get a result:
                </p>
                <p>
                    You start with a stack of chips and wager on how confident you are with your submission.
                </p>
                <p>
                    Grow your stack as much as you want to get a high score.
                </p>
                <p>
                    Use hints for a percentage of your wager winnings.
                </p>
            </div>
        </div >
    </>)
}