import { TriangleAlert } from "lucide-react";

export default function Fallback() {
  return (
    <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
      <TriangleAlert className="h-6 w-6" />
      <div>공습경보!</div>
    </div>
  );
}
