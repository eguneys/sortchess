import { Title } from '@solidjs/meta';
import type { ParentProps } from 'solid-js';
import PlaySortChessHeader from '../components/PlaySortChessHeader';
import Footer from '../components/Footer';
import GameInfoCard from '../components/GameInfoCard';

// A layout route: pairing users.tsx with the users/ directory nests every
// page inside it under this component.
export default function ModesLayout(props: ParentProps) {
    return (
        <main class='home-main google-sans-flex-450'>
            <Title>Sort Chess - Play Sort Chess</Title>
            <PlaySortChessHeader />

            {props.children}
            <Footer />
        </main>
    );
}

