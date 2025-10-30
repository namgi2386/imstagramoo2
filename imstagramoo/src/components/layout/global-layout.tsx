import { Outlet } from "react-router";

export default function GlobalLayout() {
  return (
    <>
      <header></header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
