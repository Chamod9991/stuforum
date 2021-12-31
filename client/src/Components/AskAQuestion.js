import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import close from "../resources/close.png";
import TagsInput from "./tags/TagsInput";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const AskAQuestion = (props) => {
  axios.defaults.withCredentials = true;
  let navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  const { setQuestionPopup } = props;
  const { questionPopup } = props;

  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const [error, setError] = useState("");

  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setQuestionPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const containerVariants = {
    hidden: {
      scale: 1.05,
      opacity: 0.1,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      transition: { ease: "easeIn" },
    },
  };

  const submitQuestion = (e) => {
    e.preventDefault();
    if (question == "" && description == "") {
      setError("All fields are required.");
    } else if (question == "") {
      setError("Question is required");
    } else if (description == "") {
      setError("Description is required");
    } else {
      const posted_time = moment().format("YYYY-MM-DD HH:mm:ss").toString();

      axios
        .post("http://localhost:3001/addpost", {
          question: question,
          description: description,
          tags: selectedTags,
          user_id: authState.id,
          user_name: authState.name,
          posted_time: posted_time,
          urgent: urgent,
        })
        .then((response) => {
          if (response.data.message == "post_added") {
            setQuestion("");
            setDescription("");
            setSelectedTags();
            setQuestionPopup(false);
            navigate("/home");
          }
        });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setError("");
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overlay">
      <AnimatePresence>
        {questionPopup && (
          <motion.div
            ref={ref}
            className="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div>
              <h2 style={{ display: "inline-block", float: "left" }}>
                Ask a Question
              </h2>
              <span
                style={{ cursor: "pointer", float: "right" }}
                onClick={() => setQuestionPopup(false)}
              >
                <img className="icon" src={close} />
              </span>
            </div>

            <div
              className="whiteContainer"
              style={{ backgroundColor: "var(--blue)", marginBottom: 20 }}
            >
              <p style={{ color: "var(--primary)", lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600, color: "var(--primary)" }}>
                  Tips on getting good answers quickly
                </span>
                <br />
                &emsp;- Make sure your question has not been asked already
                <br />
                &emsp;- Keep your question short and to the point
                <br />
                &emsp;- Double check grammar and spelling
              </p>
            </div>
            <h4>{authState.name} is asking...</h4>
            <div className="form-control" style={{ marginBottom: 30 }}>
              <input
                type="text"
                style={{ width: "100%", marginLeft: 0 }}
                placeholder="Ask your question"
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                }}
              />
            </div>
            <div className="form-control" style={{ marginBottom: 30 }}>
              <textarea
                className="txtArea"
                placeholder="Describe briefly what you want to know"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
            <div className="form-control" style={{ marginBottom: 30 }}>
              <TagsInput setSelectedTags={setSelectedTags} />
            </div>

            <div style={{ display: "flex", width: "100%" }}>
              <div className="check-field" style={{ marginTop: 15 }}>
                <input id="my-check" type="checkbox" />
                <label
                  htmlFor="my-check"
                  style={{ fontSize: 18 }}
                  checked={urgent}
                  value={urgent}
                  onChange={(e) => setUrgent(e.currentTarget.checked)}
                >
                  Mark as urgent
                </label>
              </div>
              <div
                id="error"
                className={error == "" ? "error" : "error active"}
                style={{
                  margin: "8px auto 300px 400px",
                }}
              >
                {error}
              </div>
              <span
                style={{ float: "right", marginBottom: 60, marginLeft: 10 }}
              >
                <button
                  style={{ width: "100%" }}
                  className="btn btn-block"
                  onClick={submitQuestion}
                >
                  Ask it
                </button>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AskAQuestion;
