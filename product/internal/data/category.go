package data

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type Category struct {
	ID       uuid.UUID
	ParentID *uuid.UUID // nil = root category (no parent)
	// pointer because NULL is meaningful here
	Name        string
	Slug        string
	Description string
	IsActive    bool // false = hidden from navigation, products still exist
	CreatedAt   time.Time
}

type CategoryModel struct {
	DB *sql.DB
}

func (c *CategoryModel) Insert(category *Category) error {
	query := `
		INSERT INTO categories (name, slug, description)
		VALUES ($1, $2, $3) 
		RETURNING id, is_active, created_at`

	args := []any{category.Name, category.Slug, category.Description}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	return c.DB.QueryRowContext(ctx, query, args...).Scan(&category.ID, &category.IsActive, &category.CreatedAt)
}
