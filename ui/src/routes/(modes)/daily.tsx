import GameInfoCard from "../../components/GameInfoCard";

export default function Story() {
    return (<>
        <div class='info-wrapper'>
            <GameInfoCard date={new Date()} id="abc" />
        </div>
    </>)
}