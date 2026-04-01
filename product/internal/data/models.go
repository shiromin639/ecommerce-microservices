package data

import (
	"database/sql"
	"errors"
)

var (
	ErrNotFound      = errors.New("record not found")
	ErrSlugConflict  = errors.New("slug already exists")
	ErrEditConflict  = errors.New("edit conflict") // optimistic lock failure
	ErrInvalidStatus = errors.New("invalid status transition")
)

type Models struct {
	Products ProductModel
}

func NewModels(db *sql.DB) Models {
	return Models{}
}
