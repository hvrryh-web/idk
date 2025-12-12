#!/bin/bash
#
# ComfyUI Model Setup Script for WuXuxian TTRPG
# Downloads recommended models for anime/manhwa style character generation
#
# Usage:
#   ./setup_models.sh              # Auto-install all models
#   ./setup_models.sh --dry-run    # Show what would be downloaded
#   ./setup_models.sh --help       # Show this help
#

set -e

# Configuration
COMFYUI_DIR="${COMFYUI_DIR:-$HOME/ComfyUI}"
MODELS_DIR="$COMFYUI_DIR/models"
CHECKPOINTS_DIR="$MODELS_DIR/checkpoints"
VAE_DIR="$MODELS_DIR/vae"
LORA_DIR="$MODELS_DIR/loras"
CONTROLNET_DIR="$MODELS_DIR/controlnet"
INSIGHTFACE_DIR="$MODELS_DIR/insightface"
REACTOR_DIR="$COMFYUI_DIR/custom_nodes/reactor"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DRY_RUN=false

# Print functions
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

# Check for required tools
check_requirements() {
    print_header "Checking Requirements"
    
    if ! command -v wget &> /dev/null && ! command -v curl &> /dev/null; then
        print_error "wget or curl is required but not installed"
        exit 1
    fi
    
    if command -v wget &> /dev/null; then
        DOWNLOADER="wget"
        print_step "Using wget for downloads"
    else
        DOWNLOADER="curl"
        print_step "Using curl for downloads"
    fi
}

# Download function with fallback
download_file() {
    local url="$1"
    local output="$2"
    local name="$3"
    
    if [ -f "$output" ]; then
        print_step "$name already exists, skipping..."
        return 0
    fi
    
    if $DRY_RUN; then
        print_step "[DRY RUN] Would download: $name"
        echo "  URL: $url"
        echo "  Output: $output"
        return 0
    fi
    
    echo "Downloading $name..."
    mkdir -p "$(dirname "$output")"
    
    if [ "$DOWNLOADER" = "wget" ]; then
        wget --progress=bar:force:noscroll -O "$output" "$url" || {
            print_error "Failed to download $name"
            rm -f "$output"
            return 1
        }
    else
        curl -L --progress-bar -o "$output" "$url" || {
            print_error "Failed to download $name"
            rm -f "$output"
            return 1
        }
    fi
    
    print_step "Downloaded $name"
}

# Setup checkpoint models
setup_checkpoints() {
    print_header "Setting up Checkpoint Models"
    
    echo "Recommended anime/manhwa style checkpoints for wuxia/xianxia aesthetic:"
    echo ""
    echo "Option 1: AnythingV5 (Recommended for anime style)"
    echo "  URL: https://civitai.com/models/9409/anything-v5"
    echo ""
    echo "Option 2: Counterfeit V3 (High quality anime)"
    echo "  URL: https://civitai.com/models/4468/counterfeit-v30"
    echo ""
    echo "Option 3: MeinaMix (Great for character portraits)"
    echo "  URL: https://civitai.com/models/7240/meinamix"
    echo ""
    
    print_warning "Due to licensing, checkpoint models must be downloaded manually from Civitai or HuggingFace."
    print_warning "Place downloaded .safetensors files in: $CHECKPOINTS_DIR"
    
    mkdir -p "$CHECKPOINTS_DIR"
}

# Setup VAE models
setup_vae() {
    print_header "Setting up VAE Models"
    
    # kl-f8-anime2 VAE is commonly used with anime models
    echo "Recommended VAE for anime style:"
    echo "  - kl-f8-anime2.ckpt or vae-ft-mse-840000-ema-pruned.safetensors"
    echo ""
    
    print_warning "VAE models should match your checkpoint for best results."
    print_warning "Place VAE files in: $VAE_DIR"
    
    mkdir -p "$VAE_DIR"
}

# Setup LoRA models
setup_loras() {
    print_header "Setting up LoRA Models"
    
    echo "Recommended LoRAs for wuxia/xianxia aesthetic:"
    echo ""
    echo "1. Chinese Traditional Clothing LoRA"
    echo "   - Adds traditional hanfu, cultivation robes"
    echo ""
    echo "2. Martial Arts Action LoRA"
    echo "   - Dynamic combat poses, qi effects"
    echo ""
    echo "3. Ink Wash Painting Style LoRA"
    echo "   - Traditional Chinese art style enhancement"
    echo ""
    
    print_warning "LoRA models can be found on Civitai. Search for 'wuxia', 'xianxia', 'hanfu', 'cultivation'."
    print_warning "Place LoRA files in: $LORA_DIR"
    
    mkdir -p "$LORA_DIR"
}

# Setup ControlNet models
setup_controlnet() {
    print_header "Setting up ControlNet Models"
    
    echo "Required ControlNet models for pose/depth conditioning:"
    echo ""
    echo "1. control_v11p_sd15_lineart"
    echo "   - For line art extraction and conditioning"
    echo ""
    echo "2. control_v11p_sd15_openpose"
    echo "   - For pose control in character generation"
    echo ""
    echo "3. control_v11f1p_sd15_depth"
    echo "   - For depth-based conditioning"
    echo ""
    
    # These can be auto-downloaded from HuggingFace
    if ! $DRY_RUN; then
        mkdir -p "$CONTROLNET_DIR"
        
        echo "ControlNet models available from HuggingFace:"
        echo "  https://huggingface.co/lllyasviel/ControlNet-v1-1/tree/main"
        echo ""
    fi
    
    print_warning "Place ControlNet models in: $CONTROLNET_DIR"
    
    mkdir -p "$CONTROLNET_DIR"
}

# Setup ReActor/InsightFace for face swapping
setup_face_swap() {
    print_header "Setting up Face Swap Models (ReActor/InsightFace)"
    
    echo "Required models for face transposition:"
    echo ""
    echo "1. inswapper_128.onnx"
    echo "   - Main face swap model"
    echo "   - Place in: $INSIGHTFACE_DIR/models/"
    echo ""
    echo "2. buffalo_l (face analysis model)"
    echo "   - Face detection and embedding extraction"
    echo "   - Place in: $INSIGHTFACE_DIR/"
    echo ""
    
    mkdir -p "$INSIGHTFACE_DIR/models"
    
    print_warning "InsightFace models are required for ReActor face swapping."
    print_warning "Download from: https://github.com/Gourieff/sd-webui-reactor/releases"
    
    # Create setup script for ReActor custom node
    if ! $DRY_RUN; then
        mkdir -p "$(dirname "$0")/custom_nodes"
        cat > "$(dirname "$0")/custom_nodes/setup_reactor.sh" << 'REACTOR_SCRIPT'
#!/bin/bash
# ReActor Custom Node Setup Script

COMFYUI_DIR="${COMFYUI_DIR:-$HOME/ComfyUI}"
CUSTOM_NODES_DIR="$COMFYUI_DIR/custom_nodes"

echo "Installing ReActor custom node..."

cd "$CUSTOM_NODES_DIR" || exit 1

if [ -d "ComfyUI-ReActor" ]; then
    echo "ReActor already installed, updating..."
    cd ComfyUI-ReActor
    git pull
else
    echo "Cloning ReActor repository..."
    git clone https://github.com/Gourieff/ComfyUI-ReActor.git
    cd ComfyUI-ReActor
fi

echo "Installing dependencies..."
pip install -r requirements.txt

echo "ReActor installation complete!"
echo "Note: You still need to download the InsightFace models manually."
REACTOR_SCRIPT
        chmod +x "$(dirname "$0")/custom_nodes/setup_reactor.sh"
        print_step "Created custom_nodes/setup_reactor.sh"
    fi
}

# Create directory structure
create_directories() {
    print_header "Creating Directory Structure"
    
    if $DRY_RUN; then
        echo "[DRY RUN] Would create directories:"
        echo "  $CHECKPOINTS_DIR"
        echo "  $VAE_DIR"
        echo "  $LORA_DIR"
        echo "  $CONTROLNET_DIR"
        echo "  $INSIGHTFACE_DIR/models"
        return 0
    fi
    
    mkdir -p "$CHECKPOINTS_DIR"
    mkdir -p "$VAE_DIR"
    mkdir -p "$LORA_DIR"
    mkdir -p "$CONTROLNET_DIR"
    mkdir -p "$INSIGHTFACE_DIR/models"
    
    print_step "Created model directories"
}

# Print summary
print_summary() {
    print_header "Setup Summary"
    
    echo "Directory structure created at: $COMFYUI_DIR/models/"
    echo ""
    echo "Next steps:"
    echo "1. Download a checkpoint model (AnythingV5, CounterfeitV3, etc.) from Civitai"
    echo "2. Download matching VAE if needed"
    echo "3. Download LoRAs for wuxia/xianxia style (optional)"
    echo "4. Download ControlNet models for pose conditioning"
    echo "5. Install ReActor custom node: ./custom_nodes/setup_reactor.sh"
    echo "6. Download InsightFace models for face swapping"
    echo ""
    echo "Model placement:"
    echo "  Checkpoints: $CHECKPOINTS_DIR"
    echo "  VAE:         $VAE_DIR"
    echo "  LoRA:        $LORA_DIR"
    echo "  ControlNet:  $CONTROLNET_DIR"
    echo "  InsightFace: $INSIGHTFACE_DIR"
    echo ""
    
    if [ -f "$CHECKPOINTS_DIR"/*.safetensors ] 2>/dev/null; then
        print_step "Found checkpoint models"
    else
        print_warning "No checkpoint models found. Download one to get started."
    fi
}

# Show help
show_help() {
    echo "ComfyUI Model Setup Script for WuXuxian TTRPG"
    echo ""
    echo "Usage:"
    echo "  ./setup_models.sh              # Setup directories and show instructions"
    echo "  ./setup_models.sh --dry-run    # Show what would be done"
    echo "  ./setup_models.sh --help       # Show this help"
    echo ""
    echo "Environment Variables:"
    echo "  COMFYUI_DIR    Path to ComfyUI installation (default: \$HOME/ComfyUI)"
    echo ""
    echo "This script:"
    echo "  - Creates necessary directory structure for ComfyUI models"
    echo "  - Provides download instructions for recommended models"
    echo "  - Sets up ReActor custom node installation script"
    echo ""
    echo "Note: Due to licensing restrictions, most models must be downloaded"
    echo "manually from Civitai or HuggingFace."
}

# Main function
main() {
    # Parse arguments
    for arg in "$@"; do
        case $arg in
            --dry-run)
                DRY_RUN=true
                print_warning "Running in dry-run mode"
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
        esac
    done
    
    check_requirements
    create_directories
    setup_checkpoints
    setup_vae
    setup_loras
    setup_controlnet
    setup_face_swap
    print_summary
    
    print_step "Setup complete!"
}

main "$@"
