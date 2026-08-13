import React, { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import { teamApi } from '../api/teamApi';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmModal from '../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, Shield, Users, X } from 'lucide-react';

const Teams = () => {
  const { teams, loading, error, refetch } = useTeams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [formError, setFormError] = useState('');

  const [deletingId, setDeletingId] = useState(null);

  const openCreateModal = () => {
    setEditingTeam(null);
    setName('');
    setShortName('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (team) => {
    setEditingTeam(team);
    setName(team.name);
    setShortName(team.shortName);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingTeam) {
        await teamApi.update(editingTeam.id, { name, shortName });
      } else {
        await teamApi.create({ name, shortName });
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err.message || 'Failed to save team');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await teamApi.delete(deletingId);
      setDeletingId(null);
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to delete team');
    }
  };

  if (loading) return <Loader message="Loading teams..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Team Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create and manage cricket teams and squads</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} /> Add Team
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {teams.map((t) => (
          <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800
                  }}>
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>{t.shortName}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => openEditModal(t)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={() => setDeletingId(t.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={16} />
                <span>{t.players ? t.players.length : 0} Players Registered</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Team Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{editingTeam ? 'Edit Team' : 'Create Team'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {formError && <ErrorMessage message={formError} />}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Challengers"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Name (Abbreviation)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RCB"
                  maxLength={10}
                  className="form-input"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTeam ? 'Update Team' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="Delete Team"
        message="Are you sure you want to delete this team? All associated player registrations will also be removed."
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};

export default Teams;
