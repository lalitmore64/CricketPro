import React from 'react';

const BowlingTable = ({ bowlingScorecard }) => {
  if (!bowlingScorecard || bowlingScorecard.length === 0) {
    return <div style={{ color: 'var(--text-subtle)', padding: '1rem' }}>No bowling data available yet.</div>;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Bowler</th>
            <th style={{ textAlign: 'right' }}>O</th>
            <th style={{ textAlign: 'right' }}>R</th>
            <th style={{ textAlign: 'right' }}>W</th>
            <th style={{ textAlign: 'right' }}>WD</th>
            <th style={{ textAlign: 'right' }}>NB</th>
            <th style={{ textAlign: 'right' }}>ECO</th>
          </tr>
        </thead>
        <tbody>
          {bowlingScorecard.map((item) => (
            <tr key={item.id}>
              <td style={{ fontWeight: 700 }}>{item.name}</td>
              <td style={{ textAlign: 'right', fontWeight: 600 }}>{item.overs}</td>
              <td style={{ textAlign: 'right' }}>{item.runsConceded}</td>
              <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--accent-blue)' }}>{item.wickets}</td>
              <td style={{ textAlign: 'right' }}>{item.wides}</td>
              <td style={{ textAlign: 'right' }}>{item.noBalls}</td>
              <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--primary)' }}>
                {item.economy ? item.economy.toFixed(2) : '0.00'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BowlingTable;
