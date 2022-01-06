//go:generate sqlboiler --add-global-variants --config app.toml --pkgname model psql

package main

import (
	"database/sql"
	"fmt"

	"github.com/Tex-Tang/Todo-Link/server/router"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/volatiletech/sqlboiler/v4/boil"
)

func main() {
	config := LoadConfig()

	// Setup Database
	conn, err := sql.Open("pgx", config.DB.URL)
	if err != nil {
		panic(err)
	}
	boil.SetDB(conn)

	// Setup HTTP Server
	app := fiber.New()
	app.Use(cors.New()) // Enable CORS
	router.RegisterRoutes(app)
	app.Listen(fmt.Sprintf(":%d", config.Server.Port))
}
