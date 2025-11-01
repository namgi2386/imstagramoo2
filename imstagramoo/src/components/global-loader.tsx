import logo from "@/assets/imstalogo.png";
export default function GlobalLoader() {
  return (
    <div className="bg-muted flex h-screen w-screen flex-col items-center justify-center">
      <div className="mb-15 flex animate-bounce items-center gap-4">
        <img src={logo} className="w-10" alt="imstagramoo logo" />
        <div className="text-2xl font-bold">imstagramoo</div>
      </div>
    </div>
  );
}
