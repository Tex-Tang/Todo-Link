package service

import (
	"database/sql"

	"github.com/Tex-Tang/Todo-Link/server/model"
	"github.com/gofiber/fiber/v2"
	"github.com/segmentio/ksuid"
	"github.com/volatiletech/sqlboiler/v4/boil"
)

type SessionRequest struct {
	Title string `json:"title" validate:"required"`
}

func CreateSession(c *fiber.Ctx) error {
	var request *SessionRequest
	if err := c.BodyParser(&request); err != nil {
		return ErrBadRequest
	}

	session := &model.Session{
		ID:    ksuid.New().String(),
		Title: request.Title,
	}

	err := session.InsertG(c.Context(), boil.Infer())

	if err != nil {
		return ErrInternalServerError
	}

	return c.JSON(session)
}

func RetrieveSession(c *fiber.Ctx) error {
	session, err := model.FindSessionG(c.Context(), c.Params("id"))

	if err != nil && err != sql.ErrNoRows {
		return ErrInternalServerError
	} else if err == sql.ErrNoRows {
		return ErrBadRequest
	}

	return c.JSON(session)
}

func UpdateSession(c *fiber.Ctx) error {
	var request *SessionRequest
	if err := c.BodyParser(&request); err != nil {
		return ErrBadRequest
	}

	session, err := model.FindSessionG(c.Context(), c.Params("id"))

	if err != nil && err != sql.ErrNoRows {
		return ErrInternalServerError
	} else if err == sql.ErrNoRows {
		return ErrBadRequest
	}

	session.Title = request.Title

	_, err = session.UpdateG(c.Context(), boil.Infer())

	if err != nil {
		return ErrInternalServerError
	}

	return c.JSON(session)
}
