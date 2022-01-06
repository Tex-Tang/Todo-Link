/* -------------------------------------------------------------------------- */
/*                                   Session                                  */
/* -------------------------------------------------------------------------- */

export interface ISessionRequest {
  title: string;
}

/* -------------------------------------------------------------------------- */
/*                                    Task                                    */
/* -------------------------------------------------------------------------- */

export interface ICreateTaskRequest {
  title: string;
  session_id: string;
}

export interface IListTasksRequest {
  session_id: string;
}

export interface IUpdateTaskRequest {
  title: string;
  completed_at?: Date | null;
}
