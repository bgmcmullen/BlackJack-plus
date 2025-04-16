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

// Request target score form server
export function handleGetTargetScore(
  setMessageQueue: React.Dispatch<React.SetStateAction<string[]>>
) {
  const message = JSON.stringify({
    type: "get_target_score",
    payload: "",
  });
  setMessageQueue((prevMessageQueue) => [...prevMessageQueue, message]);
}

// Send player's name to server
export function handleChangeName(
  event: ChangeEvent<HTMLInputElement>,
  dispatch: Dispatch<Action>
) {
  dispatch({ type: "SET_NAME", payload: event.target.value });
}

export function submitNameAndStartGame(
  event: FormEvent<HTMLFormElement>,
  dispatch: Dispatch<Action>,
  state: StateType,
  setMessageQueue: React.Dispatch<React.SetStateAction<string[]>>,
) {
  event.preventDefault();


  // Hide submit name button
  dispatch({ type: "SET_NAME_BUTTON_DISABLED", payload: true });

  // Show game control buttons
  dispatch({ type: "SET_GAME_BUTTONS_DISABLED", payload: false });

  dispatch({ type: "SET_SHOW_NAME_INPUT", payload: false});

  // Submit name to server
  const nameMessage = JSON.stringify({
    type: "set_name",
    payload: state.name,
  });

  setMessageQueue((prevMessageQueue) => [...prevMessageQueue, nameMessage]);

  // Tell server to run the game
  const runMessage = JSON.stringify({
    type: "run",
    payload: "",
  });

  setMessageQueue((prevMessageQueue) => [...prevMessageQueue, runMessage]);
}

// Draw new card
export function handleTakeACard(
  setMessageQueue: React.Dispatch<React.SetStateAction<string[]>>
) {
  const takeCardMessage = JSON.stringify({
    type: "take_a_card",
    payload: "",
  });
  setMessageQueue((prevMessageQueue) => [...prevMessageQueue, takeCardMessage]);
}

// Tell server player has chosen to stand (not take another card)
export function handleStand(
  setMessageQueue: React.Dispatch<React.SetStateAction<string[]>>
) {
  const standMessage = JSON.stringify({
    type: "stand",
    payload: "",
  });
  setMessageQueue((prevMessageQueue) => [...prevMessageQueue, standMessage]);
}