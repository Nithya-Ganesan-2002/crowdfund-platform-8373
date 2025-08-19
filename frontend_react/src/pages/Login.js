import { useState } from 'react';
import { loginUser, setToken, getMe } from '../services/api';
import { useNavigate, Link } from '../vendor/react-router-dom';

export default function Login({ onLoggedIn }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const res = await loginUser(form);
      if (res?.token) setToken(res.token);
      // Try to fetch user
      let user = res?.user;
      if (!user) {
        user = await getMe().catch(() => null);
      }
      onLoggedIn(user || null);
      navigate('/projects');
    } catch (error) {
      setErr(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <form onSubmit={submit} style={styles.card}>
        <h2 style={styles.title}>Welcome back</h2>
        {err && <div style={styles.error}>{err}</div>}
        <label style={styles.label}>Email</label>
        <input style={styles.input} type="email" name="email" value={form.email} onChange={onChange} required />
        <label style={styles.label}>Password</label>
        <input style={styles.input} type="password" name="password" value={form.password} onChange={onChange} required />
        <button style={styles.btn} disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        <p style={styles.small}>No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

const styles = {
  wrap: { display: 'flex', justifyContent: 'center', padding: '32px 16px' },
  card: { width: '100%', maxWidth: 420, border: '1px solid #e9ecef', borderRadius: 12, padding: 24, background: '#fff' },
  title: { margin: '0 0 16px', color: '#1976d2' },
  label: { display: 'block', marginTop: 12, fontWeight: 600 },
  input: { width: '100%', padding: 10, fontSize: 14, borderRadius: 8, border: '1px solid #ccc', marginTop: 6 },
  btn: { marginTop: 16, width: '100%', padding: 12, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' },
  small: { marginTop: 12, fontSize: 14 },
  error: { background: '#ffebee', border: '1px solid #ffcdd2', padding: 8, borderRadius: 8, color: '#c62828', marginBottom: 12 }
};
