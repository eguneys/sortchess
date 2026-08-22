import GameInfoCard from "../../components/GameInfoCard";

export default function Countdown() {
    return (<>
        <div class='info-wrapper'>
            <GameInfoCard date={new Date()} id="abc" />
        </div>
        <h1 class='text-grey flex-col-center'>Coming Soon</h1>
    </>)
}