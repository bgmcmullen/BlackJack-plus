import { FormEvent, ChangeEvent } from "react";
import { Dispatch } from "react";
import initialState from "./initialState";
import Action from "./Action";
import CardsState from "./CardsState";
import createDeckCoordinates from './createDeckCoordinates';

interface PlaySoundFunction {
  (sound: HTMLAudioElement, delay?: number): void;
}

type StateType = typeof initialState;

export function handleRestart(
  state: StateType,
  playSound: PlaySoundFunction,
  dispatch: Dispatch<Action>,
  setCards: React.Dispatch<React.SetStateAction<CardsState>>,
  setUp: () => void,
  shuffleSound: HTMLAudioElement,
  reset: (dispatch: Dispatch<Action>, setCards: React.Dispatch<React.SetStateAction<CardsState>>) => void
) {
  state.socket?.close();
  playSound(shuffleSound);
  createDeckCoordinates(dispatch);
  reset(dispatch, setCards);
  setUp();
}

export function handleGetInstructions(
  setMessageQueue: React.Dispatch<React.SetStateAction<string[]>>
) {
  const message = JSON.stringify({
    type: "get_instructions",
    payload: "",
  });
  setMessageQueue((prevMessageQueue) => [...prevMessageQueue, message]);
}

export function handleChangeName(
  event: ChangeEvent<HTMLInputElement>,
  dispatch: Dispatch<Action>
) {
  dispatch({ type: "SET_NAME", payload: event.target.value });
}

export function handleSubmitName(
  event: FormEvent<HTMLFormElement>,
  dispatch: Dispatch<Action>,
  state: StateType,
  setMessageQueue: React.Dispatch<React.SetStateAction<string[]>>,
  backgroundMusicPlaying: boolean,
  setBackgroundMusicPlaying: React.Dispatch<React.SetStateAction<boolean>>
) {
  event.preventDefault();
  if (!backgroundMusicPlaying) setBackgroundMusicPlaying(true);
  dispatch({ type: "SET_NAME_BUTTON_DISABLED", payload: true });

  const nameMessage = JSON.stringify({
    type: "set_name",
    payload: state.name,
  });

  setMessageQueue((prevMessageQueue) => [...prevMessageQueue, nameMessage]);

  const runMessage = JSON.stringify({
    type: "run",
    payload: "",
  });

  setMessageQueue((prevMessageQueue) => [...prevMessageQueue, runMessage]);
}

export function handleTakeACard(
  setMessageQueue: React.Dispatch<React.SetStateAction<string[]>>
) {
  const takeCardMessage = JSON.stringify({
    type: "take_a_card",
    payload: "",
  });
  setMessageQueue((prevMessageQueue) => [...prevMessageQueue, takeCardMessage]);
}

export function handleStand(
  setMessageQueue: React.Dispatch<React.SetStateAction<string[]>>
) {
  const standMessage = JSON.stringify({
    type: "stand",
    payload: "",
  });
  setMessageQueue((prevMessageQueue) => [...prevMessageQueue, standMessage]);
}