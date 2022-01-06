/* -------------------------------------------------------------------------- */
/*                                   Session                                  */
/* -------------------------------------------------------------------------- */

export interface ISessionResponse {
  id: string;
  title: string;
  created_at: Date;
}

/* -------------------------------------------------------------------------- */
/*                                    Task                                    */
/* -------------------------------------------------------------------------- */

export interface ITaskResponse {
  id: string;
  title: string;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;

  // Extra properties for animation purpose
  hidden?: boolean;
}
