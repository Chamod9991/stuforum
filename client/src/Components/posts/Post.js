import upArrow from "../../resources/upArrow.png";
import upArrowBlue from "../../resources/upArrow-blue.png";
import downArrow from "../../resources/downArrow.png";
import downArrowRed from "../../resources/downArrow-red.png";
import answers from "../../resources/answers.png";
import time from "../../resources/time.png";
import settings from "../../resources/settings.png";
import { useRef, useEffect, useState, useContext } from "react";
import ReactTooltip from "react-tooltip";
import Tags from "../tags/Tags";
import ContextMenu from "../ContextMenu";
import { motion } from "framer-motion";
import { AuthContext } from "../../helpers/AuthContext";
import moment from "moment";
import axios from "axios";
import { Parser } from "html-to-react";
import { abbreviateNumber } from "../../helpers/AbbreviateNumber";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { PORT } from "../../constants/Port";

const Post = ({
  post,
  tags,
  postPref,
  singlePost,
  commentCount,
  onDelete,
  onToggleUrgent,
  onToggleAnswered,
  viewingQuestions,
  answerOnly,
  socket,
}) => {
  const { width } = useWindowDimensions();
  const { authState } = useContext(AuthContext);

  const [show, setShow] = useState(false);
  const [leads, setLeads] = useState(post.leads);

  const [userVoted, setUserVoted] = useState();
  const [upVoted, setUpVoted] = useState();
  const [downVoted, setDownVoted] = useState();
  const [prefId, setPrefId] = useState(null);

  useEffect(() => {
    if (postPref != null) {
      setPrefId(postPref.id);
      if (postPref.preference == "1") {
        setUserVoted("useful");
        setUpVoted(true);
        setDownVoted(false);
      } else if (postPref.preference == "0") {
        setUserVoted("useless");
        setUpVoted(false);
        setDownVoted(true);
      } else {
        setUserVoted("");
        setUpVoted(false);
        setDownVoted(false);
      }
    } else {
      setPrefId(null);
    }
  }, [postPref]);

  let labelColor;

  if (post.urgent == 1) {
    labelColor = "var(--red)";
  }
  if (post.answered == 1) {
    labelColor = "var(--green)";
  }

  let leadsColor;
  if (userVoted === "useful") {
    if (post.leads >= 0) {
      leadsColor = "var(--primary)";
    } else {
      leadsColor = "var(--secondary)";
    }
  } else if (userVoted === "useless") {
    leadsColor = "var(--red)";
  } else {
    leadsColor = "var(--secondary)";
  }

  const [disabled, setDisabled] = useState(false);
  const updateLeadsPrefs = (leads, pref) => {
    setDisabled(true);
    const time = moment().format("YYYY-MM-DD HH:mm:ss").toString();
    axios
      .post(`${PORT}post/updateleadsprefs`, {
        id: prefId,
        post_id: post.id,
        leads: leads,
        user_id: authState.id,
        pref: pref,
        time: time,
      })
      .then(async (res) => {
        setPrefId(res.data.id);
        const notification = res.data.notif;
        await socket.emit("send_notification", notification);
      });
  };

  const upVote = (e) => {
    e.preventDefault();
    if (downVoted) {
      setLeads(leads + 2);
      setUpVoted(true);
      setDownVoted(false);
      setUserVoted("useful");
      updateLeadsPrefs(2, "1");
    } else {
      if (!upVoted) {
        setLeads(leads + 1);
        setUpVoted(true);
        setUserVoted("useful");
        updateLeadsPrefs(1, "1");
      } else {
        setUserVoted("");
        setLeads(leads - 1);
        setUpVoted(false);
        updateLeadsPrefs(-1, " ");
      }
    }
  };

  const downVote = (e) => {
    e.preventDefault();
    if (upVoted) {
      setLeads(leads - 2);
      setUpVoted(false);
      setDownVoted(true);
      setUserVoted("useless");
      updateLeadsPrefs(-2, "0");
    } else {
      if (!downVoted) {
        setLeads(leads - 1);
        setDownVoted(true);
        setUserVoted("useless");
        updateLeadsPrefs(-1, "0");
      } else {
        setUserVoted("");
        setLeads(leads + 1);
        setDownVoted(false);
        updateLeadsPrefs(1, " ");
      }
    }
  };

  const rotateVariant = {
    rotate: { rotate: -20, transition: { duration: 0.2 } },
    stop: {
      rotate: 20,
    },
  };

  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShow(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const description =
    post.description.length > 600 && !singlePost
      ? post.description.substring(0, 500) + " . . ."
      : post.description;

  const [postedTime, setPostedTime] = useState(
    moment(post.posted_time).local().fromNow()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setPostedTime(moment(post.posted_time).local().fromNow());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <ReactTooltip
        effect="solid"
        place="bottom"
        type="info"
        className="tooltip"
        arrowColor={"var(--secondary)"}
        delayShow={500}
      />
      <div className="posts-container">
        <div className="row">
          <div className="row">
            <div className="col-1">
              <h2
                data-tip="Accumulated leads so far"
                style={{
                  color: leadsColor,
                  textAlign: "center",
                  lineHeight: "30px",
                }}
              >
                {abbreviateNumber(leads)}{" "}
                <i
                  class="bi bi-lightning-charge-fill"
                  style={{
                    fontSize: 16,
                    color: leadsColor,
                  }}
                ></i>
              </h2>
            </div>
            <div className="col">
              <a href={`/post/${post.id}`}>
                <h4>{post.question}</h4>
              </a>

              {(post.urgent == 1 || post.answered == 1) && (
                <span
                  className="label"
                  style={{
                    background: labelColor,
                    marginTop: 2,
                    margin: "0 auto",
                  }}
                >
                  {post.urgent == 1
                    ? "Urgent"
                    : post.answered == 1
                    ? "Answered"
                    : ""}
                </span>
              )}

              <div
                style={{
                  color: "var(--secondary)",
                  fontWeight: 600,
                }}
              >
                Posted by{" "}
                <a
                  href={
                    authState.nick_name == post.nick_name
                      ? "/profile"
                      : `/user/${post.nick_name}`
                  }
                >
                  <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                    {post.nick_name}
                  </span>
                </a>
              </div>
              {tags != null ? <Tags tags={tags} tagOnly={true} /> : <br />}
            </div>
            <div className="col-1" style={{ marginRight: width > 992 && -15 }}>
              {post.user_id == authState.id && (
                <div>
                  <a
                    role="button"
                    id="post-context"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    variants={rotateVariant}
                    // style={{
                    //   display: viewingQuestions || singlePost ? "block" : "none",
                    // }}
                  >
                    <i
                      class="bi bi-gear-fill"
                      style={{ color: "var(--secondary)", fontSize: 22 }}
                    ></i>
                  </a>
                  <ContextMenu
                    post={post}
                    onDelete={onDelete}
                    onToggleUrgent={onToggleUrgent}
                    onToggleAnswered={onToggleAnswered}
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className="row"
            style={{ margin: "0 auto", textAlign: "justify" }}
          >
            {Parser().parse(description)}
          </div>

          <hr style={{ margin: "0px 0 15px 0" }} />

          <div className="hstack" style={{ margin: "-10px 0px -10px 0px" }}>
            <div
              style={{
                display: "flex",
                color: "var(--secondary)",
              }}
            >
              <i
                class="bi bi-clock-fill"
                style={{
                  fontSize: 20,
                  color: "var(--secondary)",
                }}
              ></i>
              <span
                style={{
                  color: "var(--secondary)",
                  marginLeft: 5,
                  marginTop: 2,
                }}
                data-tip={moment(post.posted_time).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )}
              >
                {postedTime}
              </span>
            </div>

            <div className="ms-auto" style={{ display: "flex", marginTop: 5 }}>
              <i
                class="bi bi-chat-left-fill"
                style={{ fontSize: 20, color: "var(--secondary)" }}
              ></i>
              <span
                style={{
                  color: "var(--secondary)",
                  marginLeft: 10,
                }}
              >
                {abbreviateNumber(commentCount || post.comments)}
              </span>
            </div>

            <div className="ms-auto">
              <button
                className="nullBtn"
                onClick={upVote}
                data-tip="Vote as useful"
                disabled={disabled}
              >
                <i
                  class="bi bi-arrow-up-short"
                  style={{
                    fontSize: 36,
                    color:
                      userVoted === "useful"
                        ? "var(--primary)"
                        : "var(--secondary)",
                  }}
                ></i>
              </button>
              <button
                className="nullBtn"
                onClick={downVote}
                data-tip="Vote as not useful"
                disabled={disabled}
              >
                <i
                  class="bi bi-arrow-down-short"
                  style={{
                    fontSize: 36,
                    color:
                      userVoted === "useless"
                        ? "var(--red)"
                        : "var(--secondary)",
                  }}
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
