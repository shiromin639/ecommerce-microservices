package main

import (
	"net/http"
	"product/internal/data"
	"time"
)

func (app *application) createCategoryHandler(w http.ResponseWriter, r *http.Request) {
	// type Category struct {
	// 	ID       uuid.UUID
	// 	ParentID *uuid.UUID // nil = root category (no parent)
	// 	// pointer because NULL is meaningful here
	// 	Name        string
	// 	Slug        string
	// 	Description string
	// 	IsActive    bool // false = hidden from navigation, products still exist
	// 	CreatedAt   time.Time
	// }
	var input struct {
		Name        string
		Slug        string
		Description string
	}

	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	category := data.Category{
		Name:        input.Name,
		Slug:        input.Slug,
		Description: input.Description,
		IsActive:    false,
		CreatedAt:   time.Now(),
	}

	err = app.models.Categories.Insert(&category)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = app.writeJSON(w, http.StatusCreated, envelope{"category": category}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
