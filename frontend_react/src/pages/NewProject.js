import { useState } from 'react';
import { createProject } from '../services/api';
import { useNavigate } from '../vendor/react-router-dom';

export default function NewProject() {
  const [form, setForm] = useState({ title: '', description: '', goal_amount: '', deadline: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        goal_amount: parseFloat(form.goal_amount),
        deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
        category: form.category || undefined,
      };
      if (!payload.title || !payload.description || isNaN(payload.goal_amount)) {
        throw new Error('Title, description, and valid goal amount are required');
      }
      const res = await createProject(payload);
      const id = res?.id || res?._id || res?.project_id;
      navigate(`/projects/${id || ''}`);
    } catch (e2) {
      setErr(e2.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <form onSubmit={submit} style={styles.card}>
        <h2 style={{ marginTop: 0, color: '#1976d2' }}>Create Project</h2>
        {err && <div style={styles.error}>{err}</div>}
        <label style={styles.label}>Title</label>
        <input name="title" value={form.title} onChange={onChange} style={styles.input} required />
        <label style={styles.label}>Description</label>
        <textarea name="description" value={form.description} onChange={onChange} style={{ ...styles.input, minHeight: 100 }} required />
        <label style={styles.label}>Goal Amount (USD)</label>
        <input name="goal_amount" value={form.goal_amount} onChange={onChange} style={styles.input} placeholder="1000" />
        <label style={styles.label}>Deadline</label>
        <input type="date" name="deadline" value={form.deadline} onChange={onChange} style={styles.input} />
        <label style={styles.label}>Category</label>
        <input name="category" value={form.category} onChange={onChange} style={styles.input} />
        <button style={styles.btn} disabled={loading}>{loading ? 'Creating...' : 'Create Project'}</button>
      </form>
    </div>
  );
}

const styles = {
  wrap: { padding: 20, display: 'flex', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 720, border: '1px solid #e9ecef', borderRadius: 12, padding: 16, background: '#fff' },
  label: { display: 'block', marginTop: 8, fontWeight: 600 },
  input: { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 6 },
  btn: { marginTop: 16, padding: '10px 14px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' },
  error: { background: '#ffebee', border: '1px solid #ffcdd2', padding: 8, borderRadius: 8, color: '#c62828', marginBottom: 12 }
};
