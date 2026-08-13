import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { aiApi } from '../api/aiApi';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { Sparkles, ArrowLeft, Flame, Compass, UserCheck, RefreshCw } from 'lucide-react';

const AiSummary = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await aiApi.generateSummary(matchId);
      setSummaryData(data);
    } catch (err) {
      setError(err.message || 'Failed to generate AI match summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate(`/matches/${matchId}`)}>
          <ArrowLeft size={16} /> Back to Match
        </button>

        <button
          className="btn btn-primary"
          onClick={handleGenerateSummary}
          disabled={loading}
        >
          {loading ? <RefreshCw className="spin" size={16} /> : <Sparkles size={16} />}
          {summaryData ? 'Regenerate Summary' : 'Generate AI Match Summary'}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(15, 23, 42, 0.9))', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Sparkles color="var(--purple)" size={24} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>AI Match Intelligence</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Post-match analytics engine generating match narrative, highlights, and player insights.
        </p>
      </div>

      {error && <ErrorMessage message={error} onRetry={handleGenerateSummary} />}

      {loading ? (
        <div className="card" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
          <Loader message="Analyzing match performance..." />
          <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
            Generating highlights & identifying key turning points...
          </div>
        </div>
      ) : !summaryData ? (
        <div className="card" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <Sparkles size={48} color="var(--purple)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Ready to Generate Insights
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Click the button above to query the AI engine and receive an automated match summary report.
          </p>
          <button className="btn btn-primary" onClick={handleGenerateSummary}>
            <Sparkles size={16} /> Generate AI Match Summary
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Match Summary Statement */}
          <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
              Executive Match Summary
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
              {summaryData.summary}
            </p>
          </div>

          {/* Highlights */}
          {summaryData.highlights && summaryData.highlights.length > 0 && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Flame size={20} color="var(--warning)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Key Match Highlights</h3>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {summaryData.highlights.map((h, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.85rem 1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.95rem'
                    }}
                  >
                    🔥 {h}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Turning Points */}
          {summaryData.turningPoints && summaryData.turningPoints.length > 0 && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Compass size={20} color="var(--accent-blue)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Critical Turning Points</h3>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {summaryData.turningPoints.map((tp, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.85rem 1rem',
                      backgroundColor: 'rgba(59, 130, 246, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      fontSize: '0.95rem'
                    }}
                  >
                    ⚡ {tp}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Player Insights */}
          {summaryData.playerInsights && summaryData.playerInsights.length > 0 && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <UserCheck size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Player Performance Insights</h3>
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {summaryData.playerInsights.map((pi, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.85rem 1rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.05)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      fontSize: '0.95rem'
                    }}
                  >
                    🏏 {pi}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiSummary;
