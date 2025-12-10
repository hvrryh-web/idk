# Contributing to WuXuxian TTRPG Webapp

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Getting Started

### Important Security Note

**For CI/CD:** The GitHub Actions workflow supports optional secrets for test database credentials:
- `TEST_DB_USER` (defaults to 'postgres' if not set)
- `TEST_DB_PASSWORD` (defaults to 'postgres' if not set)

While hardcoded credentials are acceptable for local development and CI test databases, **never commit production credentials** to the repository.

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL 15+
- Docker and Docker Compose (for local database)

### Setting Up Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/hvrryh-web/idk.git
   cd idk
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   # Edit .env files with your configuration
   ```

3. **Start the database**
   ```bash
   cd infra
   docker-compose up -d
   cd ..
   ```

4. **Set up the backend**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

5. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

## Development Workflow

### Running the Application

1. **Backend**
   ```bash
   cd backend
   source .venv/bin/activate
   uvicorn app.main:app --reload --port 8000
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Running Tests

**All tests:**
```bash
./start-tests.sh
```

**Backend tests only:**
```bash
cd backend
source .venv/bin/activate
pytest tests/ -v
```

**Frontend tests only:**
```bash
cd frontend
npm test
```

**Watch mode (for development):**
```bash
cd frontend
npm run test:watch
```

### Code Quality

#### Python (Backend)

**Formatting:**
```bash
cd backend
source .venv/bin/activate
pip install black isort ruff
black .
isort .
```

**Linting:**
```bash
ruff check .
```

**Auto-fix linting issues:**
```bash
ruff check . --fix
```

#### TypeScript (Frontend)

**Formatting:**
```bash
cd frontend
npm run format
```

**Check formatting:**
```bash
npm run format:check
```

**Linting:**
```bash
npm run lint
```

**Auto-fix linting issues:**
```bash
npm run lint:fix
```

## Code Style Guidelines

### Python
- Follow PEP 8 style guide
- Use type hints for function signatures
- Maximum line length: 100 characters
- Use descriptive variable and function names
- Add docstrings to all public functions and classes

### TypeScript/React
- Use functional components with hooks
- Use TypeScript for all new code
- Follow React best practices
- Use descriptive prop and variable names
- Add JSDoc comments for complex functions

### General
- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Follow DRY (Don't Repeat Yourself) principle

## Testing Guidelines

- Write tests for all new features
- Ensure all tests pass before submitting a PR
- Aim for high test coverage
- Test both success and error cases
- Use descriptive test names

### Backend Test Structure
```python
def test_feature_description():
    """Test description explaining what is being tested."""
    # Arrange
    setup_code()
    
    # Act
    result = function_under_test()
    
    # Assert
    assert result == expected_value
```

### Frontend Test Structure
```typescript
describe('Component Name', () => {
  it('should do something specific', async () => {
    // Arrange
    render(<Component />);
    
    // Act
    await userEvent.click(screen.getByRole('button'));
    
    // Assert
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **chore**: Changes to build process or auxiliary tools

### Examples
```
feat(backend): add techniques API endpoints

Implement CRUD operations for techniques including:
- Create technique
- List techniques with filters
- Get technique by ID
- Update technique
- Delete technique

Closes #123
```

```
fix(frontend): handle loading state correctly

Fix issue where loading spinner wasn't shown during data fetch
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow code style guidelines
   - Write/update tests
   - Update documentation if needed

3. **Test your changes**
   ```bash
   ./start-tests.sh
   ```

4. **Format and lint your code**
   ```bash
   # Backend
   cd backend
   black .
   isort .
   ruff check . --fix
   
   # Frontend
   cd frontend
   npm run format
   npm run lint:fix
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "type(scope): description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Use a descriptive title
   - Provide a detailed description of changes
   - Reference any related issues
   - Ensure CI checks pass

### PR Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] New code has tests
- [ ] Documentation updated
- [ ] Commit messages follow guidelines
- [ ] No merge conflicts

## Reporting Issues

When reporting issues, please include:
- Clear and descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Python version, Node version)

## Questions?

If you have questions or need help, feel free to:
- Open an issue with the "question" label
- Reach out to the maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
