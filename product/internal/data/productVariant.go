package data

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type ProductVariant struct {
	ID         uuid.UUID
	ProductID  uuid.UUID
	SKU        string            // warehouse identifier, unique across ALL variants
	Attributes map[string]string // flexible: {"ram":"16GB","storage":"512GB","color":"silver"}
	// stored as JSONB in Postgres
	PriceOverride *decimal.Decimal // nil means "use Product.BasePrice"
	// pointer because absence of value is meaningful
	WeightKg  decimal.Decimal // needed for shipping cost calculation
	IsActive  bool            // false = variant discontinued, product still shown
	CreatedAt time.Time
}
