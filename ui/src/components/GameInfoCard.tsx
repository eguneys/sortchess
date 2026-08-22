import { createMemo, createProjection, createSignal, createStore, onSettled, Show } from 'solid-js';
import './NavigationDropdown.scss'
import './GameInfoCard.scss'
import { Router } from '../router';
import { useLocation } from '@solidjs/router';

const TitlesByPathname: Record<string, string> = {
    '/': 'Regular Sort Chess 3',
    '/story': 'Story Mode',
    '/risk': 'Risk Mode',
    '/daily': 'Daily Puzzles',
    '/countdown': 'Countdown Mode'
}
type NavigationStoreType = {
    revealed: boolean,
    revealed_anim: boolean,
    futurePathname: string | undefined
}

export function NavigationDropdown() {

    const location = useLocation()
    const locationPathname = createMemo(() => location.pathname)
    const [store, setStore] = createStore<NavigationStoreType>({
        revealed: false,
        revealed_anim: false,
        futurePathname: undefined
    })
    const futureLocationPathname = createMemo(() => store.futurePathname ?? locationPathname())

    const reveal = () => {
        setStore(store => { store.revealed = true })
        setTimeout(() => {
            setStore(store => { store.revealed_anim = true })
        })
    }

    const closeTo = (path: string) => {
        setStore(store => {
            store.revealed_anim = false
            store.revealed = false
            store.futurePathname = path
        })
    }

    onSettled(() => {

        const clickOutsideHandler = (e: PointerEvent) => {
            if (e.target === activeRef || navRef.contains(e.target as HTMLElement)) {
                return
            }
            close()
        }

        document.addEventListener('click', clickOutsideHandler)

        return () => {
            document.removeEventListener('click', clickOutsideHandler)
        }
    })



    let activeRef!: HTMLAnchorElement
    let navRef!: HTMLDivElement

    return (<>
        <div ref={navRef} class='navigation-dropdown'>
            <Show when={store.revealed} fallback={
                <a ref={activeRef} onClick={() => reveal()}>{TitlesByPathname[futureLocationPathname()]}</a>
            }>
                <nav class={{ reveal: store.revealed_anim }}>
                    <div class='inner-flow'>
                        <a onClick={() => closeTo(Router.paths().toString())} class={{ active: Router.paths().toString() === locationPathname() }} href={Router.paths()}>Regular Sort Chess 3</a>
                        ·
                        <a onClick={() => closeTo(Router.paths.story.toString())} class={{ active: Router.paths.story.toString() === locationPathname() }} href={Router.paths.story}>Story Mode</a>
                        ·
                        <a onClick={() => closeTo(Router.paths.risk.toString())} class={{ active: Router.paths.risk.toString() === locationPathname() }} href={Router.paths.risk}>Risk Mode</a>
                        ·
                        <a onClick={() => closeTo(Router.paths.daily.toString())} class={{ active: Router.paths.daily.toString() === locationPathname() }} href={Router.paths.daily}>Daily Puzzles</a>
                        ·
                        <a onClick={() => closeTo(Router.paths.countdown.toString())} class={{ active: Router.paths.countdown.toString() === locationPathname() }} href={Router.paths.countdown}>Countdown Mode</a>
                    </div>
                </nav>
            </Show>
        </div>
    </>)
}

export default function GameInfoCard(props: { date: Date, id?: string }) {
    return (<>
        <div class='game-info-card'>
            <NavigationDropdown />
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