package service

import (
	"database/sql"
	"fmt"

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
		fmt.Println(err)
		return ErrInternalServerError
	}

	return c.JSON(session)
}

func RetrieveSession(c *fiber.Ctx) error {
	session, err := model.FindSessionG(c.Context(), c.Params("id"))

	if err != nil && err != sql.ErrNoRows {
		fmt.Println(err)
		return ErrInternalServerError
	} else if err == sql.ErrNoRows {
		return ErrSessionNotFound
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
		fmt.Println(err)
		return ErrInternalServerError
	} else if err == sql.ErrNoRows {
		return ErrSessionNotFound
	}

	session.Title = request.Title

	_, err = session.UpdateG(c.Context(), boil.Infer())

	if err != nil {
		fmt.Println(err)
		return ErrInternalServerError
	}

	return c.JSON(session)
}

func DeleteSession(c *fiber.Ctx) error {
	session, err := model.FindSessionG(c.Context(), c.Params("id"))

	if err != nil && err != sql.ErrNoRows {
		fmt.Println(err)
		return ErrInternalServerError
	} else if err == sql.ErrNoRows {
		return ErrSessionNotFound
	}

	tx, err := boil.BeginTx(c.Context(), nil)
	if err != nil {
		return err
	}

	_, err = model.Tasks(model.TaskWhere.SessionID.EQ(session.ID)).DeleteAll(c.Context(), tx)

	if err != nil {
		fmt.Println(err)
		return ErrInternalServerError
	}

	_, err = session.Delete(c.Context(), tx)

	if err != nil {
		fmt.Println(err)
		return ErrInternalServerError
	}

	err = tx.Commit()
	if err != nil {
		tx.Rollback()
		fmt.Println(err)
		return ErrInternalServerError
	}

	return c.JSON(fiber.Map{
		"message": "Session deleted",
	})
}
