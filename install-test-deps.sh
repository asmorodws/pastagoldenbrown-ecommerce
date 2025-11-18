#!/bin/bash

# Test Dependencies Installation Script
# Run this after freeing up disk space

echo " Installing Jest and Testing Dependencies..."

# Core testing libraries
npm install -D --legacy-peer-deps \
  jest \
  jest-environment-jsdom \
  ts-node \
  @testing-library/react \
  @testing-library/dom \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @types/jest

echo " Testing dependencies installed!"

echo ""
echo " Available test commands:"
echo "  npm test              - Run all tests"
echo "  npm run test:watch    - Run tests in watch mode"
echo "  npm run test:coverage - Run tests with coverage report"
echo ""
echo " See TESTING_GUIDE.md for detailed information"
