/**
 * Minimal internal shim for react-router-dom APIs used in this project.
 * This is a fallback in case external dependency install is unavailable in CI.
 * It implements:
 * - BrowserRouter (no-op container)
 * - Routes/Route (renders first matching path by naive comparison)
 * - Link/NavLink (anchors that update hash and trigger a re-render)
 * - useNavigate (returns navigate function)
 * - useParams (extracts params from current hash path using :id support)
 * - Navigate (imperative redirect)
 * - Outlet (renders children directly)
 *
 * NOTE: This is a simplified client-side router for demo/testing. For production,
 * use the official 'react-router-dom'.
 */
import React, { useContext, useEffect, useMemo, useState } from 'react';

const RouterContext = React.createContext({ path: '/', setPath: () => {} });

export function BrowserRouter({ children }) {
  const [path, setPath] = useState(() => window.location.hash.slice(1) || '/');
  useEffect(() => {
    const onHash = () => setPath(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = path || '/';
    }
  }, [path]);
  const value = useMemo(() => ({ path, setPath }), [path]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

function matchPath(routePath, currentPath) {
  if (routePath === currentPath) return { params: {} };
  const routeSeg = routePath.split('/').filter(Boolean);
  const currSeg = currentPath.split('/').filter(Boolean);
  if (routeSeg.length !== currSeg.length) return null;
  const params = {};
  for (let i = 0; i < routeSeg.length; i++) {
    const r = routeSeg[i];
    const c = currSeg[i];
    if (r.startsWith(':')) {
      params[r.slice(1)] = decodeURIComponent(c);
    } else if (r !== c) {
      return null;
    }
  }
  return { params };
}

export function Routes({ children }) {
  const { path } = useContext(RouterContext);
  let element = null;
  React.Children.forEach(children, (child) => {
    if (element) return;
    const props = child.props || {};
    const routePath = props.path || '/';
    const m = matchPath(routePath, path);
    if (m) {
      element = React.cloneElement(props.element, { __params: m.params });
    }
  });
  return element || null;
}

export function Route() {
  return null;
}

export function Link({ to, style, children, ...rest }) {
  const navigate = useNavigate();
  const onClick = (e) => {
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={`#${to}`} onClick={onClick} style={style} {...rest}>
      {children}
    </a>
  );
}

export const NavLink = Link;

export function useNavigate() {
  const { setPath } = useContext(RouterContext);
  return (to, { replace } = {}) => {
    if (replace) {
      const url = new URL(window.location.href);
      url.hash = `#${to}`;
      window.history.replaceState(null, '', url.toString());
      setPath(to);
    } else {
      window.location.hash = `#${to}`;
    }
  };
}

export function useParams() {
  // Params are passed via element clone in Routes
  return React.__currentRouteParams || {};
}

export function Navigate({ to, replace }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace, navigate]);
  return null;
}

export function Outlet({ children }) {
  return children || null;
}

// Patch React to hold current route params for useParams
const originalClone = React.cloneElement;
React.cloneElement = function (element, props, ...children) {
  if (props && props.__params) {
    React.__currentRouteParams = props.__params;
    const { __params, ...rest } = props;
    return originalClone(element, rest, ...children);
  }
  return originalClone(element, props, ...children);
};
