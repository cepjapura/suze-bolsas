import sys
from rembg import remove
from PIL import Image, ImageFilter, ImageEnhance

def process_image(input_path, bg_path, output_path):
    print("Processing", input_path)
    # Load original image
    original = Image.open(input_path)
    
    # Remove background
    product_rgba = remove(original)
    
    # Crop to bounding box
    bbox = product_rgba.getbbox()
    if not bbox:
        print("Empty bounding box")
        return
    product_cropped = product_rgba.crop(bbox)
    # Load background
    if bg_path.startswith("#"):
        bg = Image.new('RGBA', (800, 1000), bg_path)
    else:
        bg = Image.open(bg_path).convert("RGBA")
        
    if bg.size != (800, 1000):
        bg_ratio = bg.width / bg.height
        target_ratio = 800 / 1000
        if bg_ratio > target_ratio:
            new_w = int(bg.height * target_ratio)
            left = (bg.width - new_w) // 2
            bg = bg.crop((left, 0, left + new_w, bg.height))
        else:
            new_h = int(bg.width / target_ratio)
            top = (bg.height - new_h) // 2
            bg = bg.crop((0, top, bg.width, top + new_h))
        bg = bg.resize((800, 1000), Image.Resampling.LANCZOS)
    
    # Resize product to 55% of the background width to make it look further back and more naturally scaled
    target_width = int(bg.width * 0.55)
    aspect_ratio = product_cropped.height / product_cropped.width
    target_height = int(target_width * aspect_ratio)
    
    product_resized = product_cropped.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Slight color correction: Brighten slightly and warm it up to match the BG
    enhancer_brightness = ImageEnhance.Brightness(product_resized)
    product_resized = enhancer_brightness.enhance(1.05)
    
    # Create soft shadow
    shadow_img = Image.new('RGBA', product_resized.size, (0, 0, 0, 0))
    alpha = product_resized.split()[3]
    shadow_img.paste((0, 0, 0, 150), (0, 0), mask=alpha)
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(18)) # heavy blur for soft shadow
    
    # Create composite canvas
    canvas = Image.new('RGBA', bg.size, (0,0,0,0))
    
    # Position (Center horizontally, place closer to bottom but with some padding)
    paste_x = (bg.width - target_width) // 2
    paste_y = bg.height - target_height - int(bg.height * 0.12)
    
    # Offset shadow slightly down and right
    shadow_x = paste_x + 10
    shadow_y = paste_y + 20
    
    # Paste shadow then product
    canvas.paste(shadow_img, (shadow_x, shadow_y), shadow_img)
    canvas.paste(product_resized, (paste_x, paste_y), product_resized)
    
    # Final compose
    final_img = Image.alpha_composite(bg, canvas)
    
    # Save
    final_img.convert("RGB").save(output_path, "JPEG", quality=95)
    print("Saved", output_path)

if __name__ == "__main__":
    if len(sys.argv) == 4:
        process_image(sys.argv[1], sys.argv[2], sys.argv[3])
    else:
        print("Usage: python process_bg_v2.py <input> <bg> <output>")
