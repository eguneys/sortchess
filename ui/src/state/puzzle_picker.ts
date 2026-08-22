import { opposite } from "chessops"

export type FenEval = { fen: string, cp_eval: number }
export const Advantages = ['winning', 'big_advantage', 'slight_advantage', 'equal']
export type Advantage = typeof Advantages[number]

export type Color = 'white' | 'black'

export type Range = {
    advantage: Advantage
    color: Color
    min: number
    max: number
}

export function AdvantageOfRange(range: Range) {
    return `${range.advantage} for ${range.color}`
}

export type FenCpEvalAndRange = { fen_cp_eval: FenEval, range: Range }

export const getRegular = async () => {
    const origin = location.origin;
    const response = await fetch(new URL('/games/binned_evals_with_ranges.json', origin));
    const regular: { ranges: Range[], binned_evals: FenEval[][][] } =
        await response.json();
    return regular ?? []
}

export type PuzzlePattern = [Advantage, Advantage, Advantage]
export const PuzzlePatterns: PuzzlePattern[] =
    [
        ['equal', 'equal', 'slight_advantage'],
        ['equal', 'slight_advantage', 'big_advantage'],
        ['slight_advantage', 'slight_advantage', 'big_advantage'],
        ['slight_advantage', 'big_advantage', 'winning'],
        ['equal', 'big_advantage', 'winning'],
    ]

export type ColorPattern = [Color, Color, Color]
export const ColorPatterns: ColorPattern[] =
    [
        ['white', 'white', 'white'],
        ['black', 'black', 'black'],
        ['white', 'black', 'black'],
        ['white', 'white', 'black'],
        ['black', 'black', 'white'],
        ['black', 'white', 'black'],
        ['white', 'black', 'white'],
    ]

export function pickPatterns() {
    let puzzle_pattern = arr_pick(PuzzlePatterns)
    let color_pattern = arr_pick(ColorPatterns)

    // deal breaker
    {
        if (puzzle_pattern[0] === puzzle_pattern[1]) {
            color_pattern[0] = opposite(color_pattern[1])
        }
        if (puzzle_pattern[1] === puzzle_pattern[2]) {
            color_pattern[1] = opposite(color_pattern[2])
        }
        if (puzzle_pattern[0] === puzzle_pattern[2]) {
            color_pattern[0] = opposite(color_pattern[2])
        }
    }


    return { puzzle_pattern, color_pattern }
}

export function arr_pick<A>(array: A[]) {
    return arr_shuffle(array.slice(0))[0]
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
