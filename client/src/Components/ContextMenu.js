import { motion } from "framer-motion";
import { useState } from "react";
import ConfirmPopup from "./ConfirmPopup";

const ContextMenu = ({
  reply,
  post,
  show,
  singlePost,
  onDelete,
  onToggleUrgent,
  onToggleAnswered,
  answerOnly,
}) => {
  const [confirmationPopup, setConfirmationPopup] = useState(false);

  let contextMenuStyling;

  if (reply != null) {
    contextMenuStyling = "56.3%";
    if (reply.replied_to != null) {
      contextMenuStyling = "53%";
    } else if (answerOnly) {
      contextMenuStyling = "35.8%";
    }
  } else {
    if (!singlePost) {
      contextMenuStyling = "32.1%";
    } else {
      contextMenuStyling = "52.7%";
    }
  }

  return (
    <div
      style={{
        marginTop: reply != null ? "-15px" : "",
      }}
    >
      {confirmationPopup && (
        <ConfirmPopup
          confirmationPopup={confirmationPopup}
          setConfirmationPopup={setConfirmationPopup}
          onDelete={onDelete}
          post={post}
          reply={reply}
        />
      )}
      <div
        style={{
          minWidth: reply != null && "80px",
          width: post != null && "190px",
          marginLeft: contextMenuStyling,
        }}
        className={"context-content" + (show ? " shown" : "")}
      >
        <ul
          style={{
            listStyleType: "none",
          }}
        >
          {post != null && (
            <div>
              <motion.button
                className="nullBtn"
                disabled={post.answered == 1 && true}
                onClick={() => {
                  onToggleUrgent(post.id);
                }}
                style={{ width: "100%", textAlign: "right" }}
                whileHover={{
                  x: -3,
                }}
              >
                <li style={{ color: post.answered == 1 && "var(--secondary)" }}>
                  {post.urgent == 1 ? "Unmark as Urgent" : "Mark as Urgent"}
                </li>
              </motion.button>
              <hr style={{ width: "90%", margin: "0 auto" }} />
              <motion.button
                disabled={post.urgent == 1 && true}
                className="nullBtn"
                onClick={() => {
                  onToggleAnswered(post.id);
                }}
                style={{ width: "100%", textAlign: "right" }}
                whileHover={{
                  x: -3,
                }}
              >
                <li style={{ color: post.urgent == 1 && "var(--secondary)" }}>
                  {post.answered == 1
                    ? "Unmark as Answered"
                    : "Mark as Answered"}
                </li>
              </motion.button>
              <hr style={{ width: "90%", margin: "0 auto" }} />
            </div>
          )}
          <motion.button
            className="nullBtn"
            onClick={() => setConfirmationPopup(true)}
            style={{
              width: "100%",
              textAlign: reply != null ? "center" : "right",
            }}
            whileHover={{
              x: -3,
            }}
          >
            <li>Delete</li>
          </motion.button>
        </ul>
      </div>
    </div>
  );
};

export default ContextMenu;
