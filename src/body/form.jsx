import React, { useState } from "react";
import "./body.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const Form = () => {
  const [inputText, setInputText] = useState("");
  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handlePredictClick = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error("Error predicting stress");
      }

      const result = await response.json();
      setPrediction(result.result);
      setError("");
      setOpen(true);
    } catch (error) {
      console.error(error);
      setError("Error predicting stress");
    }
  };

  const handleClosePopup = () => {
    setOpen(false);
  };

  return (
    <div>
      <h1>Enter your prompt text here</h1>
      <div>
        <textarea
          id="textArea"
          value={inputText}
          onChange={handleInputChange}
          rows={15}
          cols={80}
        >
          Write something
        </textarea>
      </div>
      <button className="button" onClick={handlePredictClick}>
        Predict
      </button>
      <Popup
        open={open}
        onClose={handleClosePopup}
        position="top center"
      >
        <div style={{ textAlign: "center" }}>
          {prediction && prediction === 'Stress' ? (
            <p style={{ fontSize: "40px", color: "red" }}>
              {prediction + "😥"}
            </p>
          ) : <p style={{ fontSize: "40px", color: "green" }}>
          {prediction + "🙂"}
          </p>}
          {error && <p style={{ fontSize: "40px", color: "red" }}>{error}</p>}
        </div>
        <div className="modal">
          <div className="actions">
            <button
              className="button"
              onClick={() => {
                console.log("modal closed");
                handleClosePopup();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Form;
