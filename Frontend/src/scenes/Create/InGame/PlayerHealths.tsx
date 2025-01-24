import PlayersHealthsDisplay from "../../../components/game/PlayersHealthsDisplay";

interface Props {
  isDanish: boolean;
  currentHealths: number[];
  currentPlayer: number;
  isGameOver: boolean;
}

const PlayerHealths = ({
  isDanish,
  currentHealths,
  currentPlayer,
  isGameOver,
}: Props) => {
  return (
    <PlayersHealthsDisplay
      isDanish={isDanish}
      currentHealths={currentHealths}
      currentPlayer={isGameOver ? undefined : currentPlayer}
      playerNames={undefined}
    />
  );
};

export default PlayerHealths;
