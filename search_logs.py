import sys, os

convo_dir = r"C:\Users\Claud\.gemini\antigravity\conversations"
for f in os.listdir(convo_dir):
    if f.endswith('.pb'):
        path = os.path.join(convo_dir, f)
        try:
            with open(path, 'rb') as file:
                data = file.read()
                # search for "generate_image" nearby "sarah" or "heitor"
                text = data.decode('utf-8', errors='ignore')
                if "sarah" in text.lower() or "heitor" in text.lower():
                    print(f"Match found in {f}")
                    # Let's extract portions around generate_image
                    idx = 0
                    while True:
                        idx = text.find('generate_image', idx)
                        if idx == -1: break
                        print("\n--- SNIPPET ---")
                        print(text[max(0, idx-500):min(len(text), idx+1500)])
                        idx += 1
        except Exception as e:
            pass
