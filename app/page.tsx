import { Logo } from "../components/Logo";
import { PrimaryButton } from "../components/PrimaryButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0f0f13]">
      {/* Top bar with brand left and text-only nav right */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="font-sans text-sm font-semibold tracking-tight text-[#e8edf0]">
          trace.ai
        </div>
        <nav className="flex items-center gap-6 font-sans text-sm text-zinc-400">
          <span>collective</span>
          <span>pricing</span>
          <span>sigin</span>
          <span>demo</span>
        </nav>
      </header>

      {/* Centered hero content */}
      <section className="flex flex-1 items-center justify-center px-6">
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-3">
            {/* <span className="font-sans text-4xl font-bold text-zinc-900 sm:text-5xl">
              Trace
            </span> */}
            <h1 className="font-sans text-4xl font-bold tracking-tight text-[#e8edf0] sm:text-5xl">
              Artistic Intelligence
            </h1>
          </div>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-sm font-light text-zinc-400 sm:text-base">
            Turn your creative vision into scalable workflows. Access all AI models and professional editing tools in one node based platform.
          </p>
          <div className="mt-8 flex items-center justify-center">
            <PrimaryButton href="/canvas">Start Building</PrimaryButton>
          </div>
        </div>
      </section>
    </main>
  );
}
