import { ScrambleText } from "@/components/scramble-text"

export function Header() {
  return (
    <header className="mb-16 space-y-4">
      <h1 className="text-5xl font-semibold tracking-tight text-white text-balance mb-4 animate-fade-in">
        <span className="inline-block">
          <ScrambleText text="ayush gupta" />
        </span>
      </h1>
      <p className="text-gray-500 animate-fade-in">
        software engineer · delhi, india
      </p>
      <p className="text-pretty max-w-[52ch] animate-fade-in-up">
        software engineer working on backend, databases, and system
        architecture. drawn to low-level engineering and the details of how
        things actually work under the hood.
      </p>
    </header>
  )
}
