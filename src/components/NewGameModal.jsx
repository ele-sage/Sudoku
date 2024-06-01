import { useState } from "react";
import ReactModal from "react-modal";
import "../css/modal.css";
import Sudoku from "../utils/sudoku";

const DIFFICULTY = new Map([
  ["easy", 40],
  ["medium", 50],
  ["hard", 60],
]);

const DifficultyButtons = ({ onDifficultyClick }) => {
  return Array.from(DIFFICULTY).map(([key, value]) => (
    <button
      key={key}
      className="button-google"
      onClick={() => onDifficultyClick(value)}
    >
      {key}
    </button>
  ));
};

const NewGame = ({ setSudoku }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button className="button-google" onClick={() => setShowModal(true)}>
        New Grid
      </button>
      <ReactModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Select Difficulty"
        className="ReactModal__Content"
        overlayClassName="ReactModal__Overlay"
        ariaHideApp={false}
      >
        <h3>Select Difficulty</h3>
        <DifficultyButtons
          onDifficultyClick={(numToRemove) => {
            setSudoku(new Sudoku(numToRemove));
            setShowModal(false);
          }}
        />
        <div className="align-right">
          <button className="button-google" onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </div>
      </ReactModal>
    </>
  );
};

export default NewGame;
