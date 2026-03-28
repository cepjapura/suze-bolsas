import sys
from PIL import Image, ImageEnhance

def process_image(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGB")
    except Exception as e:
        print(f"Error opening {input_path}: {e}")
        return

    # Enhance brightness and color slightly for standard e-commerce look
    img = ImageEnhance.Brightness(img).enhance(1.03)
    img = ImageEnhance.Color(img).enhance(1.05)
    
    target_ratio = 4.0 / 5.0
    original_width, original_height = img.size
    
    # We want to PAD the image to 4:5, so the entire image is visible without cropping sides
    if original_width / original_height > target_ratio:
        # Wider than 4:5 -> Pad height
        new_width = original_width
        new_height = int(original_width / target_ratio)
    else:
        # Taller than 4:5 -> Pad width
        new_height = original_height
        new_width = int(original_height * target_ratio)
        
    # Pick a gentle warm off-white color that matches the user's bed background
    padded_img = Image.new("RGB", (new_width, new_height), (249, 248, 246)) 
    
    paste_x = (new_width - original_width) // 2
    paste_y = (new_height - original_height) // 2
    
    padded_img.paste(img, (paste_x, paste_y))
    
    # Resize to standard optimized size for the storefront (e.g. 800x1000)
    img_resized = padded_img.resize((800, 1000), Image.Resampling.LANCZOS)
    
    # Save with optimized compression
    img_resized.save(output_path, "JPEG", quality=90, optimize=True)
    print(f"Successfully padded to 4:5 and saved at {output_path}")

if __name__ == "__main__":
    if len(sys.argv) == 3:
        process_image(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python process_pad_4x5.py <input> <output>")
