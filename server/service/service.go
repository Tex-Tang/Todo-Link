package service

import "github.com/gofiber/fiber/v2"

var (
	ErrBadRequest          = fiber.NewError(fiber.StatusBadRequest, "Bad request")
	ErrInternalServerError = fiber.NewError(fiber.StatusInternalServerError, "Internal server error")

	// Session
	ErrSessionNotFound = fiber.NewError(fiber.StatusNotFound, "Session not found")

	// Task
	ErrTaskNotFound = fiber.NewError(fiber.StatusNotFound, "Task not found")
)
