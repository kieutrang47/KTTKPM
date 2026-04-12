#!/bin/bash

# Food Delivery SBA - Deployment Script
# Author: Auto-generated
# Date: 2026-04-12

set -e

echo "🚀 Food Delivery SBA Deployment Script"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker chưa được cài đặt!"
        exit 1
    fi
    print_success "Docker đã cài đặt: $(docker --version)"
}

# Check Docker Compose
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose chưa được cài đặt!"
        exit 1
    fi
    print_success "Docker Compose đã cài đặt: $(docker-compose --version)"
}

# Build and Start
deploy_local() {
    print_info "Đang build và start tất cả services..."
    docker-compose up --build -d
    print_success "Đã start tất cả services!"
    
    echo ""
    print_info "Đang chờ services khởi động (30 giây)..."
    sleep 30
    
    echo ""
    print_info "Trạng thái services:"
    docker-compose ps
    
    echo ""
    print_success "Deploy thành công!"
    echo ""
    echo "📱 Truy cập ứng dụng:"
    echo "   Frontend:        http://localhost:3000"
    echo "   User Service:    http://localhost:8081"
    echo "   Catalog Service: http://localhost:8082"
    echo "   Order Service:   http://localhost:8083"
    echo "   Payment Service: http://localhost:8084"
    echo ""
    echo "📊 Xem logs: docker-compose logs -f"
    echo "🛑 Dừng hệ thống: docker-compose down"
}

# Stop services
stop_services() {
    print_info "Đang dừng tất cả services..."
    docker-compose down
    print_success "Đã dừng tất cả services!"
}

# Clean up
cleanup() {
    print_info "Đang dọn dẹp containers, networks, và volumes..."
    docker-compose down -v
    docker system prune -f
    print_success "Đã dọn dẹp xong!"
}

# Show logs
show_logs() {
    if [ -z "$1" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$1"
    fi
}

# Restart service
restart_service() {
    if [ -z "$1" ]; then
        print_error "Vui lòng chỉ định service cần restart!"
        echo "VD: ./deploy.sh restart order-service"
        exit 1
    fi
    print_info "Đang restart $1..."
    docker-compose restart "$1"
    print_success "Đã restart $1!"
}

# Main menu
show_menu() {
    echo ""
    echo "Chọn hành động:"
    echo "1) Deploy Local (1 máy)"
    echo "2) Stop Services"
    echo "3) Xem Logs"
    echo "4) Restart Service"
    echo "5) Clean Up (Xóa tất cả)"
    echo "6) Thoát"
    echo ""
    read -p "Nhập lựa chọn [1-6]: " choice
    
    case $choice in
        1)
            check_docker
            check_docker_compose
            deploy_local
            ;;
        2)
            stop_services
            ;;
        3)
            read -p "Nhập tên service (để trống = tất cả): " service
            show_logs "$service"
            ;;
        4)
            read -p "Nhập tên service: " service
            restart_service "$service"
            ;;
        5)
            read -p "Bạn có chắc muốn xóa tất cả? (y/n): " confirm
            if [ "$confirm" = "y" ]; then
                cleanup
            fi
            ;;
        6)
            print_info "Tạm biệt!"
            exit 0
            ;;
        *)
            print_error "Lựa chọn không hợp lệ!"
            show_menu
            ;;
    esac
}

# Parse command line arguments
if [ $# -eq 0 ]; then
    show_menu
else
    case $1 in
        start|deploy)
            check_docker
            check_docker_compose
            deploy_local
            ;;
        stop)
            stop_services
            ;;
        logs)
            show_logs "$2"
            ;;
        restart)
            restart_service "$2"
            ;;
        clean|cleanup)
            cleanup
            ;;
        *)
            echo "Usage: $0 {start|stop|logs|restart|clean}"
            echo ""
            echo "Commands:"
            echo "  start    - Build và start tất cả services"
            echo "  stop     - Dừng tất cả services"
            echo "  logs     - Xem logs (thêm tên service để xem logs cụ thể)"
            echo "  restart  - Restart 1 service"
            echo "  clean    - Xóa tất cả containers, networks, volumes"
            exit 1
            ;;
    esac
fi
