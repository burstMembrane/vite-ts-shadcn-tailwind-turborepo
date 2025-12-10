import { Button } from "@repo/ui/components/button";
import { ZodExample } from "./components/ZodExample";
import { add } from "@repo/shared";
import { useEffect } from "react";
import { ModeToggle } from "@repo/ui/components/mode-toggle";

export function App() {
  useEffect(() => {
    console.log("2 + 3 =", add(2, 3));
  }, []);
  return (
    <>
      <ModeToggle />
      <div className="bg-background text-foreground flex h-screen w-full flex-col items-center justify-center gap-4">
        <h1 className="animate-pulse text-2xl font-bold">
          Vite + React + TailwindCSS + TypeScript + Shadcn
        </h1>
        <Button variant="default">Hello World</Button>
        <ZodExample />
      </div>
    </>
  );
}
