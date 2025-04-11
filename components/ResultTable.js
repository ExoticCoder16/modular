import React, { useRef, useEffect }  from "react";

const ResultTable = ({ result, gcd,  shouldJump, setShouldJump }) => {
    const remainderRef = useRef(null);

  if (!Array.isArray(result)) {
    return <p>Invalid data format. Expected an array of results.</p>;
  }

  useEffect(() => {
    if ( shouldJump && remainderRef.current) {
      remainderRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      setShouldJump(false); // Reset the flag after jumping
    }
  }, [shouldJump, setShouldJump]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Results</h2>
      <div style={styles.table}>
        {/* Header Row */}
        <div style={{ ...styles.row, fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
          <div style={styles.cell}>Round</div>
          <div style={styles.cell}>Cycle</div>
          <div style={styles.cell}>Net Gain</div>
          <div style={styles.cell}>Accumulated</div>
          <div style={styles.cell}>Remaining from 123</div>
          <div style={styles.cell}>Remainder (mod 45)</div>
          <div style={styles.cell}>Remaining to 45</div>
        </div>

        {/* Data Rows */}
        {result.map((item, index) => {
            const isHighlighted = item.remainder_mod_modular === gcd;
            const isMergedRow = item.isMerged;

            return (

          <React.Fragment key={index}>
            {/* Main Row */}
            {/* <div style={styles.row}> */}
            <div
                ref={isHighlighted ? remainderRef : null}
                style={{
                  ...styles.row,
                //   backgroundColor: isHighlighted ? "#ffeb99" : "transparent", // Highlight if matches gcd_value
                backgroundColor: isHighlighted
                ? "#ffeb99"
                : isMergedRow
                ? "#d9f9d9"
                : "transparent",
              borderLeft: isMergedRow ? "4px solid #33cc33" : "none", // ✅ NEW optional highlight
                }}
              >
              <div style={styles.cell}>{item.round}</div>
              <div style={styles.cell}>{item.cycle}
              {isMergedRow && (
                    <div style={{ fontSize: "11px", color: "#33aa33" }}>[Merged]</div>
                )}
              </div>
              <div style={styles.cell}>{item.net_gain}</div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={styles.cell}>{item.accumulated_value}</div>
                <div style={styles.cellExplanation}>{`(${index > 0 ? result[index - 1].accumulated_value : 0} + ${item.net_gain})`}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={styles.cell}>{item.remaining_from_divisor}</div>
                <div style={styles.cellExplanation}>
                {`(${
                    index > 0
                    ? result[index - 1].remaining_from_divisor === 0
                        ? 123
                        : result[index - 1].remaining_from_divisor
                    : 123
                } - ${item.net_gain})`}
                </div>
              </div>
              <div style={styles.cell}>{item.remainder_mod_modular}</div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={styles.cell}>{item.remaining_to_modular}</div>
                { result[index].remainder_mod_modular > 0 ?
              <div style={styles.cellExplanation}>
                {`(${
                    index > 0 
                    ?
                    result[index].remainder_mod_modular > 0
                        ? `45 - ${item.remainder_mod_modular}`
                        : ""
                    : ""
                })`}
              </div>
              :
              <div style={styles.cell}></div>
            }
              </div>
            </div>
          </React.Fragment>
          );
})}
      </div>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  table: {
    marginTop: 10,
    borderTop: "2px solid black",
    width: "100%",
    textAlign: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
    padding: "10px 5px",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    padding: "5px",
    minWidth: "100px", // Ensure equal width across all cells
  },  
  cellExplanation: {
    flex: 1, // Maintain same flex value as `cell`
    textAlign: "center",
    padding: "5px",
    color: "#0066cc",
    fontSize: "12px",
    minWidth: "100px", // Ensure consistent width
  },  
};

export default ResultTable;
