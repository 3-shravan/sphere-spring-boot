#!/usr/bin/env bash
# ------------------------------------------------------------
# Sphere Microservices CLI
# ------------------------------------------------------------

# ANSI Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Determine repo root
REPO_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start Order matters! Discovery first, then Gateway, then microservices.
SERVICES=(
  "discovery-service"
  "api-gateway"
  "user-service"
  "post-service"
  "notification-service"
)

PID_FILE="$REPO_ROOT/.service_pids"

function stop() {
  echo -e "${YELLOW}➜ Stopping running services...${NC}"
  if [ -f "$PID_FILE" ]; then
    while read -r pid; do
      if kill -0 "$pid" 2>/dev/null; then
        kill "$pid" 2>/dev/null
        echo -e "${GREEN}  ✓ Killed PID $pid${NC}"
      fi
    done < "$PID_FILE"
    rm -f "$PID_FILE"
  fi
  
  # Fallback: kill processes running on known ports just to be perfectly fresh
  for port in 8761 8080 8081 8082 8083; do
    PIDS=$(lsof -t -i:$port 2>/dev/null)
    if [ ! -z "$PIDS" ]; then
      for pid in $PIDS; do
        kill -9 "$pid" 2>/dev/null
        echo -e "${GREEN}  ✓ Force killed process on port $port (PID $pid)${NC}"
      done
    fi
  done
  
  echo -e "${GREEN}All background services stopped.${NC}\n"
}

function clean() {
  stop
  echo -e "${YELLOW}➜ Cleaning compiled artifacts...${NC}"
  for svc in "${SERVICES[@]}"; do
    if [ -d "$REPO_ROOT/$svc/target" ]; then
      rm -rf "$REPO_ROOT/$svc/target"
      echo -e "${GREEN}  ✓ Cleaned $svc${NC}"
    else
      echo -e "${BLUE}  - Skipped $svc (no target folder)${NC}"
    fi
  done
  echo -e "${GREEN}Clean complete.${NC}\n"
}

function build() {
  stop
  echo -e "${YELLOW}➜ Building all services...${NC}"
  for svc in "${SERVICES[@]}"; do
    echo -e "${BLUE}  ⚙ Building $svc...${NC}"
    (cd "$REPO_ROOT/$svc" && mvn -B clean package -DskipTests > /dev/null)
    if [ $? -ne 0 ]; then
      echo -e "${RED}  ✗ Error building $svc. Aborting.${NC}"
      exit 1
    fi
    echo -e "${GREEN}  ✓ Successfully built $svc${NC}"
  done
  echo -e "${GREEN}Build finished.${NC}\n"
}

function start() {
  stop
  echo -e "${YELLOW}➜ Starting services in background...${NC}"
  > "$PID_FILE"
  for svc in "${SERVICES[@]}"; do
    echo -e "${BLUE}  ▶ Starting $svc...${NC}"
    (
      cd "$REPO_ROOT/$svc"
      
      # Automatically load .env file if it exists
      if [ -f ".env" ]; then
        echo -e "${YELLOW}    Loading environment variables from $svc/.env${NC}"
        export $(grep -v '^#' .env | xargs)
      fi
      
      nohup mvn -B spring-boot:run > "log.out" 2>&1 &
      echo $! >> "$PID_FILE"
    )
    
    if [ "$svc" == "discovery-service" ]; then
      echo -e "${YELLOW}    Waiting 15 seconds for Eureka Discovery Server to initialize...${NC}"
      sleep 15
    else
      sleep 3
    fi
  done
  echo -e "${GREEN}All services started successfully!${NC}"
  echo -e "${CYAN}Logs are being written to [service-name]/log.out${NC}\n"
}

function run_all() {
  clean
  build
  start
}

function help() {
  echo -e "${CYAN}================================================${NC}"
  echo -e "${CYAN}          Sphere Microservices CLI              ${NC}"
  echo -e "${CYAN}================================================${NC}"
  echo -e "Usage: ${CYAN}./start.sh [command]${NC}\n"
  echo -e "Commands:"
  echo -e "  ${GREEN}all${NC}     - Stops existing, cleans, builds, and starts all services (Recommended)"
  echo -e "  ${GREEN}start${NC}   - Stops existing, then starts all services in background"
  echo -e "  ${GREEN}build${NC}   - Stops existing, then compiles and packages all services"
  echo -e "  ${GREEN}clean${NC}   - Stops existing, then removes target/ directories"
  echo -e "  ${GREEN}stop${NC}    - Stops all running microservices"
  echo -e "  ${GREEN}help${NC}    - Show this help menu\n"
}

case "$1" in
  all)   run_all;;
  clean) clean;;
  build) build;;
  start) start;;
  stop)  stop;;
  *)     help;;
esac

exit 0
