from PIL import Image

def remove_bg(img_path):
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Check if the pixel is near-white / beige
        # R > 230, G > 220, B > 210
        if item[0] > 230 and item[1] > 220 and item[2] > 210:
            new_data.append((255, 255, 255, 0)) # Fully transparent
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Also crop the transparent whitespace
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(img_path, "PNG")

remove_bg("logo.png")
