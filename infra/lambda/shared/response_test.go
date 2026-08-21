package shared

import (
	"encoding/json"
	"net/http"
	"testing"
)

func TestSuccess(t *testing.T) {
	body := map[string]string{"message": "ok"}
	resp, err := Success(body)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected status 200, got %d", resp.StatusCode)
	}

	if resp.Headers["Content-Type"] != "application/json" {
		t.Errorf("expected Content-Type application/json, got %s", resp.Headers["Content-Type"])
	}

	if resp.Headers["Access-Control-Allow-Origin"] != "*" {
		t.Errorf("expected CORS header, got %s", resp.Headers["Access-Control-Allow-Origin"])
	}

	var parsed map[string]string
	if err := json.Unmarshal([]byte(resp.Body), &parsed); err != nil {
		t.Fatalf("failed to parse body: %v", err)
	}
	if parsed["message"] != "ok" {
		t.Errorf("expected message 'ok', got '%s'", parsed["message"])
	}
}

func TestCreated(t *testing.T) {
	resp, err := Created(map[string]string{"id": "123"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusCreated {
		t.Errorf("expected status 201, got %d", resp.StatusCode)
	}
}

func TestBadRequest(t *testing.T) {
	resp, err := BadRequest("invalid input")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("expected status 400, got %d", resp.StatusCode)
	}
	assertErrorBody(t, resp.Body, "invalid input")
}

func TestUnauthorized(t *testing.T) {
	resp, err := Unauthorized("no token")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("expected status 401, got %d", resp.StatusCode)
	}
	assertErrorBody(t, resp.Body, "no token")
}

func TestForbidden(t *testing.T) {
	resp, err := Forbidden("access denied")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden {
		t.Errorf("expected status 403, got %d", resp.StatusCode)
	}
	assertErrorBody(t, resp.Body, "access denied")
}

func TestNotFound(t *testing.T) {
	resp, err := NotFound("not found")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusNotFound {
		t.Errorf("expected status 404, got %d", resp.StatusCode)
	}
	assertErrorBody(t, resp.Body, "not found")
}

func TestMethodNotAllowed(t *testing.T) {
	resp, err := MethodNotAllowed()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusMethodNotAllowed {
		t.Errorf("expected status 405, got %d", resp.StatusCode)
	}
}

func TestInternalError(t *testing.T) {
	resp, err := InternalError("something broke")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusInternalServerError {
		t.Errorf("expected status 500, got %d", resp.StatusCode)
	}
	assertErrorBody(t, resp.Body, "something broke")
}

func TestCORSHeaders(t *testing.T) {
	resp, _ := Success(nil)
	expected := map[string]string{
		"Access-Control-Allow-Origin":  "*",
		"Access-Control-Allow-Headers": "Content-Type,Authorization",
		"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
		"Content-Type":                 "application/json",
	}
	for key, val := range expected {
		if resp.Headers[key] != val {
			t.Errorf("expected header %s=%s, got %s", key, val, resp.Headers[key])
		}
	}
}

func assertErrorBody(t *testing.T, body string, expectedMessage string) {
	t.Helper()
	var parsed map[string]string
	if err := json.Unmarshal([]byte(body), &parsed); err != nil {
		t.Fatalf("failed to parse error body: %v", err)
	}
	if parsed["error"] != expectedMessage {
		t.Errorf("expected error '%s', got '%s'", expectedMessage, parsed["error"])
	}
}
