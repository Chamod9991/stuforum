const Tag = ({ tag, tagOnly }) => {
  return (
    <>
      <span
        style={{
          display: "flex",
          float: tagOnly && "left",
          marginBottom: tagOnly ? 0 : 0,
          marginTop: 10,
          marginRight: tagOnly && 10,
        }}
      >
        <a
          href={`/tagged/${tag.name}`}
          className="tag"
          style={{ fontSize: tagOnly && 14 }}
        >
          {tag.name}
        </a>
        {!tagOnly && (
          <h3 style={{ color: "var(--secondary)", marginLeft: 15 }}>
            {tag.frequency}
          </h3>
        )}
      </span>
    </>
  );
};

export default Tag;
