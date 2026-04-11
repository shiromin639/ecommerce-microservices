package data

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type ProductStatus string

const (
	StatusDraft    ProductStatus = "draft"    // not visible to customers
	StatusActive   ProductStatus = "active"   // live in the catalog
	StatusArchived ProductStatus = "archived" // hidden, kept for order history
)

type Product struct {
	ID          uuid.UUID
	CategoryID  uuid.UUID // required — every product belongs to one category
	Name        string
	Slug        string // "dell-xps-15-9500" — URL-safe, unique, generated from Name
	Brand       string
	Description string
	BasePrice   decimal.Decimal // never float64 — floats lose precision on money
	Status      ProductStatus
	Tags        []string // stored as text[] in Postgres; enables filtering
	CreatedAt   time.Time
	UpdatedAt   time.Time
	Version     int32 // incremented on every UPDATE; used in WHERE clause
	// to detect concurrent modifications (optimistic locking)
}

type ProductModel struct {
	DB *sql.DB
}
