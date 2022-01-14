import { useEffect, useState } from "react";
import { ISessionResponse } from "../api/response";
import { CreateSession, RetrieveSession, UpdateSession } from "../api/sessions";
import { ISessionRequest } from "./../api/request";

export default function useSession() {
  const [session, setSession] = useState<ISessionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isExternal, setIsExternal] = useState(false);

  const refresh = () => {
    if (!session) return;
    setSession(null);
    setIsLoading(false);
    setIsExternal(false);
    localStorage.removeItem("SESSION_ID");
    createSession();
  };

  const importSession = () => {
    if (!session) return;
    localStorage.setItem("SESSION_ID", session.id);
    setIsExternal(false);
    window.location.href = "/";
  };

  const createSession = () => {
    setIsLoading(true);
    CreateSession({ title: "Tasks List" })
      .then((data) => {
        localStorage.setItem("SESSION_ID", data.data.id);
        setSession(data.data);
        setIsLoading(false);
        window.location.href = "/";
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  };

  const retrieveSession = (id: string) => {
    setIsLoading(true);

    RetrieveSession(id)
      .then((data) => {
        setSession(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  };

  const updateSession = (data: ISessionRequest) => {
    setIsLoading(true);
    if (!session) return;

    UpdateSession(session.id, data)
      .then((data) => {
        setSession(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    let sessionId = localStorage.getItem("SESSION_ID");
    if (params.session_id) {
      if (sessionId !== params.session_id) {
        setIsExternal(true);
      }
      sessionId = params.session_id;
    }

    if (sessionId) {
      RetrieveSession(sessionId)
        .then((data) => {
          setSession(data.data);
          setIsLoading(false);
        })
        .catch((error) => {
          createSession();
        });
    } else {
      createSession();
    }
  }, []);

  return {
    session,
    refresh,
    isLoading,
    isExternal,
    error,
    import: importSession,
    update: updateSession,
  };
}
