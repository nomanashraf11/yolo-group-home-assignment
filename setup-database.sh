

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${YELLOW}Checking if Docker is running...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Docker isn't running. Please start Docker Desktop first.${NC}"
    exit 1
fi
echo -e "${GREEN}Docker is running!${NC}"

# clear any existing setup
echo -e "${YELLOW}Cleaning up existing containers...${NC}"
docker-compose down > /dev/null 2>&1
docker volume rm yolo-group-home-assignment_postgres_data > /dev/null 2>&1

# Start the postgres and backend servers
echo -e "${PURPLE}Starting database and backend...${NC}"
docker-compose up -d postgres backend


echo -e "${YELLOW}Waiting for backend to start...${NC}"

attempts=0
max_attempts=30
while [ $attempts -lt $max_attempts ]; do
    if curl -s http://localhost:3000/api > /dev/null 2>&1; then
        echo -e "${GREEN}Backend ready!${NC}"
        break
    fi
    
    attempts=$((attempts + 1))
    echo -e "${YELLOW}Starting... (${attempts}/${max_attempts})${NC}"
    sleep 3
done

if [ $attempts -eq $max_attempts ]; then
    echo -e "${RED}Backend failed to start. Check logs: docker-compose logs backend${NC}"
    exit 1
fi

# seeding data
echo -e "${PURPLE}Adding sample data...${NC}"

cat > seed-data.sql << 'EOF'
-- Categories
INSERT INTO category (title, description, "createdAt", "updatedAt") VALUES
('Work', 'Tasks related to work and professional development', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Personal', 'Personal tasks and daily activities', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Shopping', 'Shopping lists and errands', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Health & Fitness', 'Health and fitness related tasks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Learning', 'Educational and learning tasks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Tasks
INSERT INTO task (title, description, "dueDate", status, "categoryId", "createdAt", "updatedAt") VALUES
('Complete project proposal', 'Finish the Q4 project proposal document', '2024-01-15 17:00:00', 'In Progress', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Review team code', 'Code review for the new feature branch', '2024-01-12 16:00:00', 'To Do', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Prepare presentation', 'Create slides for the client meeting', '2024-01-18 14:00:00', 'To Do', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Update documentation', 'Update API documentation', '2024-01-20 18:00:00', 'Done', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Call mom', 'Weekly check-in call with family', '2024-01-14 19:00:00', 'To Do', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Plan weekend trip', 'Research and plan weekend getaway', '2024-01-16 20:00:00', 'In Progress', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Organize closet', 'Clean and organize bedroom closet', '2024-01-22 15:00:00', 'To Do', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Buy groceries', 'Weekly grocery shopping', '2024-01-13 18:00:00', 'Done', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Get new headphones', 'Replace broken wireless headphones', '2024-01-17 16:00:00', 'To Do', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Purchase birthday gift', 'Buy gift for friend birthday party', '2024-01-19 12:00:00', 'In Progress', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Morning workout', '30-minute cardio session', '2024-01-14 07:00:00', 'Done', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Book dentist appointment', 'Schedule annual dental checkup', '2024-01-25 10:00:00', 'To Do', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Buy protein powder', 'Restock protein supplement', '2024-01-16 17:00:00', 'To Do', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Complete online course', 'Finish the React advanced course', '2024-01-30 23:59:59', 'In Progress', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Read programming book', 'Read chapters 5-7 of Clean Code', '2024-01-28 22:00:00', 'To Do', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Practice algorithms', 'Solve 3 LeetCode problems', '2024-01-15 21:00:00', 'Done', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
EOF

if docker-compose exec -T postgres psql -U yolo_user -d yolo_db -f /dev/stdin < seed-data.sql; then
    echo -e "${GREEN}Sample data added!${NC}"
else
    echo -e "${RED}Failed to add sample data.${NC}"
fi

rm seed-data.sql

# NOW RUNNING THE FRONTEND
echo -e "${PURPLE}Starting frontend...${NC}"
docker-compose up -d frontend

sleep 5

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${BLUE}Frontend: http://localhost:4200${NC}"
echo -e "${BLUE}Backend: http://localhost:3000${NC}"
echo -e "${BLUE}API Docs: http://localhost:3000/api${NC}" 