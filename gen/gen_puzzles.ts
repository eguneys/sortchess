import fs from 'fs'

type FenEval = { fen: string cp_eval: number }

let data: FenEval[] = JSON.parse(fs.readFileSync('data/fen_evals.json').toString())


type Advantage = 'winning' | 'big_advantage' | 'slight_advantage' | 'equal'
type Color = 'white' | 'black'

type Range = { advantage: Advantage, color: Color, min: number, max: number }

function advantage_range(advantage: Advantage, color: Color) {
    let sign = color === 'white' ? 1 : -1

    switch (advantage) {
        case 'winning': {
            return { advantage, color, min: sign * 3000, max: sign * 20000 }
        } break
        case 'big_advantage': {
            return { advantage, color, min: sign * 1500, max: sign * 2500 }
        } break
        case 'slight_advantage': {
            return { advantage, color, min: sign * 300, max: sign * 1300 }
        } break
        case 'equal': {
            return { advantage, color, min: -sign * 300, max: +sign * 300 }
        } break
    }
}