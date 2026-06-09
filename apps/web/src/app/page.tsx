export default function Home() {
  return (
    <main className="flex flex-col">
      <section
        id="hero"
        className="flex min-h-screen items-center justify-center px-6 lg:px-0"
      >
        <div className="w-full max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight">Fernando Jr</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Desenvolvedor Full Stack
          </p>
        </div>
      </section>

      <section id="about" className="min-h-screen py-24">
        <div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
          <h2 className="text-3xl font-bold">Sobre</h2>
          <p className="mt-4 text-muted-foreground">Em breve...</p>
        </div>
      </section>

      <section id="projects" className="min-h-screen py-24">
        <div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
          <h2 className="text-3xl font-bold">Projetos</h2>
          <p className="mt-4 text-muted-foreground">Em breve...</p>
        </div>
      </section>

      <section id="contact" className="min-h-screen py-24">
        <div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
          <h2 className="text-3xl font-bold">Contato</h2>
          <p className="mt-4 text-muted-foreground">Em breve...</p>
        </div>
      </section>
    </main>
  );
}
