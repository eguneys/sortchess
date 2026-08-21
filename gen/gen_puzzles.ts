import fs from 'fs'

type FenEval = { fen: string, cp_eval: number }

let data: FenEval[] = JSON.parse(fs.readFileSync('data/fen_evals.json').toString())

const Advantages = ['winning', 'big_advantage', 'slight_advantage', 'equal']

type Advantage = typeof Advantages[number]

type Color = 'white' | 'black'

type Range = {
    advantage: Advantage
    color: Color
    min: number
    max: number
}

function advantageRange(
    advantage: Advantage,
    color: Color
): Range {
    const ranges: Record<Advantage, [number, number]> = {
        winning: [350, 500],
        big_advantage: [250, 300],
        slight_advantage: [150, 200],
        equal: [0, 90],
    } as const

    const [a, b] = ranges[advantage]

    if (color === 'white') {
        return { advantage, color, min: a, max: b }
    }

    return { advantage, color, min: -b, max: -a }
}

let ranges = [...Advantages.map(advantage => advantageRange(advantage, 'white')),
...Advantages.map(advantage => advantageRange(advantage, 'black'))]

let ranged_evals: FenEval[][] = ranges.map(_ => [])

for (let sample of data) {
    let range = ranges.findIndex(_ => _.min <= sample.cp_eval && sample.cp_eval < _.max)
    let range2 = ranges.findLastIndex(_ => _.min <= sample.cp_eval && sample.cp_eval < _.max)

    if (range !== -1) {
        ranged_evals[range].push(sample)

        if (range2 !== range) {
            ranged_evals[range2].push(sample)
        }
    }
}

let binned_evals: FenEval[][][] =
    ranged_evals.map((evals, i) => Bin_Evals(evals, ranges[i]))

function Bin_Evals(evals: FenEval[], range: Range): FenEval[][] {

    let nb_bins = 4
    let res: FenEval[][] = [...Array(nb_bins).keys()].map(_ => [])

    for (let e of evals) {
        let t = (e.cp_eval - range.min) / (range.max - range.min)

        let index = Math.floor(t * nb_bins)

        if (!e.fen.includes('w')) {
            continue
        }

        res[index].push(e)
    }

    for (let j = 0; j < res.length; j++) {
        if (res[j].length < 100) {
            throw `Empty bin exception ${range.advantage} for ${range.color}`
        }

        res[j] = res[j].slice(0, 200)
    }

    return res
}


let binned_evals_with_ranges = { ranges, binned_evals }

fs.writeFileSync('data/binned_evals_with_ranges.json', JSON.stringify(binned_evals_with_ranges))