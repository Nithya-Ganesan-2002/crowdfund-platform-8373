import { useEffect, useState } from 'react';
import { getMe, listProjects } from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [ownedProjects, setOwnedProjects] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    const load = async () => {
      setErr('');
      try {
        const me = await getMe();
        setUser(me);
        const projects = await listProjects({ owner_id: me?.id || me?._id || me?.user_id });
        setOwnedProjects(Array.isArray(projects) ? projects : (projects.items || []));
      } catch (e) {
        setErr(e.message || 'Failed to load dashboard');
      }
    };
    load();
  }, []);

  return (
    <div style={styles.wrap}>
      <h2 style={{ color: '#1976d2' }}>Your Dashboard</h2>
      {err && <div style={styles.error}>{err}</div>}
      {user && <p>Welcome, {user.name} ({user.email})</p>}

      <div style={{ marginTop: 16 }}>
        <h3>Your Projects</h3>
        {ownedProjects.length === 0 && <p>No projects yet. <Link to="/projects/new">Create one</Link>.</p>}
        <ul>
          {ownedProjects.map((p) => (
            <li key={p.id || p._id || p.project_id}>
              <Link to={`/projects/${p.id || p._id || p.project_id}`}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  wrap: { padding: 20 },
  error: { background: '#ffebee', border: '1px solid #ffcdd2', padding: 8, borderRadius: 8, color: '#c62828', marginBottom: 12 }
};
