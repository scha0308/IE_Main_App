from google.cloud import vision
import io
import os
from google.api_core.exceptions import GoogleAPIError
from PIL import Image, UnidentifiedImageError
import re
import requests


def check_api():
    if os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
        return
    raw = os.getenv("GCV_KEY_JSON")
    if raw:
        path = "/tmp/gcv_key.json"
        with open(path, "w") as f:
            f.write(raw)
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = path
            return
    candidate = os.path.join(os.path.dirname(__file__), "ecosnap-471012-60236e15d74a.json")
    if os.path.exists(candidate):
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = candidate
    # if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
    #     candidate = os.path.join(os.path.dirname(__file__), "ecosnap-471012-60236e15d74a.json")
    #     if os.path.exists(candidate):
    #         os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = candidate

barcode_RGX = re.compile(r"\b(\d{8}|\d{12,14})\b")

def get_barcode(text:str):
    if not text:
        return None
    candidate = barcode_RGX.findall(text.replace(" ", ""))
    if not candidate:
        return None
    return sorted(candidate, key=len, reverse=True)[0]

def grade_to_score(grade: str) ->int:
    if not grade:
        return 0
    grade = grade.lower().strip()
    grades = {'a':90, 'b':70, 'c':60,'d':40, 'e':20}
    return grades.get(grade,0)

def get_ecoscore(barcode: str):
    try:
        url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
        req = requests.get(url, timeout=6)
        data = req.json()
        if data.get('status') != 1:
            return (None, None)
        
        prod = data.get('product', {}) or {}
        name = (
            prod.get('product_name') or prod.get('generic_name')
            or prod.get('brands') or None
        )
        score = None
        if isinstance(prod.get('ecoscore_score'), (int,float)):
            score = int(prod['ecoscore_score'])
        else:
            eco_data = prod.get('ecoscore_data') or {}
            if isinstance(eco_data.get('score'), (int, float)):
                score = int(eco_data['score'])
            elif prod.get('ecoscore_grade'):
                score = grade_to_score(prod['ecoscore_grade'])

        if score is None:
            return (name, None)
        
        score = max(0, min(100, score))
        return (name, score)
    except Exception:
        return (None, None)
    
def heuristic_ecoscore(labels, text:str) -> int:
    score = 50
    txt = (text or '').lower()
    words = {i.description.lower() for i in (labels or [])}
    if {'fruit', 'vegetable'}.intersection(words):
        score+=40

    if "organic" in txt or "bio " in txt or "bio-" in txt or "eco " in txt:
        score +=30

    cert = 0
    cert_keys = ["fairtrade", "rainforest alliance", "fsc", "msc", "b corp"]
    for c in cert_keys:
        if c in txt:
            cert+=1
    score+= min(20,cert*10)

    bad_packaging = ['plastic','pet','pvc']
    good_packaging = ['paper', 'cardboard','glass','tin','aluminium', 'aluminum']
    if any(t in txt for t in bad_packaging):
        score-=15
    if any(t in txt for t in good_packaging):
        score+=10

    if 'imported' in txt:
        score -=10
    
    return max(0, min(100, score))


def identify_product(image_path):
    check_api()

    try:
        with Image.open(image_path) as img:
            img.verify()
    except UnidentifiedImageError:
        raise ValueError("Uploaded file is not a valid image")
    
    try:
        client = vision.ImageAnnotatorClient()

        with io.open(image_path, 'rb') as f:
            content = f.read()
    
        img = vision.Image(content = content)
        label_res = client.label_detection(image = img)
        txt_res = client.text_detection(image = img)

        if label_res.error.message:
            raise RuntimeError(f'Vision API error: {label_res.error.message}')
        if txt_res.error.message:
            full_txt =''
        else:
            full_txt = (txt_res.full_text_annotation.text if txt_res.full_text_annotation else '') or ''

        
        labels = label_res.label_annotations or []
        if not labels:
            return ('Unknown', 0)
        
        product_name = labels[0].description
        
        barcode = get_barcode(full_txt)
        if barcode:
            name, score = get_ecoscore(barcode)
            if score is not None:
                return(name or product_name, score)
            
        heuristic_score = heuristic_ecoscore(labels, full_txt)
        return (product_name, heuristic_score)

        
    except GoogleAPIError as e:
        raise RuntimeError(f'Vision Client error: {e}')