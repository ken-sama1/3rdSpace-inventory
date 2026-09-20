import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <main className="w-full min-h-full h-auto flex flex-col items-center justify-center bg-(--primary) p-2">
      <section className="text-center  max-w-md">
        <p className="text-7xl font-bold tracking-tight">Soon</p>

        <h1 className="mt-4 text-2xl font-semibold">
          Coming in the next update
        </h1>

        <p className="mt-2 text-sm text-(--text-muted)">
          This feature is currently being worked on and will be available in a
          future update.
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

export default ComingSoon;
