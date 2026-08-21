package shared

import (
	"testing"
	"time"
)

func TestNowISO_ValidFormat(t *testing.T) {
	result := NowISO()

	_, err := time.Parse(time.RFC3339, result)
	if err != nil {
		t.Errorf("NowISO() returned invalid RFC3339 format: %s, error: %v", result, err)
	}
}

func TestNowISO_ReturnsUTC(t *testing.T) {
	result := NowISO()

	parsed, err := time.Parse(time.RFC3339, result)
	if err != nil {
		t.Fatalf("failed to parse: %v", err)
	}

	if parsed.Location() != time.UTC {
		t.Errorf("expected UTC, got %v", parsed.Location())
	}
}

func TestStringPtr(t *testing.T) {
	s := "hello"
	ptr := StringPtr(s)

	if ptr == nil {
		t.Fatal("expected non-nil pointer")
	}
	if *ptr != s {
		t.Errorf("expected '%s', got '%s'", s, *ptr)
	}
}
