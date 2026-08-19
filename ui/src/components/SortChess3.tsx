import { createMemo, createSignal, onSettled } from 'solid-js'
import './SortChess3.scss'

export default function SortChess3() {

    const [bounds, setBounds] = createSignal<DOMRect | undefined>(undefined)
    const translateXes = createMemo(() => {
        let bb = bounds()
        if (!bb) { return [0, 0, 0] }

        let gap = bb.width * 0.01

        let a = 0, b = 0, c = 0

        let x = bb.width / 2

        a = x - size() - gap
        b = x
        c = x + size() + gap

        return [a, b, c]
    })

    const size = createMemo(() => {

        let bb = bounds()
        if (!bb) { return '0px' }

        let gap = bb.width * 0.01

        let width = (bb.width - gap * 4) / 3

        return width;
    })

    const size_px = createMemo(() => `${size()}px`)


    onSettled(() => {
        let observer = new ResizeObserver(() => {
            setBounds(sortingLayerRef.getBoundingClientRect())
        })

        observer.observe(sortingLayerRef)
        setBounds(sortingLayerRef.getBoundingClientRect())
        return () => {
            observer.unobserve(sortingLayerRef)
            observer.disconnect()
        }
    })

    const translateOne = createMemo(() => `translateX(calc(-50% + ${translateXes()[0]}px))`)
    const translateTwo = createMemo(() => `translateX(calc(-50% + ${translateXes()[1]}px))`)
    const translateThree = createMemo(() => `translateX(calc(-50% + ${translateXes()[2]}px))`)

    let sortingLayerRef!: HTMLDivElement

    return (<>
        <div class='sort-chess-3'>
            <div ref={sortingLayerRef} class='sorting-layer'>
                <div class='position one' style={{ height: size_px(), width: size_px(), transform: translateOne() }}>A</div>
                <div class='position two' style={{ height: size_px(), width: size_px(), transform: translateTwo() }}>B</div>
                <div class='position three' style={{ height: size_px(), width: size_px(), transform: translateThree() }}>C</div>
            </div>
        </div>
    </>)
}