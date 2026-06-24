interface ProcessStepProps {
  number: number;
  title: string;
  phrase: string;
}

export default function ProcessStep({
  number,
  title,
  phrase,
}: ProcessStepProps) {
  return (
    <div className="relative flex flex-col items-center text-center min-w-[120px] flex-1">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-tahoe/30 bg-card text-sm font-medium text-tahoe">
        {number}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-xs text-muted leading-snug max-w-[140px]">
        {phrase}
      </p>
      {number < 7 && (
        <div
          className="hidden lg:block absolute top-5 left-[calc(50%+24px)] w-[calc(100%-48px)] h-px bg-gradient-to-r from-tahoe/30 to-tahoe/10"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
