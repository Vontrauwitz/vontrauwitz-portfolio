import type { SVGProps } from 'react';

// Shared prop type for every icon component in this directory. `className`
// widens the underlying SVGProps type to also accept `null` (not just
// `string | undefined`) because several content-data fields (e.g.
// skillsConst's `iconClassName`) are typed `string | null` and are passed
// straight through via <Icon />/<Component className={className} />
// without a runtime fallback — preserving that exact pass-through behavior
// (including the pre-existing "null"/"undefined" stringified-into-class
// quirk when a field is unset) requires the type to allow it too.
export type IconProps = Omit<SVGProps<SVGSVGElement>, 'className'> & {
  className?: string | null;
};
