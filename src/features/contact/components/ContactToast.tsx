type ContactToastProps = {
  title: string;
  description: string;
};

// Small reusable toast body so ContactForm's submit handler only has to pass
// copy, not JSX — used as the `content` argument to toast.success/toast.error.
const ContactToast = ({ title, description }: ContactToastProps) => (
  <div className="flex flex-col gap-0.5 pr-1">
    <span className="text-sm font-semibold leading-tight text-light">{title}</span>
    <span className="text-xs leading-snug text-light/70">{description}</span>
  </div>
);

export default ContactToast;
