import React from 'react';

const BattingTable = ({ battingScorecard }) => {
  if (!battingScorecard || battingScorecard.length === 0) {
    return <div style={{ color: 'var(--text-subtle)', padding: '1rem' }}>No batting data available yet.</div>;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Batter</th>
            <th>Dismissal</th>
            <th style={{ textAlign: 'right' }}>R</th>
            <th style={{ textAlign: 'right' }}>B</th>
            <th style={{ textAlign: 'right' }}>4s</th>
            <th style={{ textAlign: 'right' }}>6s</th>
            <th style={{ textAlign: 'right' }}>SR</th>
          </tr>
        </thead>
        <tbody>
          {battingScorecard.map((item) => (
            <tr key={item.id}>
              <td style={{ fontWeight: 700 }}>
                {item.name} {!item.isOut && <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>*</span>}
              </td>
              <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {item.isOut
                  ? `${item.dismissalType || 'OUT'}${item.bowlerName ? ` b ${item.bowlerName}` : ''}`
                  : 'not out'}
              </td>
              <td style={{ textAlign: 'right', fontWeight: 800, color: '#fff' }}>{item.runs}</td>
              <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{item.ballsFaced}</td>
              <td style={{ textAlign: 'right' }}>{item.fours}</td>
              <td style={{ textAlign: 'right' }}>{item.sixes}</td>
              <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--primary)' }}>
                {item.strikeRate ? item.strikeRate.toFixed(2) : '0.00'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BattingTable;
