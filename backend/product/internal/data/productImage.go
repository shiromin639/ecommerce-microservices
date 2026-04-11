package data

import (
	"time"

	"github.com/google/uuid"
)

type ProductImage struct {
	ID           uuid.UUID
	ProductID    uuid.UUID
	VariantID    *uuid.UUID
	URL          string
	AltText      string
	DisplayOrder int
	CreatedAt    time.Time
}
