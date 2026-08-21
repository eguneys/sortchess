import { createMemo, createSignal, createStore, onSettled } from 'solid-js'
import './SortChess3.scss'
import { Chessboard } from './Chessboard'
import { INITIAL_FEN } from 'chessops/fen'
import { createLoop, makeSpring, Spring, updateSpring } from './loop'
import { setBounds as setBoundsMouse, update as updateMouse, createMouse, Mouse } from './mouse'
import { FEN } from '@lichess-org/chessground/types'

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
}

export type Card = {
    target_slot: number,
    empty_slot: number,
    x_spring: Spring,
    hovering: boolean
    dragging: boolean
    z_index_on_top: boolean
}

export const makeCard = (target_slot: number, x: number): Card => {
    return {
        target_slot,
        empty_slot: -1,
        x_spring: makeSpring(x, 800, 30),
        hovering: false,
        dragging: false,
        z_index_on_top: false
    }
}

export default function SortChess3(props: { fens: [FEN, FEN, FEN], onSortOrder: (order: [number, number, number]) => void }) {
    const [store, setStore] = createStore({
        size: 0,
        bounds: { top: 0, left: 0, width: 0, height: 0, slots: [0, 0, 0] }
    })

    let cards = [makeCard(0, 0), makeCard(1, 0), makeCard(2, 0)]

    function updateCards(dt: number) {
        for (let card of cards) {
            updateSpring(card.x_spring, dt / 1000)
        }

        for (let card of cards) {
            card.hovering = false
        }

        if (mouse.is_hovering.y > store.bounds.top + 10 && mouse.is_hovering.y < store.bounds.top + store.bounds.height - 10) {
            for (let card of cards) {
                let x = card.x_spring.position - store.size / 2
                let w = store.size
                if (x < mouse.is_hovering.x && mouse.is_hovering.x < x + w) {
                    card.hovering = true
                }
            }
        }

        if (mouse.is_just_down) {
            for (let card of cards) {
                let x = card.x_spring.position - store.size / 2
                let w = store.size
                if (x < mouse.is_just_down.x && mouse.is_just_down.x < x + w) {
                    card.dragging = true
                    card.x_spring.target = mouse.is_just_down.x
                    break
                }
            }
        }

        if (mouse.is_just_up) {
            for (let card of cards) {
                if (card.dragging) {
                    card.dragging = false
                    card.x_spring.target = store.bounds.slots[card.target_slot]

                    props.onSortOrder([cards[0].target_slot, cards[1].target_slot, cards[2].target_slot])
                    break
                }
            }
        }

        let has_dragging = cards.find(_ => _.dragging)


        if (has_dragging) {
            for (let card of cards) {
                if (card === has_dragging) continue

                let dist_to_source = Math.abs(store.bounds.slots[has_dragging.target_slot] - has_dragging.x_spring.position)
                let dist_to_target = Math.abs(store.bounds.slots[card.target_slot] - has_dragging.x_spring.position)

                if (dist_to_target < dist_to_source) {
                    has_dragging.empty_slot = has_dragging.target_slot
                    has_dragging.target_slot = card.target_slot

                    card.empty_slot = card.target_slot
                    card.target_slot = has_dragging.empty_slot

                    card.x_spring.target = store.bounds.slots[card.target_slot]
                }
            }
        }

        if (has_dragging) {
            for (let card of cards) {
                if (card !== has_dragging && card.z_index_on_top) {
                    card.z_index_on_top = false
                }
            }
            has_dragging.z_index_on_top = true
        }

        for (let card of cards) {
            if (card.dragging) {
                card.x_spring.target = mouse.is_hovering.x
                card.x_spring.position = lerp(card.x_spring.position, card.x_spring.target, 0.5)
            }
        }

        updateMouse(mouse)

        updateTransform()
        updateClasses()
    }

    const setBounds = (rect: DOMRect) => {

        let gap = rect.width * 0.01

        let a = 0, b = 0, c = 0

        let width = (rect.width - gap * 4) / 3

        let x = rect.width / 2

        a = x - width - gap
        b = x
        c = x + width + gap

        let slots = [a, b, c]

        setStore(store => {
            store.size = width
            cards[0].x_spring.target = slots[cards[0].target_slot]
            cards[1].x_spring.target = slots[cards[1].target_slot]
            cards[2].x_spring.target = slots[cards[2].target_slot]
            store.bounds = { top: rect.top, left: rect.left, width: rect.width, height: rect.height, slots }
        })

        setBoundsMouse(mouse, rect.top, rect.left, rect.width, rect.height)
    }

    const size_px = createMemo(() => `${store.size}px`)
    const layer_height_px = createMemo(() => `calc(${store.size}px + 1em)`)

    let mouse: Mouse
    let loop: () => void

    onSettled(() => {
        mouse = createMouse(sortingLayerRef)

        let observer = new ResizeObserver(() => {
            setBounds(sortingLayerRef.getBoundingClientRect())
        })

        observer.observe(sortingLayerRef)
        setBounds(sortingLayerRef.getBoundingClientRect())

        loop = createLoop(updateCards)


        return () => {
            loop()
            observer.unobserve(sortingLayerRef)
            observer.disconnect()
        }
    })

    const cardTranslateXY = (i: number) => `translateY(-50%) translateX(calc(-50% + ${cards[i].x_spring.position}px))`

    const updateTransform = () => {
        oneRef.style.transform = cardTranslateXY(0)
        twoRef.style.transform = cardTranslateXY(1)
        threeRef.style.transform = cardTranslateXY(2)
    }

    const cardClasses = (i: number) => {
        let res = new Map([
            ['dragging', cards[i].dragging],
            ['z-index-on-top', cards[i].z_index_on_top],
            ['hovering', cards[i].hovering]
        ])

        return res
    }

    function updateCardClasses(ref: HTMLDivElement, classes: Map<string, boolean>) {
        for (let [klass, value] of classes.entries()) {
            if (value) {
                if (!ref.classList.contains(klass)) {
                    ref.classList.add(klass)
                }
            } else {
                if (ref.classList.contains(klass)) {
                    ref.classList.remove(klass)
                }
            }
        }
    }
    const updateClasses = () => {
        updateCardClasses(oneRef, cardClasses(0))
        updateCardClasses(twoRef, cardClasses(1))
        updateCardClasses(threeRef, cardClasses(2))
    }

    let sortingLayerRef!: HTMLDivElement

    let aRef = (i: number) => i === 0 ? oneRef : i === 1 ? twoRef : threeRef
    let oneRef!: HTMLDivElement
    let twoRef!: HTMLDivElement
    let threeRef!: HTMLDivElement

    return (<>
        <div ref={sortingLayerRef} class='sorting-layer' style={{ height: layer_height_px() }}>
            <div ref={oneRef} class='position one' style={{ height: size_px(), width: size_px() }}>
                <Chessboard fen={props.fens[0]} />
            </div>
            <div ref={twoRef} class='position two' style={{ height: size_px(), width: size_px() }}>
                <Chessboard fen={props.fens[1]} />
            </div>
            <div ref={threeRef} class='position three' style={{ height: size_px(), width: size_px() }}>
                <Chessboard fen={props.fens[2]} />
            </div>
        </div>
    </>)
}