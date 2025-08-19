import { useEffect, useState } from 'react';
import { listProjects } from '../services/api';
import { Link } from '../vendor/react-router-dom';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const fetchProjects = async (filters = {}) => {
    setLoading(true);
    setErr('');
    try {
      const data = await listProjects(filters);
      setProjects(Array.isArray(data) ? data : (data.items || []));
    } catch (e) {
      setErr(e.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilter = (e) => {
    e.preventDefault();
    fetchProjects({ q, category });
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={{ margin: 0, color: '#1976d2' }}>Discover Projects</h2>
        <form onSubmit={onFilter} style={styles.filters}>
          <input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} style={styles.input} />
          <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input} />
          <button style={styles.btn}>Filter</button>
        </form>
      </div>

      {err && <div style={styles.error}>{err}</div>}
      {loading && <div>Loading...</div>}

      <div style={styles.grid}>
        {projects.map((p) => (
          <Link to={`/projects/${p.id || p._id || p.project_id}`} key={p.id || p._id || p.project_id} style={styles.card}>
            <h3 style={{ margin: '0 0 8px' }}>{p.title}</h3>
            <p style={{ margin: 0, color: '#555' }}>{p.description?.slice(0, 120)}</p>
            <div style={styles.meta}>
              <span>Goal: ${p.goal_amount}</span>
              {p.category && <span>• {p.category}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrap: { padding: '20px' },
  header: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 },
  filters: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  input: { padding: 10, borderRadius: 8, border: '1px solid #ccc', minWidth: 160 },
  btn: { padding: '10px 14px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 },
  card: { border: '1px solid #e9ecef', borderRadius: 12, padding: 16, textDecoration: 'none', color: 'inherit', background: '#fff' },
  meta: { marginTop: 8, color: '#777', fontSize: 14, display: 'flex', gap: 8 },
  error: { background: '#ffebee', border: '1px solid #ffcdd2', padding: 8, borderRadius: 8, color: '#c62828', marginBottom: 12 }
};
