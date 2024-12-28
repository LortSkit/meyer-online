//Svgs from https://www.svgrepo.com/svg/101041/dice

import { Int32 } from "react-native/Libraries/Types/CodegenTypes";

interface Props {
  color: string;
  sideLength: Int32;
  children: JSX.Element;
}

const DiceIcons = ({ color, sideLength, children }: Props) => {
  return (
    <svg
      fill={color}
      height={`${sideLength}px`}
      width={`${sideLength}px`}
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 485 485"
      xmlSpace="preserve"
    >
      {children}
    </svg>
  );
};

interface DiceXProps {
  color: string;
  sideLength: Int32;
}

export const Dice0 = ({ color, sideLength }: DiceXProps) => (
  <DiceIcons color={color} sideLength={sideLength}>
    <g>
      <path d="M0,0v485h485V0H0z M455,455H30V30h425V455z" />
    </g>
  </DiceIcons>
);

export const Dice1 = ({ color, sideLength }: DiceXProps) => (
  <DiceIcons color={color} sideLength={sideLength}>
    <g>
      <path d="M0,0v485h485V0H0z M455,455H30V30h425V455z" />
      <path d="M242.5,277.5c19.299,0,35-15.701,35-35s-15.701-35-35-35c-19.299,0-35,15.701-35,35S223.201,277.5,242.5,277.5z" />
    </g>
  </DiceIcons>
);

export const Dice2 = ({ color, sideLength }: DiceXProps) => (
  <DiceIcons color={color} sideLength={sideLength}>
    <g>
      <path d="M0,0v485h485V0H0z M455,455H30V30h425V455z" />
      <path d="M118.75,401.25c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S99.451,401.25,118.75,401.25z" />
      <path d="M366.25,153.75c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S346.951,153.75,366.25,153.75z" />
    </g>
  </DiceIcons>
);

export const Dice3 = ({ color, sideLength }: DiceXProps) => (
  <DiceIcons color={color} sideLength={sideLength}>
    <g>
      <path d="M0,0v485h485V0H0z M455,455H30V30h425V455z" />
      <path d="M118.75,401.25c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S99.451,401.25,118.75,401.25z" />
      <path d="M242.5,277.5c19.299,0,35-15.701,35-35s-15.701-35-35-35c-19.299,0-35,15.701-35,35S223.201,277.5,242.5,277.5z" />
      <path d="M366.25,153.75c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S346.951,153.75,366.25,153.75z" />
    </g>
  </DiceIcons>
);

export const Dice4 = ({ color, sideLength }: DiceXProps) => (
  <DiceIcons color={color} sideLength={sideLength}>
    <g>
      <path d="M0,0v485h485V0H0z M455,455H30V30h425V455z" />
      <path d="M118.75,401.25c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S99.451,401.25,118.75,401.25z" />
      <path d="M118.75,153.75c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S99.451,153.75,118.75,153.75z" />
      <path d="M366.25,401.25c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S346.951,401.25,366.25,401.25z" />
      <path d="M366.25,153.75c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S346.951,153.75,366.25,153.75z" />
    </g>
  </DiceIcons>
);

export const Dice5 = ({ color, sideLength }: DiceXProps) => (
  <DiceIcons color={color} sideLength={sideLength}>
    <g>
      <path d="M0,0v485h485V0H0z M455,455H30V30h425V455z" />
      <path d="M118.75,401.25c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S99.451,401.25,118.75,401.25z" />
      <path d="M118.75,153.75c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S99.451,153.75,118.75,153.75z" />
      <path d="M242.5,277.5c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S223.201,277.5,242.5,277.5z" />
      <path d="M366.25,401.25c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S346.951,401.25,366.25,401.25z" />
      <path d="M366.25,153.75c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S346.951,153.75,366.25,153.75z" />
    </g>
  </DiceIcons>
);

export const Dice6 = ({ color, sideLength }: DiceXProps) => (
  <DiceIcons color={color} sideLength={sideLength}>
    <g>
      <path d="M0,0v485h485V0H0z M455,455H30V30h425V455z" />
      <path d="M118.75,401.25c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S99.451,401.25,118.75,401.25z" />
      <path d="M118.75,277.25c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S99.451,277.25,118.75,277.25z" />
      <path d="M118.75,153.75c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S99.451,153.75,118.75,153.75z" />
      <path d="M366.25,401.25c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S346.951,401.25,366.25,401.25z" />
      <path d="M366.25,277.25c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S346.951,277.25,366.25,277.25z" />
      <path d="M366.25,153.75c19.299,0,35-15.701,35-35s-15.701-35-35-35s-35,15.701-35,35S346.951,153.75,366.25,153.75z" />
    </g>
  </DiceIcons>
);
