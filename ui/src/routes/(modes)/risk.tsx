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

    const sortChess3Computation = createMemo(() => createSortChess3RankingComputation({ selectPuzzles: SelectPuzzles() }))
    const sortChess3State = createMemo(() => sortChess3Computation()[0])

    const checkResult = (confidence: Confidence) => {
        let state = sortChess3State()

        const NOT_SURE_COST_PERCENTAGE = 0.3
        const SURE_COST_PERCENTAGE = 0.5
        const HINT_COST_PERCENTAGE = 0.2;
        if (state.isCorrect) {
            let winnings = 0
            switch (confidence) {
                case 'all-in': {
                    winnings = stackChips()
                } break
                case 'sure': {
                    winnings = stackChips() * SURE_COST_PERCENTAGE
                } break
                case 'not-sure': {
                    winnings = stackChips() * NOT_SURE_COST_PERCENTAGE
                }
            }
            if (hintRevealed()) {
                winnings *= HINT_COST_PERCENTAGE
            }
            deduct(winnings)
        }

        const SEMI_ALL_IN_COST_PERCENTAGE = 0.65
        const SEMI_NOT_SURE_COST_PERCENTAGE = 0.2
        const SEMI_SURE_COST_PERCENTAGE = 0.35
        if (state.isSemiCorrect) {
            let winnings = 0
            switch (confidence) {
                case 'all-in': {
                    winnings = -stackChips() * SEMI_ALL_IN_COST_PERCENTAGE
                } break
                case 'sure': {
                    winnings = -stackChips() * SEMI_SURE_COST_PERCENTAGE
                } break
                case 'not-sure': {
                    winnings = stackChips() * SEMI_NOT_SURE_COST_PERCENTAGE
                }
            }
            if (hintRevealed()) {
                if (winnings < 0) {
                    winnings /= HINT_COST_PERCENTAGE
                } else {
                    winnings *= HINT_COST_PERCENTAGE
                }
            }
            deduct(winnings)
        }
        if (state.isTotallyWrong) {
            let winnings = 0
            switch (confidence) {
                case 'all-in': {
                    winnings = stackChips()
                } break
                case 'sure': {
                    winnings = stackChips() * SURE_COST_PERCENTAGE
                } break
                case 'not-sure': {
                    winnings = stackChips() * NOT_SURE_COST_PERCENTAGE
                }
            }
            if (hintRevealed()) {
                winnings /= HINT_COST_PERCENTAGE
            }
            deduct(-winnings)
        }

        setRevealed(true)
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


    const STARTING_STACK = 100
    const [stackChips, setStackChips] = createSignal(STARTING_STACK)
    const [deductFloatFeedback, setDeductFloatFeedback] = createSignal(0)
    const [showFloatFeedback, setShowFloatFeedback] = createSignal(false)

    const deduct = (chips: number) => {
        setStackChips(Math.max(STARTING_STACK, stackChips() + chips))
        setDeductFloatFeedback(chips)
        setShowFloatFeedback(true)
        setTimeout(() => {
            setShowFloatFeedback(false)
        }, 1000)
    }


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
                    Your Stack <span class={['stack-chips', { flash: showFloatFeedback(), lose: showFloatFeedback() && deductFloatFeedback() < 0, win: showFloatFeedback() && deductFloatFeedback() > 0 }]}>{stackChips().toFixed(1)}$</span>
                    <span class={['float-feedback', { show: showFloatFeedback(), lose: deductFloatFeedback() < 0, win: deductFloatFeedback() > 0 }]}>
                        {showFloatFeedback() ? deductFloatFeedback().toFixed(1) : ''}
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