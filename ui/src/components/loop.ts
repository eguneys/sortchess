export function createLoop(update: (dt: number) => void) {
    let is_running = true
    let animationFrameId: number
    const timestep = 1000 / 60
    let last_time = performance.now()
    let accumulator = 0

    function step(current_time: number) {
        if (!is_running) return
        animationFrameId = requestAnimationFrame(step)


        let delta_time = Math.min(current_time - last_time, 25)
        last_time = current_time

        accumulator += delta_time

        while (accumulator >= timestep) {
            update(timestep)
            accumulator -= timestep
        }

        //render(accumulator / timestep)
    }
    animationFrameId = requestAnimationFrame(step)


    return () => {
        is_running = false
        cancelAnimationFrame(animationFrameId)
    }
}

export function updateSpring(self: Spring, dt: number) {
    const force = (self.target - self.position) * self.stiffness - self.velocity * self.damping;
    self.velocity += force * dt;
    self.position += self.velocity * dt;
}

export type Spring = { position: number, target: number, velocity: number, stiffness: number, damping: number }

export const makeSpring = (x: number, stiffness: number, damping: number): Spring => {
    return {
        position: x,
        target: x,
        velocity: 0,
        stiffness,
        damping
    }
}