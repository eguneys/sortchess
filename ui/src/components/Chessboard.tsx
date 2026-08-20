import { Chessground } from "@lichess-org/chessground"
import { createEffect, onSettled } from "solid-js"
import '../assets/chessground/chessground.css'
import '../assets/chessground/maestro.css'
import '../assets/chessground/theme.css'
import './Chessboard.css'
import type { Api } from "@lichess-org/chessground/api"
import type { Config } from "@lichess-org/chessground/config"
import type { Color, Dests, Key } from "@lichess-org/chessground/types"
import type { DrawShape } from "@lichess-org/chessground/draw"
import { square } from "chessops/debug"
import { Square } from "chessops"


type FEN = string
type Move = { from: Square, to: Square }

export function Chessboard(props: { fen: FEN, last_move?: Move, on_wheel?: (_: number) => void, shapes?: DrawShape[] }) {

    let ground: Api

    onSettled(() => {

        let config: Config = {
            fen: props.fen,
            viewOnly: true
        }
        if (props.last_move) {
            config.lastMove = [square(props.last_move.from) as Key, square(props.last_move.to) as Key]
        }
        ground = Chessground($el, config)

        if (props.shapes)
            ground.setShapes(props.shapes)
    })

    createEffect(() => props.shapes, (shapes) => {
        if (!ground) return
        if (shapes) {
            ground.setShapes(shapes)
        } else {
            ground.setShapes([])
        }
    })

    let $el!: HTMLDivElement

    const handle_wheel_event = {
        handleEvent: (e: WheelEvent) => {
            props.on_wheel?.(e.deltaY)
        },
        passive: true
    }

    return (<>
        <div onWheel={handle_wheel_event.handleEvent} ref={$el} class='is2d chessboard-wrap'></div>
    </>)
}