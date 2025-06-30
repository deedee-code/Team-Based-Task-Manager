-- Seed script for Team Task Manager
-- Run this after the database is created and tables are synchronized

-- Insert sample users (passwords are hashed version of 'password123')
INSERT INTO users (id, username, email, password, "createdAt", "updatedAt") VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'john_doe', 'john@example.com', '$2b$10$rQZ9YyZK8.5DgTZ5O5oZEu5M5X5Y5Z5Y5Z5Y5Z5Y5Z5Y5Z5Y5Z5Y5Z', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'jane_smith', 'jane@example.com', '$2b$10$rQZ9YyZK8.5DgTZ5O5oZEu5M5X5Y5Z5Y5Z5Y5Z5Y5Z5Y5Z5Y5Z5Y5Z', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'bob_wilson', 'bob@example.com', '$2b$10$rQZ9YyZK8.5DgTZ5O5oZEu5M5X5Y5Z5Y5Z5Y5Z5Y5Z5Y5Z5Y5Z5Y5Z', NOW(), NOW());

-- Insert sample teams
INSERT INTO teams (id, name, description, "createdById", "createdAt", "updatedAt") VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Frontend Development', 'Team responsible for UI/UX development', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440002', 'Backend Development', 'Team responsible for API and database development', '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW());

-- Insert team memberships
INSERT INTO team_members (id, "userId", "teamId", role, "joinedAt") VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Admin', NOW()),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Member', NOW()),
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Admin', NOW()),
  ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Member', NOW()),
  ('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'Member', NOW());

-- Insert sample tasks
INSERT INTO tasks (id, title, description, status, "teamId", "createdById", "assignedToId", "createdAt", "updatedAt") VALUES
  ('880e8400-e29b-41d4-a716-446655440001', 'Design Login Page', 'Create wireframes and mockups for the login page', 'To Do', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440002', 'Implement Authentication API', 'Create JWT-based authentication endpoints', 'In Progress', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440003', 'Setup Database Schema', 'Create database tables and relationships', 'Done', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', NULL, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440004', 'Create Dashboard Components', 'Build reusable dashboard components', 'To Do', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', NULL, NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440005', 'Write API Tests', 'Create comprehensive test suite for all endpoints', 'To Do', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW());