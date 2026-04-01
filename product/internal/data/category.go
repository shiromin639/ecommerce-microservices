package data

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type Category struct {
	ID          uuid.UUID  `json:"id"`
	ParentID    *uuid.UUID `json:"parent_id"`
	Name        string     `json:"name"`
	Slug        string     `json:"slug"`
	Description string     `json:"description"`
	IsActive    bool       `json:is_active"` // false = hidden from navigation, products still exist
	CreatedAt   time.Time  `json:"created_at"`
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
