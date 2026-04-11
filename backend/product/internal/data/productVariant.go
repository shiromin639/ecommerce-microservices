package data

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type ProductVariant struct {
	ID            uuid.UUID
	ProductID     uuid.UUID
	SKU           string
	Attributes    map[string]string
	PriceOverride *decimal.Decimal
	IsActive      bool
	CreatedAt     time.Time
}
