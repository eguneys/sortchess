import type { ParentProps } from 'solid-js';
import { Router } from '../router';
import { defineFileRoute } from '@solidjs/router/fs';

// A layout route: pairing users.tsx with the users/ directory nests every
// page inside it under this component.
export default function GamesLayout(props: ParentProps) {
    return (
        <main class='google-sans-flex-450 game-mode-wrap'>
            <nav><a href={Router.paths()}>Back Home</a></nav>
            {props.children}
        </main>
    );
}

