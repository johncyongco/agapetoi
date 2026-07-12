interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-3 px-5 lg:px-8 h-12">
        <div className="flex items-baseline gap-2">
          <span className="label-caps">{title}</span>
          {subtitle && (
            <span className="text-editorial-xs text-text-secondary">{subtitle}</span>
          )}
        </div>
      </div>
    </header>
  );
}
