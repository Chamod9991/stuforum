import { motion } from "framer-motion";

const NavContext = ({ show, onLogout }) => {
  return (
    <div>
      <div
        className={"context-content" + (show ? " shown" : "")}
        style={{
          minWidth: "120px",
          marginLeft: "90%",
          marginTop: "5%",
        }}
      >
        <ul
          style={{
            listStyleType: "none",
          }}
        >
          <div>
            <motion.button
              className="nullBtn"
              style={{
                width: "100%",
           
                margin: 0,
                padding: 0,
              }}
              whileHover={{
                x: -3,
              }}
            >
              <a
                style={{
                  float: "right",
                  cursor: "pointer",
                  width: "100%",
                  margin: 0,
                  padding: 0,
                }}
                href={"/profile"}
              >
                <li style={{ color: "var(--gray)", textAlign: "right", marginBottom: -5 }}>
                  Profile
                </li>
              </a>
            </motion.button>
            <hr style={{ width: "75%", marginLeft: 18, marginTop: 0 }} />
            <motion.button
              className="nullBtn"
              style={{ width: "100%", textAlign: "right" }}
              whileHover={{
                x: -3,
              }}
              onClick={onLogout}
            >
              {" "}
              <li style={{ color: "var(--gray)" }}>Logout</li>
            </motion.button>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default NavContext;
