import React, { useState } from 'react';
import { usePlayers } from '../hooks/usePlayers';
import { useTeams } from '../hooks/useTeams';
import { playerApi } from '../api/playerApi';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, User, Filter, X } from 'lucide-react';

const Players = () => {
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('');
  const { teams } = useTeams();
  const { players, loading, error, refetch } = usePlayers(selectedTeamFilter ? parseInt(selectedTeamFilter, 10) : null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('BATSMAN');
  const [teamId, setTeamId] = useState('');
  const [formError, setFormError] = useState('');

  const [deletingId, setDeletingId] = useState(null);

  const roles = [
    { value: 'BATSMAN', label: 'Batsman' },
    { value: 'BOWLER', label: 'Bowler' },
    { value: 'ALL_ROUNDER', label: 'All Rounder' },
    { value: 'WICKET_KEEPER', label: 'Wicket Keeper' },
  ];

  const openCreateModal = () => {
    setEditingPlayer(null);
    setName('');
    setRole('BATSMAN');
    setTeamId(teams.length > 0 ? teams[0].id : '');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (player) => {
    setEditingPlayer(player);
    setName(player.name);
    setRole(player.role);
    setTeamId(player.teamId);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingPlayer) {
        await playerApi.update(editingPlayer.id, { name, role, teamId: parseInt(teamId, 10) });
      } else {
        await playerApi.create({ name, role, teamId: parseInt(teamId, 10) });
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err.message || 'Failed to save player');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await playerApi.delete(deletingId);
      setDeletingId(null);
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to delete player');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Player Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Register and manage team squads</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} /> Add Player
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Filter size={18} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Filter by Team:</span>
          <select
            className="form-select"
            style={{ maxWidth: '250px' }}
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
          >
            <option value="">All Teams</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.shortName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {loading ? (
        <Loader message="Loading players..." />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Team</th>
                <th>Role</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-subtle)' }}>
                    No players found. Click "Add Player" to register a player.
                  </td>
                </tr>
              ) : (
                players.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={16} color="var(--primary)" />
                        </div>
                        {p.name}
                      </div>
                    </td>
                    <td>{p.teamName || 'Unassigned'}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                        {p.role}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem' }} onClick={() => openEditModal(p)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.35rem 0.6rem' }} onClick={() => setDeletingId(p.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Player Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{editingPlayer ? 'Edit Player' : 'Register Player'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {formError && <ErrorMessage message={formError} />}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Player Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Virat Kohli"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Team</label>
                <select
                  className="form-select"
                  required
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                >
                  <option value="">Select Team</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.shortName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Player Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPlayer ? 'Update Player' : 'Save Player'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Delete Player"
        message="Are you sure you want to delete this player from the squad?"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};

export default Players;
