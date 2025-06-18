#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${GREEN}🌱 Seeding YOLO Task Manager Database...${NC}"

# Check if PostgreSQL container is running
if ! docker-compose ps postgres | grep -q "Up"; then
    echo -e "${RED}❌ PostgreSQL container is not running. Please start it first with: docker-compose up -d postgres${NC}"
    exit 1
fi

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
until docker-compose exec -T postgres pg_isready -U yolo_user -d yolo_db; do
    echo -e "${YELLOW}⏳ PostgreSQL is not ready yet, waiting...${NC}"
    sleep 2
done

echo -e "${GREEN}✅ PostgreSQL is ready!${NC}"

# Create seed data SQL file
echo -e "${YELLOW}📝 Creating seed data...${NC}"
cat > seed-data.sql << 'EOF'
-- Clear existing data (optional - comment out if you want to keep existing data)
-- DELETE FROM task;
-- DELETE FROM category;

-- Seed Categories
INSERT INTO category (title, description, "createdAt", "updatedAt") VALUES
('Work', 'Tasks related to work and professional development', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Personal', 'Personal tasks and daily activities', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Shopping', 'Shopping lists and errands', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Health & Fitness', 'Health and fitness related tasks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Learning', 'Educational and learning tasks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Seed Tasks
INSERT INTO task (title, description, "dueDate", status, "categoryId", "createdAt", "updatedAt") VALUES
-- Work tasks
('Complete project proposal', 'Finish the Q4 project proposal document', '2024-01-15 17:00:00', 'In Progress', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Review team code', 'Code review for the new feature branch', '2024-01-12 16:00:00', 'To Do', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Prepare presentation', 'Create slides for the client meeting', '2024-01-18 14:00:00', 'To Do', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Update documentation', 'Update API documentation with new endpoints', '2024-01-20 18:00:00', 'Done', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Personal tasks
('Call mom', 'Weekly check-in call with family', '2024-01-14 19:00:00', 'To Do', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Plan weekend trip', 'Research and plan the upcoming weekend getaway', '2024-01-16 20:00:00', 'In Progress', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Organize closet', 'Clean and organize the bedroom closet', '2024-01-22 15:00:00', 'To Do', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Shopping tasks
('Buy groceries', 'Weekly grocery shopping - milk, bread, vegetables', '2024-01-13 18:00:00', 'Done', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Get new headphones', 'Replace broken wireless headphones', '2024-01-17 16:00:00', 'To Do', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Purchase birthday gift', 'Buy gift for friend''s birthday party', '2024-01-19 12:00:00', 'In Progress', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Health & Fitness tasks
('Morning workout', '30-minute cardio session', '2024-01-14 07:00:00', 'Done', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Book dentist appointment', 'Schedule annual dental checkup', '2024-01-25 10:00:00', 'To Do', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Buy protein powder', 'Restock protein supplement', '2024-01-16 17:00:00', 'To Do', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Learning tasks
('Complete online course', 'Finish the React advanced course', '2024-01-30 23:59:59', 'In Progress', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Read programming book', 'Read chapters 5-7 of Clean Code', '2024-01-28 22:00:00', 'To Do', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Practice algorithms', 'Solve 3 LeetCode problems', '2024-01-15 21:00:00', 'Done', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
EOF

# Execute the seed data
echo -e "${YELLOW}🌱 Seeding database with initial data...${NC}"
docker-compose exec -T postgres psql -U yolo_user -d yolo_db -f /dev/stdin < seed-data.sql

# Clean up the temporary SQL file
rm seed-data.sql

echo -e "${GREEN}✅ Database seeding complete!${NC}"
echo -e "${GREEN}📊 Seeded with:${NC}"
echo -e "   • 5 categories (Work, Personal, Shopping, Health & Fitness, Learning)"
echo -e "   • 15 tasks across different categories and statuses"

echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "   • Start the backend: docker-compose up -d backend"
echo -e "   • Start the frontend: docker-compose up -d frontend"
echo -e "   • Or run the full setup: ./setup-database.sh" 