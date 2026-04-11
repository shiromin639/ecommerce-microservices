package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (app *application) routes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Get("/v1/healthcheck", app.healthcheckHandler)

	r.Post("/v1/categories", app.createCategoryHandler)
	r.Get("/v1/categories", app.listCategoriesHandler)
	return r
}
