import SessionProvider from "@/provider/session-provider";
import "./App.css";
import RootRoute from "@/root-route";
import ModalProvider from "@/provider/modal-provider";

function App() {
  return (
    <SessionProvider>
      <ModalProvider>
        <RootRoute />
      </ModalProvider>
    </SessionProvider>
  );
}

export default App;
