import { useEffect, useState } from "react";
import { ISessionResponse } from "../api/response";
import { CreateSession, RetrieveSession } from "../api/sessions";

export default function useSession() {
  const [session, setSession] = useState<ISessionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const sessionId = localStorage.getItem("SESSION_ID") || params.session_id;
    if (!sessionId) {
      CreateSession({
        title: "Tasks List",
      })
        .then((res) => {
          localStorage.setItem("SESSION_ID", res.data.id);
          setSession(res.data);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      RetrieveSession(sessionId)
        .then((res) => {
          localStorage.setItem("SESSION_ID", res.data.id);
          setSession(res.data);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  return {
    session,
    isLoading,
    error,
  };
}