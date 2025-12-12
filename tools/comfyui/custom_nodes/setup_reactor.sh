#!/bin/bash
#
# ReActor Custom Node Setup Script for ComfyUI
# Installs the ReActor face swap custom node and its dependencies
#
# Usage:
#   ./setup_reactor.sh              # Install ReActor
#   ./setup_reactor.sh --update     # Update existing installation
#   ./setup_reactor.sh --help       # Show help
#

set -e

# Configuration
COMFYUI_DIR="${COMFYUI_DIR:-$HOME/ComfyUI}"
CUSTOM_NODES_DIR="$COMFYUI_DIR/custom_nodes"
REACTOR_REPO="https://github.com/Gourieff/ComfyUI-ReActor.git"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_step() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

show_help() {
    echo "ReActor Custom Node Setup Script"
    echo ""
    echo "This script installs the ComfyUI-ReActor custom node for face swapping."
    echo ""
    echo "Usage:"
    echo "  ./setup_reactor.sh              # Install ReActor"
    echo "  ./setup_reactor.sh --update     # Update existing installation"
    echo "  ./setup_reactor.sh --help       # Show this help"
    echo ""
    echo "Environment Variables:"
    echo "  COMFYUI_DIR    Path to ComfyUI installation (default: \$HOME/ComfyUI)"
    echo ""
    echo "After installation, you need to download these models:"
    echo "  1. inswapper_128.onnx - Face swap model"
    echo "     Place in: \$COMFYUI_DIR/models/insightface/models/"
    echo ""
    echo "  2. buffalo_l - Face analysis model"
    echo "     Place in: \$COMFYUI_DIR/models/insightface/"
    echo ""
    echo "Download from: https://github.com/Gourieff/sd-webui-reactor/releases"
}

check_requirements() {
    print_header "Checking Requirements"
    
    if ! command -v git &> /dev/null; then
        print_error "git is required but not installed"
        exit 1
    fi
    print_step "git is installed"
    
    if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
        print_error "pip is required but not installed"
        exit 1
    fi
    print_step "pip is installed"
    
    if [ ! -d "$COMFYUI_DIR" ]; then
        print_error "ComfyUI directory not found: $COMFYUI_DIR"
        print_warning "Set COMFYUI_DIR environment variable to your ComfyUI path"
        exit 1
    fi
    print_step "ComfyUI found at: $COMFYUI_DIR"
}

install_reactor() {
    print_header "Installing ReActor Custom Node"
    
    cd "$CUSTOM_NODES_DIR" || exit 1
    
    if [ -d "ComfyUI-ReActor" ]; then
        print_warning "ReActor already installed. Use --update to update."
        return 0
    fi
    
    echo "Cloning ReActor repository..."
    git clone "$REACTOR_REPO"
    
    cd ComfyUI-ReActor
    
    echo "Installing Python dependencies..."
    pip install -r requirements.txt || pip3 install -r requirements.txt
    
    print_step "ReActor installed successfully"
}

update_reactor() {
    print_header "Updating ReActor Custom Node"
    
    if [ ! -d "$CUSTOM_NODES_DIR/ComfyUI-ReActor" ]; then
        print_error "ReActor not installed. Run without --update first."
        exit 1
    fi
    
    cd "$CUSTOM_NODES_DIR/ComfyUI-ReActor"
    
    echo "Pulling latest changes..."
    git pull
    
    echo "Updating dependencies..."
    pip install -r requirements.txt || pip3 install -r requirements.txt
    
    print_step "ReActor updated successfully"
}

setup_model_directories() {
    print_header "Setting Up Model Directories"
    
    INSIGHTFACE_DIR="$COMFYUI_DIR/models/insightface"
    mkdir -p "$INSIGHTFACE_DIR/models"
    
    print_step "Created: $INSIGHTFACE_DIR"
    print_step "Created: $INSIGHTFACE_DIR/models"
    
    echo ""
    echo "Model directories created. Now download these models:"
    echo ""
    echo "1. inswapper_128.onnx"
    echo "   Download: https://github.com/Gourieff/sd-webui-reactor/releases"
    echo "   Place in: $INSIGHTFACE_DIR/models/"
    echo ""
    echo "2. buffalo_l (face analysis)"
    echo "   Download: https://github.com/deepinsight/insightface/releases"
    echo "   Place in: $INSIGHTFACE_DIR/"
    echo ""
}

print_summary() {
    print_header "Setup Complete"
    
    echo "ReActor custom node has been installed."
    echo ""
    echo "Next steps:"
    echo "1. Download the InsightFace models (see above)"
    echo "2. Restart ComfyUI"
    echo "3. The ReActor nodes should now be available in ComfyUI"
    echo ""
    echo "Available nodes:"
    echo "  - ReActorFaceSwap"
    echo "  - ReActorBuildFaceModel"
    echo "  - ReActorLoadFaceModel"
    echo "  - ReActorFaceBoost"
    echo ""
    echo "For usage in WuXuxian TTRPG, see:"
    echo "  docs/COMFYUI_CHARACTER_GENERATION.md"
}

# Main function
main() {
    # Parse arguments
    for arg in "$@"; do
        case $arg in
            --help|-h)
                show_help
                exit 0
                ;;
            --update)
                check_requirements
                update_reactor
                print_summary
                exit 0
                ;;
        esac
    done
    
    check_requirements
    install_reactor
    setup_model_directories
    print_summary
}

main "$@"
