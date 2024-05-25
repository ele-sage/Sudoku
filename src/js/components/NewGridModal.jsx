import { useState } from "react";
import ReactModal from "react-modal";
import "../../css/modal.css";

const DIFFICULTY = new Map([
  ["easy", 40],
  ["medium", 50],
  ["hard", 60],
]);

function DifficultyButtons({ onDifficultyClick }) {
  return Array.from(DIFFICULTY).map(([key, value]) => (
    <button
      key={key}
      className="button-google"
      onClick={() => onDifficultyClick(value)}
    >
      {key}
    </button>
  ));
}

export default function NewGrid({ onCreate }) {
  const [showModal, setShowModal] = useState(false);

  const difficultyClick = (numToRemove) => {
    onCreate(numToRemove);
    setShowModal(false);
  };

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
        <DifficultyButtons onDifficultyClick={difficultyClick} />
        <div className="align-right">
          <button className="button-google" onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </div>
      </ReactModal>
    </>
  );
}
