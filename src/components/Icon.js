import React from 'react';
import { iconMap } from '@/lib/iconMap';

// Resolves a stable string key (stored in content data) to the actual icon
// component, so data files stay JSON-serializable instead of embedding JSX.
// Looked up directly from the map (not via a function call) so the resolved
// reference is a plain property access, not a fresh value created on render.
const Icon = ({ name, className, ...rest }) => {
  const Component = name ? iconMap[name] : null;
  if (!Component) return null;
  return <Component className={className} {...rest} />;
};

export default Icon;
