import { Title } from '@solidjs/meta';
import { Router } from '../router';
import './Home.scss'
import Footer from '../components/Footer';
import PlaySortChessHeader from '../components/PlaySortChessHeader';

export default function Home() {
  return (
    <main class='home-main google-sans-flex-450'>
      <Title>Sort Chess - Hello</Title>
      <PlaySortChessHeader />
      <h2 class='select-game-mode-header'>Select Game Mode:</h2>
      <div class='game-mode-selection-container'>
        <a href={Router.paths.games.story}>Story Mode</a>
        <a href={Router.paths.games.arcade}>Arcade Mode</a>
        <a href={Router.paths.games.regular("aasdf")}>Regular Sort Chess 3</a>
        <a href={Router.paths.games.countdown}>Countdown Sort Chess 3</a>
        <a href={Router.paths.games.gradient4}>Gradient Sort Chess 4</a>
        <a href={Router.paths.games.gradient7}>Gradient Sort Chess 7</a>
        <a href={Router.paths.games.classical}>Classical Sort Chess 3 in 8</a>
        <a href={Router.paths.games.classical6}>Classical Gradient Sort Chess 6 in 8</a>
      </div>
      <h2 class='select-game-mode-header'>Profile:</h2>
      <div class='profile-container'>
        <Profile />
      </div>
      <Footer />
    </main>
  );
}


function Profile() {
  return (<>
    <div class='profile'>
      <div class='grid'>
        <span class='header'>Story Mode</span>
        <span class='body'><StoryModeStats /></span>
        <span class='header'>Arcade Mode</span>
        <span class='body'><ArcadeModeStats /></span>
        <span class='header'>Regular Sort Chess 3</span>
        <span class='body'><RegularSortChess3Stats /></span>
        <span class='header'>Countdown Sort Chess 3</span>
        <span class='body'><CountdownSortChess3Stats /></span>
        <span class='header'>Gradient Sort Chess 4</span>
        <span class='body'><GradientSortChess4Stats /></span>
        <span class='header'>Gradient Sort Chess 7</span>
        <span class='body'><GradientSortChess7Stats /></span>
        <span class='header'>Classical Sort Chess 3 in 8</span>
        <span class='body'><ClassicalSortChess3In8Stats /></span>
        <span class='header'>Classical Gradient Sort Chess 6 in 8</span>
        <span class='body'><ClassicalGradientSortChess6in8Stats /></span>
      </div>
    </div>
  </>)
}


function StoryModeStats() {
  return (<>Not yet played</>)
}

function ArcadeModeStats() {
  return (<>Not yet played</>)
}
function RegularSortChess3Stats() {
  return (<>Not yet played</>)
}
function CountdownSortChess3Stats() {
  return (<>Not yet played</>)
}
function GradientSortChess4Stats() {
  return (<>Not yet played</>)
}
function GradientSortChess7Stats() {
  return (<>Not yet played</>)
}
function ClassicalSortChess3In8Stats() {
  return (<>Not yet played</>)
}
function ClassicalGradientSortChess6in8Stats() {
  return (<>Not yet played</>)
}


