import { createMemo, createSignal, createStore, onSettled } from 'solid-js'
import './SortChess3.scss'
import { Chessboard } from './Chessboard'
import { INITIAL_FEN } from 'chessops/fen'
import { createLoop, makeSpring, Spring, updateSpring } from './loop'
import { update as updateMouse, createMouse, Mouse } from './mouse'

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

export default function SortChess3() {
    const [store, setStore] = createStore({
        size: 0,
        cards: [makeCard(0, 0), makeCard(1, 0), makeCard(2, 0)],
        bounds: { top: 0, left: 0, width: 0, height: 0, slots: [0, 0, 0] }
    })


    function updateStore(dt: number) {
        setStore(store => {
            for (let card of store.cards) {
                updateSpring(card.x_spring, dt / 1000)
            }

            for (let card of store.cards) {
                card.hovering = false
            }

            if (mouse.is_hovering.y > store.bounds.top + 10 && mouse.is_hovering.y < store.bounds.top + store.bounds.height - 10) {
                for (let card of store.cards) {
                    let x = card.x_spring.position - store.size / 2
                    let w = store.size
                    if (x < mouse.is_hovering.x && mouse.is_hovering.x < x + w) {
                        card.hovering = true
                    }
                }
            }

            if (mouse.is_just_down) {
                for (let card of store.cards) {
                    if (card.hovering) {
                        card.dragging = true
                        card.x_spring.target = mouse.is_just_down.x
                        break
                    }
                }
            }

            if (mouse.is_just_up) {
                for (let card of store.cards) {
                    if (card.dragging) {
                        card.dragging = false
                        card.x_spring.target = store.bounds.slots[card.target_slot]
                    }
                }
            }

            let has_dragging = store.cards.find(_ => _.dragging)


            if (has_dragging) {
                for (let card of store.cards) {
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
                for (let card of store.cards) {
                    if (card !== has_dragging && card.z_index_on_top) {
                        card.z_index_on_top = false
                    }
                }
                has_dragging.z_index_on_top = true
            }

            for (let card of store.cards) {
                if (card.dragging) {
                    card.x_spring.target = mouse.is_hovering.x
                    card.x_spring.position = lerp(card.x_spring.position, card.x_spring.target, 0.5)
                }
            }
        })

        updateMouse(mouse)
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
            store.cards[0].x_spring.target = a
            store.cards[1].x_spring.target = b
            store.cards[2].x_spring.target = c
            store.bounds = { top: rect.top, left: rect.left, width: rect.width, height: rect.height, slots }
        })
    }

    const size_px = createMemo(() => `${store.size}px`)
    const layer_height_px = createMemo(() => `calc(${store.size}px + 1em)`)

    let mouse: Mouse
    let loop: () => void

    onSettled(() => {
        let observer = new ResizeObserver(() => {
            setBounds(sortingLayerRef.getBoundingClientRect())
        })

        observer.observe(sortingLayerRef)
        setBounds(sortingLayerRef.getBoundingClientRect())

        loop = createLoop(updateStore)

        mouse = createMouse(sortingLayerRef)

        return () => {
            loop()
            observer.unobserve(sortingLayerRef)
            observer.disconnect()
        }
    })

    const translateOne = createMemo(() => `translateY(-50%) translateX(calc(-50% + ${store.cards[0].x_spring.position}px))`)
    const translateTwo = createMemo(() => `translateY(-50%) translateX(calc(-50% + ${store.cards[1].x_spring.position}px))`)
    const translateThree = createMemo(() => `translateY(-50%) translateX(calc(-50% + ${store.cards[2].x_spring.position}px))`)

    let sortingLayerRef!: HTMLDivElement

    return (<>
        <div ref={sortingLayerRef} class='sorting-layer' style={{ height: layer_height_px() }}>
            <div class={['position one', { 'z-index-on-top': store.cards[0].z_index_on_top, dragging: store.cards[0].dragging, hovering: store.cards[0].hovering }]} style={{ height: size_px(), width: size_px(), transform: translateOne() }}>
                <Chessboard fen="" />
            </div>
            <div class={['position two', { 'z-index-on-top': store.cards[1].z_index_on_top, dragging: store.cards[1].dragging, hovering: store.cards[1].hovering }]} style={{ height: size_px(), width: size_px(), transform: translateTwo() }}>
                <Chessboard fen="" />
            </div>
            <div class={['position three', { 'z-index-on-top': store.cards[2].z_index_on_top, dragging: store.cards[2].dragging, hovering: store.cards[2].hovering }]} style={{ height: size_px(), width: size_px(), transform: translateThree() }}>
                <Chessboard fen="" />
            </div>
        </div>
    </>)
}