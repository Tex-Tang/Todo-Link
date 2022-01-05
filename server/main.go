package main

import (
	"database/sql"
	"fmt"

	"github.com/Tex-Tang/Todo-Link/server/models"
	"github.com/gofiber/fiber/v2"
	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/segmentio/ksuid"
	"github.com/spf13/viper"
	"github.com/volatiletech/sqlboiler/v4/boil"
)

type CreateTaskRequest struct {
	Title     string `json:"title" validate:"required"`
	SessionID string `json:"session_id" validate:"required"`
}

type ListTasksRequest struct {
	SessionID string `json:"session_id" validate:"required"`
}

type UpdateTaskRequest struct {
	Title string `json:"title" validate:"required"`
}

func main() {
	viper.AddConfigPath(".")
	viper.SetConfigName("app")
	viper.SetConfigType("toml")
	if err := viper.ReadInConfig(); err != nil {
		panic(err)
	}

	conn, err := sql.Open("pgx", fmt.Sprintf(
		"postgres://%v:%v@%v:%v/%v?sslmode=disable",
		viper.GetString("psql.user"),
		viper.GetString("psql.pass"),
		viper.GetString("psql.host"),
		viper.GetString("psql.port"),
		viper.GetString("psql.dbname"),
	))
	if err != nil {
		panic(err)
	}

	app := fiber.New()

	api := app.Group("/api")

	sessionsApi := api.Group("/sessions")

	sessionsApi.Post("/", func(c *fiber.Ctx) error {
		session := &models.Session{
			ID:    ksuid.New().String(),
			Title: "Tasks list",
		}

		err := session.Insert(c.Context(), conn, boil.Infer())
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}

		return c.JSON(session)
	})

	sessionsApi.Get("/:id", func(c *fiber.Ctx) error {
		session, err := models.FindSession(c.Context(), conn, c.Params("id"))
		if err != nil && err != sql.ErrNoRows {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		} else if err == sql.ErrNoRows {
			return c.Status(404).JSON(fiber.Map{"error": "Session not found"})
		}

		return c.JSON(session)
	})

	tasksApi := api.Group("/tasks")

	tasksApi.Get("/", func(c *fiber.Ctx) error {
		var request ListTasksRequest
		if err := c.BodyParser(&request); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": err.Error()})
		}

		session, err := models.FindSession(c.Context(), conn, request.SessionID)

		if err != nil && err != sql.ErrNoRows {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		} else if err == sql.ErrNoRows {
			return c.Status(404).JSON(fiber.Map{"error": "Session not found"})
		}

		tasks, err := models.Tasks(models.TaskWhere.SessionID.EQ(session.ID)).All(c.Context(), conn)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(tasks)
	})

	tasksApi.Post("/", func(c *fiber.Ctx) error {
		var request CreateTaskRequest
		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": err.Error(),
			})
		}

		session, err := models.Sessions(models.SessionWhere.ID.EQ(request.SessionID)).One(c.Context(), conn)
		if err != nil && err != sql.ErrNoRows {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": err.Error(),
			})
		} else if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "Session not found",
			})
		}

		task := models.Task{
			ID:        ksuid.New().String(),
			Title:     request.Title,
			SessionID: session.ID,
		}

		if err = task.Insert(c.Context(), conn, boil.Infer()); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"id":         task.ID,
			"title":      request.Title,
			"session_id": task.SessionID,
		})
	})

	tasksApi.Put("/:id", func(c *fiber.Ctx) error {
		var request UpdateTaskRequest
		if err := c.BodyParser(&request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": err.Error(),
			})
		}

		task, err := models.FindTask(c.Context(), conn, c.Params("id"))
		if err != nil && err != sql.ErrNoRows {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": err.Error(),
			})
		} else if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "Task not found",
			})
		}

		task.Title = request.Title
		_, err = task.Update(c.Context(), conn, boil.Infer())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": err.Error(),
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"id":         task.ID,
			"title":      request.Title,
			"session_id": task.SessionID,
		})
	})

	tasksApi.Delete("/:id", func(c *fiber.Ctx) error {
		task, err := models.FindTask(c.Context(), conn, c.Params("id"))
		if err != nil && err != sql.ErrNoRows {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": err.Error(),
			})
		} else if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "Task not found",
			})
		}

		_, err = task.Delete(c.Context(), conn)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": err.Error(),
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Task deleted",
		})
	})

	app.Listen(":3333")
}
