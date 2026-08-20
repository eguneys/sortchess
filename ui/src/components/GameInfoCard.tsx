import { Show } from 'solid-js';
import './GameInfoCard.scss'
import { Router } from '../router';

export default function GameInfoCard(props: { title: string, date: Date, id?: string }) {
    return (<>
        <div class='game-info-card'>
            <p class='title'>{props.title}</p>
            <p class='date'>{formatDateTime(props.date)}</p>
            <Show when={props.id}>{id =>
                <>#{id()}</>
            }</Show>
        </div>
    </>)

}

export function formatDateTime(date = new Date()): string {
    const datePart = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);

    const timePart = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);

    return `${datePart.toUpperCase()} · ${timePart}`;
}