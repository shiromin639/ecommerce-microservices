package data

import (
	"time"

	"github.com/google/uuid"
)

type ProductImage struct {
	ID           uuid.UUID
	ProductID    uuid.UUID
	VariantID    *uuid.UUID // Optional: If nil, it belongs to the main product. If set, it's specific to a variant (e.g., the "Red" color)
	URL          string     // The CDN or storage path, e.g., "s3://bucket/image.jpg"
	AltText      string     // Important for SEO and accessibility (screen readers)
	DisplayOrder int        // Used to sort gallery images. 0 is usually the primary/cover image.
	CreatedAt    time.Time
}
