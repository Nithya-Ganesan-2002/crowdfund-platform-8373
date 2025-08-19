import { Link, NavLink } from '../vendor/react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.brand}>Crowdfund</Link>
        <NavLink to="/projects" style={styles.link}>Projects</NavLink>
        {user && <NavLink to="/projects/new" style={styles.link}>Create</NavLink>}
        {user && <NavLink to="/dashboard" style={styles.link}>Dashboard</NavLink>}
      </div>
      <div style={styles.right}>
        {!user && (
          <>
            <NavLink to="/login" style={styles.btnOutline}>Login</NavLink>
            <NavLink to="/register" style={styles.btnPrimary}>Sign Up</NavLink>
          </>
        )}
        {user && (
          <>
            <span style={styles.user}>Hi, {user.name}</span>
            <button onClick={onLogout} style={styles.btnOutline}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

const colors = {
  primary: '#1976d2',
  secondary: '#424242',
  accent: '#ff9800',
};

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: '#fff',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    justifyContent: 'space-between',
  },
  left: { display: 'flex', gap: 16, alignItems: 'center' },
  right: { display: 'flex', gap: 12, alignItems: 'center' },
  brand: {
    color: colors.primary,
    fontWeight: 800,
    textDecoration: 'none',
    letterSpacing: 0.3,
    marginRight: 8,
  },
  link: {
    color: colors.secondary,
    textDecoration: 'none',
    fontWeight: 500,
  },
  btnPrimary: {
    background: colors.primary,
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 600,
  },
  btnOutline: {
    background: 'transparent',
    color: colors.primary,
    border: `1px solid ${colors.primary}`,
    padding: '8px 14px',
    borderRadius: 8,
    textDecoration: 'none',
    fontWeight: 600,
    cursor: 'pointer',
  },
  user: {
    color: colors.secondary,
    fontWeight: 600,
  },
};
