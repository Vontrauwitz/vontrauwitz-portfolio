import { iconMap } from '@/lib/iconMap';
import type { IconProps } from '@/components/ui/icons/types';

type Props = Omit<IconProps, 'name'> & {
  name?: string | null;
};

// Resolves a stable string key (stored in content data) to the actual icon
// component, so data files stay JSON-serializable instead of embedding JSX.
// Looked up directly from the map (not via a function call) so the resolved
// reference is a plain property access, not a fresh value created on render.
const Icon = ({ name, className, ...rest }: Props) => {
  const Component = name ? iconMap[name] : null;
  if (!Component) return null;
  return <Component className={className} {...rest} />;
};

export default Icon;
