import { query, RouteDefinition, RouteProps } from "@solidjs/router";
import GameInfoCard from "../../../components/GameInfoCard";
import { createMemo } from "solid-js";
import './Regular.scss'
import SortChess3 from "../../../components/SortChess3";


const getRegular = query(async (id: string) => {
    const origin = location.origin;
    const response = await fetch(new URL('/games/regular.json', origin));
    const users: Record<string, { name: string; title: string }> =
        await response.json();
    return users[id] ?? null
}, 'regular');

export const route = {
    preload: ({ params }) => void getRegular(params.id!),
} satisfies RouteDefinition;

export default function Regular(props: RouteProps<'/games/regular/:id'>) {
    const game = createMemo(() => getRegular(props.params.id));
    return (<>
        <div class='info-wrapper'>
            <GameInfoCard title="Regular Sort Chess 3" date={new Date()} id={props.params.id} />
        </div>
        <div class='slide-wrapper'>
            <SortChess3 />
        </div>
        <div class='actions'>
            <p>Sort positions by how much white is better.</p>
            <button>Submit</button>
        </div>
    </>)
}