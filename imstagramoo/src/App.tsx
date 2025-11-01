import SessionProvider from "@/provider/session-provider";
import "./App.css";
import RootRoute from "@/root-route";

function App() {
  return (
    <SessionProvider>
      <RootRoute />
    </SessionProvider>
  );
}

export default App;
