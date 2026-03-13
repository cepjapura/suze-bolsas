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
    bg = Image.open(bg_path).convert("RGBA")
    
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
    input_item = r"C:\Users\Claud\.gemini\antigravity\brain\bccf1496-b0d3-4ca3-942c-14339b1f0750\media__1772332010191.jpg"
    bg_item = r"C:\Users\Claud\.gemini\antigravity\brain\bccf1496-b0d3-4ca3-942c-14339b1f0750\maternity_bg_2_1772333005915.png"
    output_item1 = r"C:\Users\Claud\Desktop\TELA\SITE SUZE BOLSAS\images\kit_francisco_1.jpg"
    output_item2 = r"C:\Users\Claud\Desktop\TELA\SITE SUZE BOLSAS\images\kit_francisco_2.jpg"
    
    process_image(input_item, bg_item, output_item1)
    process_image(input_item, bg_item, output_item2)
