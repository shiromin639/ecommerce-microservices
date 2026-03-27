package data

import (
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
