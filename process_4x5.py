import sys
from PIL import Image, ImageEnhance

def process_image(input_path, output_path):
    # Load original image
    try:
        img = Image.open(input_path).convert("RGB")
    except Exception as e:
        print(f"Error opening {input_path}: {e}")
        return

    # Enhance brightness and color slightly for standard e-commerce look
    img = ImageEnhance.Brightness(img).enhance(1.05)
    img = ImageEnhance.Color(img).enhance(1.10)
    
    # Calculate crop for 4:5 aspect ratio
    target_ratio = 4.0 / 5.0
    original_width, original_height = img.size
    
    if original_width / original_height > target_ratio:
        # Image is wider than 4:5, crop width
        new_width = int(original_height * target_ratio)
        left = (original_width - new_width) // 2
        right = left + new_width
        top = 0
        bottom = original_height
    else:
        # Image is taller than 4:5, crop height
        new_height = int(original_width / target_ratio)
        top = (original_height - new_height) // 2
        bottom = top + new_height
        left = 0
        right = original_width
        
    img_cropped = img.crop((left, top, right, bottom))
    
    # Resize to standard optimized size for the storefront (e.g. 800x1000)
    img_resized = img_cropped.resize((800, 1000), Image.Resampling.LANCZOS)
    
    # Save with optimized compression
    img_resized.save(output_path, "JPEG", quality=85, optimize=True)
    print(f"Successfully processed to 4:5 and saved at {output_path}")

if __name__ == "__main__":
    # In earlier steps the user uploaded the Francisco kit photos to the AI memory
    input1 = r"C:\Users\Claud\.gemini\antigravity\brain\bccf1496-b0d3-4ca3-942c-14339b1f0750\media__1772332010191.jpg"
    input2 = r"C:\Users\Claud\.gemini\antigravity\brain\bccf1496-b0d3-4ca3-942c-14339b1f0750\media__1772332010191.jpg" # If there's a second distinct one we'd use it, otherwise reusing for demo
    
    # Actually the user uploaded a PNG and a JPG at 23:27! Let's use the second one:
    # media__1772332010191.jpg (front)
    # media__1772332036878.png (maybe the other view?)
    input2_alt = r"C:\Users\Claud\.gemini\antigravity\brain\bccf1496-b0d3-4ca3-942c-14339b1f0750\media__1772332036878.png"
    
    out1 = r"C:\Users\Claud\Desktop\TELA\SITE SUZE BOLSAS\images\kit_francisco_1.jpg"
    out2 = r"C:\Users\Claud\Desktop\TELA\SITE SUZE BOLSAS\images\kit_francisco_2.jpg"
    
    process_image(input1, out1)
    process_image(input2_alt, out2)
