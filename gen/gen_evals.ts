import fs from 'fs'


let data = fs.readFileSync('data/extracted_part.txt').toString().split('\n').slice(0, -1).map((_: any) => JSON.parse(_))

type FenEval = { fen: string, cp_eval: number }

let result: FenEval[] = data.flatMap((fen_eval: any) => {
    let cp = fen_eval.evals[0].pvs[0].cp
    if (!cp) {
        return []
    }

    return { fen: fen_eval.fen, cp_eval: cp }
})

result.sort((a, b) => a.cp_eval - b.cp_eval)

let result_compact = sampleByMinGap(result, 10)

function sampleByMinGap(sorted: FenEval[], minGap: number): FenEval[] {
    const result: FenEval[] = [];
    let last = -Infinity;
    for (const n of sorted) {
        if (n.cp_eval - last >= minGap) {
            result.push(n);
            last = n.cp_eval;
        }
    }
    return result;
}

fs.writeFileSync('data/fen_evals.json', JSON.stringify(result))
fs.writeFileSync('data/fen_evals_compact.json', JSON.stringify(result_compact))