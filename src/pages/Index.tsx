const Index = () => {
  return (
    <main className="min-h-screen flex items-center justify-center" 
          style={{ background: 'var(--gradient-bg)' }}>
      <div className="text-center animate-fade-in">
        <h1 className="text-7xl font-light tracking-wider text-foreground mb-8 transition-all duration-700 hover:scale-105"
            style={{ 
              textShadow: 'var(--text-glow)',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
          Hello World
        </h1>
        <p className="text-lg text-muted-foreground tracking-wide opacity-80 font-light">
          Loomis
        </p>
      </div>
    </main>
  );
};

export default Index;
