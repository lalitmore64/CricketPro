import React from 'react';

const MatchStatus = ({ status }) => {
  if (status === 'LIVE') {
    return <span className="badge badge-live">LIVE</span>;
  }
  if (status === 'COMPLETED') {
    return <span className="badge badge-completed">COMPLETED</span>;
  }
  return <span className="badge badge-upcoming">UPCOMING</span>;
};

export default MatchStatus;
