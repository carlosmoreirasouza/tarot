import { Suspense } from "react";
import TiragemClient from "./tiragem-client";

export default function TiragemPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TiragemClient />
    </Suspense>
  );
}

function Loading() {
  return (
    <main className="container">
      <div className="card">
        <div className="header">
          <h1 className="h1">Carregando…</h1>
          <p className="lead">Só um instante.</p>
        </div>
      </div>
    </main>
  );
}
