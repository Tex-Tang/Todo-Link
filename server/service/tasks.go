package service

import (
	"database/sql"

	"github.com/Tex-Tang/Todo-Link/server/model"
	"github.com/gofiber/fiber/v2"
	"github.com/segmentio/ksuid"
	"github.com/volatiletech/sqlboiler/v4/boil"
)

type CreateTaskRequest struct {
	Title     string `json:"title" validate:"required"`
	SessionID string `json:"session_id" validate:"required"`
}

func CreateTask(c *fiber.Ctx) error {
	var request CreateTaskRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	session, err := model.Sessions(model.SessionWhere.ID.EQ(request.SessionID)).OneG(c.Context())
	if err != nil && err != sql.ErrNoRows {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	} else if err == sql.ErrNoRows {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Session not found",
		})
	}

	task := model.Task{
		ID:        ksuid.New().String(),
		Title:     request.Title,
		SessionID: session.ID,
	}

	if err = task.InsertG(c.Context(), boil.Infer()); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(task)
}

func ListTasks(c *fiber.Ctx) error {
	if c.Query("session_id") == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "session_id is required",
		})
	}

	session, err := model.FindSessionG(c.Context(), c.Query("session_id"))
	if err != nil && err != sql.ErrNoRows {
		return ErrInternalServerError
	} else if err == sql.ErrNoRows {
		return ErrSessionNotFound
	}

	var tasks []*model.Task
	tasks, err = model.Tasks(model.TaskWhere.SessionID.EQ(session.ID)).AllG(c.Context())
	if err != nil && err != sql.ErrNoRows {
		return ErrInternalServerError
	}

	return c.JSON(tasks)
}

type UpdateTaskRequest struct {
	Title string `json:"title" validate:"required"`
}

func UpdateTask(c *fiber.Ctx) error {
	var request UpdateTaskRequest
	if err := c.BodyParser(&request); err != nil {
		return ErrBadRequest
	}

	task, err := model.FindTaskG(c.Context(), c.Params("id"))
	if err != nil && err != sql.ErrNoRows {
		return ErrInternalServerError
	} else if err == sql.ErrNoRows {
		return ErrTaskNotFound
	}

	task.Title = request.Title

	_, err = task.UpdateG(c.Context(), boil.Infer())
	if err != nil {
		return ErrInternalServerError
	}

	return c.JSON(task)
}

func DeleteTask(c *fiber.Ctx) error {
	task, err := model.FindTaskG(c.Context(), c.Params("id"))
	if err != nil && err != sql.ErrNoRows {
		return ErrInternalServerError
	} else if err == sql.ErrNoRows {
		return ErrTaskNotFound
	}

	_, err = task.DeleteG(c.Context())
	if err != nil {
		return ErrInternalServerError
	}

	return c.JSON(fiber.Map{
		"message": "Task deleted",
	})
}
