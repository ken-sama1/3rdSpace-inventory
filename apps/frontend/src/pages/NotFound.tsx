import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="w-full min-h-full h-auto flex flex-col items-center justify-center bg-(--primary) p-2">
      <section className="text-center size-full max-w-md">
        <p className="text-7xl font-bold tracking-tight">404</p>

        <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>

        <p className="mt-2 text-sm text-(--text-muted)">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 button-accent"
        >
          Back to Dashboard
        </button>
      </section>
    </main>
  );
};

export default NotFound;
