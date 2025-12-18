import { PrimaryButton } from "../components/PrimaryButton";
import { GridPattern } from "../components/ui/grid-pattern";
import { Ripple } from "../components/ui/ripple";
import { ToolPill } from "../components/ui/tool-pill";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0f0f13]">
   
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="font-sans text-sm font-semibold tracking-tight text-[#e8edf0]">
          trace.ai
        </div>
        <nav className="flex items-center gap-6 font-sans text-sm text-zinc-400">
          <span>collective</span>
          <span>pricing</span>
          <span>signIn</span>
          <span>demo</span>
        </nav>
      </header>

      
      <section className="relative flex flex-1 items-start justify-center px-6">
        <GridPattern
          width={32}
          height={32}
          x={-1}
          y={-1}
          className="[mask-image:linear-gradient(to_bottom,white,transparent)] inset-0 h-full w-full"
        />
        <div className="relative z-10 mx-auto w-full max-w-3xl pt-20 sm:pt-28 lg:pt-32 pb-20 text-center">
          <h1 className="font-sans text-4xl font-normal tracking-tight text-[#e8edf0] sm:text-5xl">
            Artistic Intelligence
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-sm font-normal text-zinc-400 sm:text-base">
            Turn your creative vision into scalable workflows. Access all AI models and professional editing tools in one node based platform.
          </p>
          <div className="mt-8 flex items-center justify-center">
            <PrimaryButton href="/canvas">Start Building</PrimaryButton>
          </div>
        </div>
      </section>
      
     
      <section className="relative z-10 mt-10 sm:mt-16 flex items-start justify-center px-6 pb-32">
        <div className="mx-auto w-full max-w-3xl text-center pt-6 sm:pt-10">
          <h2 className="font-sans text-4xl sm:text-5xl font-normal tracking-tight text-[#e8edf0]">
            <span className="block">With all the professional tools</span>
            <span className="block">you rely on</span>
          </h2>
          <p className="mt-3 font-sans text-sm sm:text-base text-zinc-400">
            in one seamless workflow
          </p>
        </div>
      </section>
      
    
      <section className="relative z-10 hidden md:block px-6 mt-16 pb-28">
        <div className="relative mx-auto h-[520px] w-full max-w-5xl overflow-visible">
        
          <Ripple className="z-0" mainCircleSize={300} numCircles={9} mainCircleOpacity={0.12} />
      
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="font-sans text-4xl sm:text-5xl font-normal tracking-tight text-[#e8edf0]">
              trace.ai
            </div>
          </div>
          {/* Left arc */}
          <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2 flex flex-col items-start gap-4">
            <ToolPill label="Crop" className="-translate-y-20 ml-4" />
            <ToolPill label="Inpaint" className="-translate-y-10 ml-2" />
            <ToolPill label="Outpaint" className="translate-y-0" />
            <ToolPill label="Invert" className="translate-y-10 ml-2" />
            <ToolPill label="Mask Extractor" className="translate-y-20 ml-4" />
            <ToolPill label="Upscale" className="translate-y-28 ml-6" />
          </div>
          <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2 flex flex-col items-end gap-4">
            <ToolPill label="Painter" className="-translate-y-20 mr-4" />
            <ToolPill label="Channels" className="-translate-y-10 mr-2" />
            <ToolPill label="Image Describer" className="translate-y-0" />
            <ToolPill label="Relight" className="translate-y-10 mr-2" />
            <ToolPill label="Z Depth Extractor" className="translate-y-20 mr-4" />
          </div>
        </div>
      </section>
    </main>
  );
}
