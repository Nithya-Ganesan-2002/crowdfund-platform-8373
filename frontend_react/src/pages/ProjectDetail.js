import { useEffect, useState } from 'react';
import { useParams } from '../vendor/react-router-dom';
import { getProject, createPaymentIntent, listPledgesForProject, confirmPaymentIntent } from '../services/api';

const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [pledges, setPledges] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    setErr('');
    try {
      const data = await getProject(id);
      setProject(data);
      const pledgesData = await listPledgesForProject(id).catch(() => []);
      setPledges(Array.isArray(pledgesData) ? pledgesData : []);
    } catch (e) {
      setErr(e.message || 'Failed to load project');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const contribute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    setMessage('');
    try {
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt <= 0) throw new Error('Enter a valid amount');

      const intent = await createPaymentIntent({ project_id: id, amount: amt });

      // Normally, we would use Stripe.js to complete payment if required.
      // Here we demonstrate the confirm endpoint and communicate next steps.
      const confirmation = await confirmPaymentIntent(intent?.payment_intent_id || intent?.id);

      if (confirmation?.status === 'requires_action' && STRIPE_PUBLISHABLE_KEY) {
        // In a real setup, handle next_action with Stripe.js.
        setMessage('Additional authentication required. Please follow the Stripe popup if it appears.');
      } else {
        setMessage('Thank you for your contribution!');
      }
      setAmount('');
      await load();
    } catch (e2) {
      setErr(e2.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (err && !project) return <div style={{ padding: 20 }}><div style={styles.error}>{err}</div></div>;
  if (!project) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={{ margin: 0, color: '#1976d2' }}>{project.title}</h2>
        <div style={styles.meta}>
          <span>Goal: ${project.goal_amount}</span>
          {project.category && <span>• {project.category}</span>}
          {project.deadline && <span>• Ends: {new Date(project.deadline).toLocaleDateString()}</span>}
        </div>
      </div>

      <p style={{ color: '#444' }}>{project.description}</p>

      <div style={styles.row}>
        <form onSubmit={contribute} style={styles.card}>
          <h3 style={{ marginTop: 0 }}>Contribute</h3>
          {err && <div style={styles.error}>{err}</div>}
          {message && <div style={styles.success}>{message}</div>}
          <label style={styles.label}>Amount (USD)</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="25" style={styles.input} />
          <button style={styles.btn} disabled={loading}>{loading ? 'Processing...' : 'Contribute'}</button>
          {!STRIPE_PUBLISHABLE_KEY && (
            <p style={styles.note}>
              Note: REACT_APP_STRIPE_PUBLISHABLE_KEY not set. For full Stripe.js flows, set it in .env.
            </p>
          )}
        </form>

        <div style={styles.card}>
          <h3 style={{ marginTop: 0 }}>Recent Pledges</h3>
          {pledges.length === 0 && <p>No pledges yet.</p>}
          <ul style={{ paddingLeft: 18 }}>
            {pledges.map((pl, idx) => (
              <li key={pl.id || idx}>${pl.amount} by {pl.user_name || 'Anonymous'}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { padding: 20 },
  header: { marginBottom: 10 },
  meta: { color: '#777', display: 'flex', gap: 8 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card: { border: '1px solid #e9ecef', borderRadius: 12, padding: 16, background: '#fff' },
  label: { display: 'block', marginTop: 8, fontWeight: 600 },
  input: { width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 6 },
  btn: { marginTop: 12, padding: '10px 14px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' },
  note: { marginTop: 8, fontSize: 12, color: '#777' },
  error: { background: '#ffebee', border: '1px solid #ffcdd2', padding: 8, borderRadius: 8, color: '#c62828', marginBottom: 12 },
  success: { background: '#e8f5e9', border: '1px solid #c8e6c9', padding: 8, borderRadius: 8, color: '#2e7d32', marginBottom: 12 }
};
