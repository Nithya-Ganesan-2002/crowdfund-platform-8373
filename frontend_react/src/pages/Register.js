import { useState } from 'react';
import { registerUser, loginUser, setToken, getMe } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register({ onLoggedIn }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      await registerUser(form);
      // auto-login after register for convenience
      const res = await loginUser({ email: form.email, password: form.password });
      if (res?.token) setToken(res.token);
      let user = res?.user;
      if (!user) user = await getMe().catch(() => null);
      onLoggedIn(user || null);
      navigate('/projects');
    } catch (error) {
      setErr(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <form onSubmit={submit} style={styles.card}>
        <h2 style={styles.title}>Create your account</h2>
        {err && <div style={styles.error}>{err}</div>}
        <label style={styles.label}>Name</label>
        <input style={styles.input} name="name" value={form.name} onChange={onChange} required />
        <label style={styles.label}>Email</label>
        <input style={styles.input} type="email" name="email" value={form.email} onChange={onChange} required />
        <label style={styles.label}>Password</label>
        <input style={styles.input} type="password" name="password" value={form.password} onChange={onChange} required />
        <button style={styles.btn} disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
        <p style={styles.small}>Have an account? <Link to="/login">Login</Link></p>
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
