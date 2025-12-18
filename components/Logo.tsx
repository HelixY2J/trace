type LogoProps = {
  className?: string;
};

/**
 * Simple wordmark for Trace.ai with subtle accent.
 */
export function Logo({ className }: LogoProps) {
  return (
    <div className={`select-none ${className ?? ""}`}>
      <span className="text-2xl font-semibold tracking-tight">Trace</span>
      <span className="text-2xl font-semibold tracking-tight text-zinc-500">
        .ai
      </span>
      <span className="ml-1 inline-block h-2 w-2 rounded-full bg-brand-primary align-middle" />
    </div>
  );
}


