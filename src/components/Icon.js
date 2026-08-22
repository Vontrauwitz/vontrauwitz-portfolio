import React from 'react';
import { resolveIcon } from '@/lib/iconMap';

// Resolves a stable string key (stored in content data) to the actual icon
// component, so data files stay JSON-serializable instead of embedding JSX.
const Icon = ({ name, className, ...rest }) => {
  const Component = resolveIcon(name);
  if (!Component) return null;
  return <Component className={className} {...rest} />;
};

export default Icon;
