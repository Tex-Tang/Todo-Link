package router

import (
	"github.com/Tex-Tang/Todo-Link/server/service"
	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
	api := app.Group("/api")

	sessionsApi := api.Group("/sessions")

	sessionsApi.Post("/", service.CreateSession)
	sessionsApi.Get("/:id", service.RetrieveSession)
	sessionsApi.Put("/:id", service.UpdateSession)

	tasksApi := api.Group("/tasks")

	tasksApi.Post("/", service.CreateTask)
	tasksApi.Get("/", service.ListTasks)
	tasksApi.Put("/:id", service.UpdateTask)
	tasksApi.Delete("/:id", service.DeleteTask)
}
