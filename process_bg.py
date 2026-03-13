import sys
from rembg import remove
from PIL import Image

def process_image(input_path, bg_path, output_path):
    # Load original image
    original = Image.open(input_path)
    
    # Remove background
    product_rgba = remove(original)
    
    # Load background image
    bg = Image.open(bg_path).convert("RGBA")
    
    # Resize background to match product image size or vice versa
    # We'll calculate a bounding box of the product to make it look nice
    bbox = product_rgba.getbbox()
    if not bbox:
        print("Empty image after removing background.")
        return
        
    product_cropped = product_rgba.crop(bbox)
    
    # Resize product to fit nicely in the background (say 80% of width)
    target_width = int(bg.width * 0.8)
    aspect_ratio = product_cropped.height / product_cropped.width
    target_height = int(target_width * aspect_ratio)
    
    product_resized = product_cropped.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Paste product onto background at lower center
    paste_x = (bg.width - target_width) // 2
    paste_y = bg.height - target_height - int(bg.height * 0.05)
    
    # Create final composite
    final_img = Image.alpha_composite(bg, Image.new('RGBA', bg.size, (0,0,0,0)))
    final_img.paste(product_resized, (paste_x, paste_y), product_resized)
    
    # Save as JPG
    final_img.convert("RGB").save(output_path, "JPEG", quality=95)
    print(f"Successfully processed image to {output_path}")

if __name__ == "__main__":
    input_item = r"C:\Users\Claud\.gemini\antigravity\brain\bccf1496-b0d3-4ca3-942c-14339b1f0750\media__1772332010191.jpg"
    bg_item = r"C:\Users\Claud\.gemini\antigravity\brain\bccf1496-b0d3-4ca3-942c-14339b1f0750\maternity_bg_1772332586465.png"
    output_item1 = r"C:\Users\Claud\Desktop\TELA\SITE SUZE BOLSAS\images\kit_francisco_1.jpg"
    output_item2 = r"C:\Users\Claud\Desktop\TELA\SITE SUZE BOLSAS\images\kit_francisco_2.jpg"
    
    process_image(input_item, bg_item, output_item1)
    process_image(input_item, bg_item, output_item2)
