import CardsState from "./CardsState";
import initialState from "./initialState";

type Action =
  | { type: 'SET_STATE'; payload: Partial<typeof initialState> }
  | { type: 'SET_SOCKET'; payload: WebSocket | null }
  | { type: 'SET_SOCKET_OPEN'; payload: boolean }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_TARGET_SCORE'; payload: number}
  | { type: 'SET_SHOW_NAME_INPUT'; payload: boolean }
  | { type: 'SET_CARDS'; payload: CardsState }
  | { type: 'SET_WELCOME_TEXT'; payload: string }
  | { type: 'SET_WINNER_TEXT'; payload: string[] }
  | { type: 'SET_GAME_OVER'; payload: boolean }
  | { type: 'SET_MESSAGE_QUEUE'; payload: string[] }
  | { type: 'SET_RESTART_BUTTON_DISABLED'; payload: boolean }
  | { type: 'SET_NAME_BUTTON_DISABLED'; payload: boolean }
  | { type: 'SET_GAME_BUTTONS_DISABLED'; payload: boolean }
  | { type: 'SET_DECK_COORDINATES'; payload: JSX.Element[] };

export default Action;

