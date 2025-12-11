import { Button } from "@repo/ui";
import { ZodExample } from "./components/ZodExample";

import { ModeToggle } from "@repo/ui";
import { useAtom } from "jotai";
import { counter } from "./atoms/count";
import { DropdownMenuDemo } from "./components/DropDownDemo";

export function App() {
  const [count, setCount] = useAtom(counter);
  const onClick = () => setCount((prev) => prev + 1);
  return (
    <>
      <ModeToggle />
      <div className="bg-background text-foreground flex h-screen w-full flex-col items-center justify-center gap-4">
        <h1 className="animate-pulse text-2xl font-bold">
          Vite + React + TailwindCSS + TypeScript + Shadcn
        </h1>

        <Button onClick={onClick} variant="default">
          Count: {count}
        </Button>
        <ZodExample />
        <DropdownMenuDemo />
      </div>
    </>
  );
}
