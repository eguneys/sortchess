export type Vec2 = { x: number, y: number }

export type Mouse = {
    bounds: { top: number, left: number, width: number, height: number }
    is_just_down: Vec2 | undefined
    is_hovering: Vec2
    is_just_up: Vec2 | undefined
}

export function createMouse(canvas: HTMLElement): Mouse {
    let self = {
        bounds: { top: 0, left: 0, width: 0, height: 0 },
        is_just_down: undefined,
        is_hovering: { x: 0, y: 0 },
        is_just_up: undefined,
        onCleanup,
    }
    function onCleanup() {

        canvas.removeEventListener('pointerdown', onDown)
        canvas.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup', onUp)
    }

    const normalize = (self: Mouse, x: number, y: number) => {
        return { x: (x - self.bounds.left), y: (y - self.bounds.top) }
    }

    const on_down = (self: Mouse, x: number, y: number) => {
        self.is_just_down = normalize(self, x, y)
    }

    const on_move = (self: Mouse, x: number, y: number) => {
        self.is_hovering = normalize(self, x, y)
    }


    const on_up = (self: Mouse, x: number, y: number) => {
        self.is_just_up = normalize(self, x, y)
    }

    const onDown = (e: PointerEvent) => {
        canvas.setPointerCapture(e.pointerId)
        on_down(self, e.clientX, e.clientY)
    }
    const onMove = (e: PointerEvent) => on_move(self, e.clientX, e.clientY)
    const onUp = (e: PointerEvent) => on_up(self, e.clientX, e.clientY)

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)

    return self
}
export const update = (self: Mouse) => {
    self.is_just_down = undefined
    self.is_just_up = undefined
}

export function setBounds(self: Mouse, top: number, left: number, width: number, height: number) {
    self.bounds = { top, left, width, height }
    self.is_hovering = { x: width / 2, y: height / 2 }
}