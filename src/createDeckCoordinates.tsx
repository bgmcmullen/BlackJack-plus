import Action from "./Action";

function createDeckCoordinates(dispatch: React.Dispatch<Action>) {
  const newDeckCoordinates = [];
  for (let i = 0; i <= 25; i++) {
    newDeckCoordinates.push(
      <div
        key={i}
        className="card card-back"
        style={{ position: "absolute", right: `${i * 0.3}px`, top: `${i * 0.3}px`, border: "1px solid rgba(0, 0, 0, 0.5)" }}
      ></div>
    );
  }
  dispatch({ type: 'SET_DECK_COORDINATES', payload: newDeckCoordinates}); // Update the state with new coordinates
}

export default createDeckCoordinates;