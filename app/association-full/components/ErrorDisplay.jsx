export default function ErrorDisplay({ error }) {
  return (
    <main className="mt-8">
      <p className="text-red-300">Erreur : {error}</p>
    </main>
  );
}
