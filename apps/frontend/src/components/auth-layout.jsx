const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4">
      {/* Decorative gradient blobs */}
      <div
        aria-hidden="true"
        className="bg-brand-gradient pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-violet-400 opacity-20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-300 opacity-15 blur-3xl"
      />

      {/* Brand mark */}
      <div className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 select-none text-center">
        <h1 className="text-brand-gradient text-3xl font-extrabold tracking-tight">
          Vibesta
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Share moments with your friends
        </p>
      </div>

      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </div>
  );
};

export default AuthLayout;
