package shared

// CV represents the CV entity stored in DynamoDB.
type CV struct {
	ID          string `json:"id" dynamodbav:"id"`
	Title       string `json:"title" dynamodbav:"title"`
	Description string `json:"description,omitempty" dynamodbav:"description,omitempty"`
	Version     int    `json:"version" dynamodbav:"version"`
	CvContent   string `json:"cvContent,omitempty" dynamodbav:"cvContent,omitempty"` // JSON string
	Owner       string `json:"owner" dynamodbav:"owner"`
	CreatedAt   string `json:"createdAt" dynamodbav:"createdAt"`
	UpdatedAt   string `json:"updatedAt" dynamodbav:"updatedAt"`
}

// Ingot represents the Ingot entity stored in DynamoDB.
type Ingot struct {
	ID        string `json:"id" dynamodbav:"id"`
	Name      string `json:"name" dynamodbav:"name"`
	Type      string `json:"type" dynamodbav:"type"`
	Content   string `json:"content,omitempty" dynamodbav:"content,omitempty"` // JSON string
	Owner     string `json:"owner" dynamodbav:"owner"`
	CreatedAt string `json:"createdAt" dynamodbav:"createdAt"`
	UpdatedAt string `json:"updatedAt" dynamodbav:"updatedAt"`
}

// CreateCVInput is the request body for creating a CV.
type CreateCVInput struct {
	Title       string `json:"title"`
	Description string `json:"description,omitempty"`
	Version     int    `json:"version"`
	CvContent   string `json:"cvContent,omitempty"`
}

// UpdateCVInput is the request body for updating a CV.
type UpdateCVInput struct {
	Title       *string `json:"title,omitempty"`
	Description *string `json:"description,omitempty"`
	Version     *int    `json:"version,omitempty"`
	CvContent   *string `json:"cvContent,omitempty"`
}

// CreateIngotInput is the request body for creating an Ingot.
type CreateIngotInput struct {
	Name    string `json:"name"`
	Type    string `json:"type"`
	Content string `json:"content,omitempty"`
}

// UpdateIngotInput is the request body for updating an Ingot.
type UpdateIngotInput struct {
	Name    *string `json:"name,omitempty"`
	Type    *string `json:"type,omitempty"`
	Content *string `json:"content,omitempty"`
}
