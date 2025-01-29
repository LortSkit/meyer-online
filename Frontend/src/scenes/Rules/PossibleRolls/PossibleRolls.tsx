import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { RollWithName } from "../../../utils/diceUtils";
import {
  translateBoring1,
  translateBoring2,
  translateCheers1,
  translateCheers2,
  translateLittleMeyer,
  translateMeyer1,
  translateMeyer2,
  translateMeyer3,
  translateMeyerBold,
  translatePairs1,
  translatePairs2,
} from "../../../utils/lang/Rules/PossibleRolls/langPossibleRolls";
import RollTypography from "./RollTypography";
import TextTypography from "./TextTypography";
import RowComponent from "./RowComponent";
import PossibleRollsIntro from "./PossibleRollsIntro";

interface Props {
  isDanish: boolean;
}

const PossibleRolls = ({ isDanish }: Props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const diceSizeSpecial = 20;
  const diceSizePair = 18;
  const diceSizeBoring = 16;
  const diceSpace = "8px";
  const space = "2px";

  return (
    <>
      <PossibleRollsIntro isDanish={isDanish} />
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        borderColor={colors.primary[800]}
        border={`3px solid ${colors.blackAccent[200]}`}
      >
        {/* ROW 1 */}
        <RowComponent
          //ROW 1 COLUMN 1
          leftChild={
            <RollTypography>
              <RollWithName
                isDanish={isDanish}
                roll={32}
                color={colors.blueAccent[100]}
                sideLength={diceSizeSpecial}
              />
            </RollTypography>
          }
          //ROW 1 COLUMN 2
          rightChild={
            <TextTypography
              children={
                <>
                  {translateCheers1(isDanish)}
                  <br />
                  {translateCheers2(isDanish)}
                </>
              }
            />
          }
        />
        <Box paddingTop={space} />

        {/* ROW 2 */}
        <RowComponent
          //ROW 2 COLUMN 1
          leftChild={
            <RollTypography>
              <RollWithName
                isDanish={isDanish}
                roll={21}
                color={colors.blueAccent[100]}
                sideLength={diceSizeSpecial}
              />
            </RollTypography>
          }
          //ROW 2 COLUMN 2
          rightChild={
            <TextTypography
              children={
                <>
                  {translateMeyer1(isDanish)}
                  <strong>{translateMeyerBold(isDanish)}</strong>
                  {translateMeyer2(isDanish)}
                  <br />
                  <br />
                  {translateMeyer3(isDanish)}
                </>
              }
            />
          }
        />
        <Box paddingTop={space} />

        {/* ROW 3 */}
        <RowComponent
          //ROW 3 COLUMN 1
          leftChild={
            <RollTypography>
              <RollWithName
                isDanish={isDanish}
                roll={31}
                color={colors.blueAccent[100]}
                sideLength={diceSizeSpecial}
              />
            </RollTypography>
          }
          //ROW 3 COLUMN 2
          rightChild={
            <TextTypography children={<>{translateLittleMeyer(isDanish)}</>} />
          }
        />
        <Box paddingTop={space} />

        {/* ROW 4 */}
        <RowComponent
          //ROW 4 COLUMN 1
          wrapLeft
          leftChild={[66, 55, 44, 33, 22, 11].map((roll) => (
            <Box display="flex" justifyContent="center" key={roll}>
              <RollTypography>
                <RollWithName
                  isDanish={isDanish}
                  roll={roll}
                  color={colors.blueAccent[100]}
                  sideLength={diceSizePair}
                />
              </RollTypography>

              <Box paddingLeft={diceSpace} />
            </Box>
          ))}
          //ROW 4 COLUMN 2
          rightChild={
            <TextTypography
              children={
                <>
                  {translatePairs1(isDanish)}
                  <br />
                  {translatePairs2(isDanish)}
                </>
              }
            />
          }
        />
        <Box paddingTop={space} />

        {/* ROW 5 */}
        <RowComponent
          //ROW 5 COLUMN 1
          wrapLeft
          leftChild={[65, 64, 63, 62, 61, 54, 53, 52, 51, 43, 42, 41].map(
            (roll) => (
              <Box display="flex" justifyContent="center" key={roll}>
                <RollTypography>
                  <RollWithName
                    isDanish={isDanish}
                    roll={roll}
                    color={colors.blueAccent[100]}
                    sideLength={diceSizeBoring}
                  />
                </RollTypography>

                <Box paddingLeft={diceSpace} />
              </Box>
            )
          )}
          //ROW 5 COLUMN 2
          rightChild={
            <TextTypography
              children={
                <>
                  {translateBoring1(isDanish)}
                  <br />
                  {translateBoring2(isDanish)}
                </>
              }
            />
          }
        />
      </Box>
    </>
  );
};

export default PossibleRolls;
