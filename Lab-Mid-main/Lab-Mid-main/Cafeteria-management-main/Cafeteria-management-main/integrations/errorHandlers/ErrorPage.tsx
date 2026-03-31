import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "Something went wrong";
  const message =
    isRouteErrorResponse(error) && typeof error.data === "string"
      ? error.data
      : error instanceof Error
        ? error.message
        : "The page could not be loaded.";

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-xl border border-secondary p-8">
        <h1 className="font-heading text-3xl uppercase mb-4">{title}</h1>
        <p className="font-paragraph text-base text-secondary-foreground mb-8">{message}</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-foreground font-paragraph text-sm uppercase tracking-wide hover:bg-foreground hover:text-background transition-colors"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
