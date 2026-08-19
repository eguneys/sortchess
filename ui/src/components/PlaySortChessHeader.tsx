import { createEffect, createMemo, createSignal, For, onSettled } from "solid-js"
import './PlaySortChessHeader.scss'

export default function PlaySortChessHeader() {


    const [trigger_shuffle, set_trigger_shuffle] = createSignal(false)

    let words = ['Play', 'Sort', 'Chess']
    let i = 0
    let shuffled = [
        ['Sort', 'Play', 'Chess'],
        ['Sort', 'Chess', 'Play'],
        ['Chess', 'Play', 'Sort'],
        ['Play', 'Chess', 'Sort'],
    ]
    const shuffled_order = createMemo(() => {
        if (trigger_shuffle())
            return shuffled[i++ % shuffled.length]
        return words
    })

    let trigger_times = [
        500, 800, 800, 1000, 3000,
        510, 801, 811, 1400, 3000,
        520, 802, 822, 1300, 6000,
        530, 803, 833, 1200, 3000,
        540, 804, 844, 1100, 9000,
    ]
    onSettled(() => {

        function step() {
            set_trigger_shuffle(!trigger_shuffle())

            timeout = setTimeout(step, trigger_times[i % trigger_times.length])
        }

        let timeout = setTimeout(step, 1000)

        return () => clearTimeout(timeout)
    })

    let positions = createMemo(() => {
        let word
        let ChessAdvance = 20 * 5.5
        let PlayAdvance = 20 * 4

        let x = 0
        let x1 = -135 + x

        word = shuffled_order()[0]
        x += word === 'Chess' ? ChessAdvance : PlayAdvance
        let x2 = x1 + x

        word = shuffled_order()[1]
        x += word === 'Chess' ? ChessAdvance : PlayAdvance
        let x3 = x1 + x

        return [x1, x2, x3]
    })

    const positionsPlay = createMemo(() => `translateX(${positions()[shuffled_order().indexOf('Play')]}px)`)
    const positionsSort = createMemo(() => `translateX(${positions()[shuffled_order().indexOf('Sort')]}px)`)
    const positionsChess = createMemo(() => `translateX(${positions()[shuffled_order().indexOf('Chess')]}px)`)

    return (<>
        <h1 class='hello-header text-center'>
            <div>
                <span class='play-word' style={{ transform: positionsPlay() }}>Play</span>
                <span class='play-word' style={{ transform: positionsSort() }}>Sort</span>
                <span class='play-word' style={{ transform: positionsChess() }}>Chess</span>
            </div>
            <span class={['rotate-char', { kick: trigger_shuffle() }]}>!</span></h1>
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
