import { For, Show } from "solid-js";

export default function Hint3Regular(props: { revealed: boolean, hintRevealed: boolean, hints: string[], onRevealed: () => void }) {

    return (<>
        <Show when={!props.revealed}>
            <Show when={props.hintRevealed} fallback={
                <button class='give-hint' onClick={() => props.onRevealed()}>Hint</button>
            }>
                <div class='hints'>
                    <For each={props.hints}>{hint =>
                        <span>{hint}</span>
                    }</For>
                </div>
            </Show>
        </Show>
    </>)
}