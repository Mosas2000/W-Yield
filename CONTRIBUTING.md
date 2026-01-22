# Contributing to W-Yield

Thank you for your interest in contributing to W-Yield!

## Development Setup

1. Clone the repository
```bash
git clone git@github.com:Mosas2000/W-Yield.git
cd W-Yield
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```bash
cp .env.example .env
# Add your private key and API keys
```

4. Run tests
```bash
npm test
```

## Development Workflow

1. Create a feature branch from `develop`
```bash
git checkout develop
git pull
git checkout -b feature/your-feature
```

2. Make your changes and test
```bash
npm test
npm run compile
```

3. Commit with conventional commits
```bash
git commit -m "feat: add new feature"
```

4. Push and create a pull request
```bash
git push origin feature/your-feature
```

## Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test changes
- `chore:` Build process or auxiliary tool changes

## Testing

All pull requests must:
- Pass all tests
- Maintain >80% code coverage
- Follow Solidity best practices

## Questions?

Contact: cryptosecure.base.eth
