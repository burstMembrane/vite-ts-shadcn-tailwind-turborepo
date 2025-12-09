import { Button } from "@repo/ui/components/button";
import { ZodExample } from "./components/ZodExample";

function App() {
  return (
    <div className="bg-background text-foreground flex h-screen w-full flex-col items-center justify-center gap-4">
      <h1 className="animate-pulse text-2xl font-bold">
        Vite + React + TailwindCSS + TypeScript + Shadcn
      </h1>
      <Button variant="outline">Hello World</Button>
      <ZodExample />
    </div>
  );
}
export default App;
