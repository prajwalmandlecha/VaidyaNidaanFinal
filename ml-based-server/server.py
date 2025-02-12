from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
import numpy as np
import os
import tensorflow as tf
import matplotlib.pyplot as plt
from tensorflow.keras.applications.vgg19 import VGG19, preprocess_input
import uuid
import base64
from openai import OpenAI
from dotenv import load_dotenv
import requests
from io import BytesIO
from langdetect import detect  # For language detection
import cloudinary
import cloudinary.uploader
import nibabel as nib
import cv2
import tempfile
import shutil


load_dotenv()

app = Flask(__name__)

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_CLOUD_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_CLOUD_API_SECRET")
)

# Initialize the OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Load the pre-trained models
mri_model = load_model("mri_classifier_mobilenetv2.h5")
alzheimer_model = load_model('alzheimer_model.h5')

# Image sizes expected by the models
mri_img_size = (224, 224)
alzheimer_img_size = (128, 128)

# Grad-CAM++ Functions
def grad_cam_plus_plus(model, img_array, layer_name="block5_conv3"):
    """
    Generate Grad-CAM++ heatmap for a given image and model.
    """
    grad_model = tf.keras.models.Model(
        inputs=model.input,
        outputs=[model.get_layer(layer_name).output, model.output],
    )

    with tf.GradientTape() as tape:
        conv_output, predictions = grad_model(img_array)
        class_index = tf.argmax(predictions[0])
        loss = predictions[:, class_index]

    grads = tape.gradient(loss, conv_output)
    first_derivative = grads
    second_derivative = grads * grads
    third_derivative = grads * grads * grads

    global_sum = tf.reduce_sum(conv_output, axis=(0, 1, 2))
    alpha_num = second_derivative
    alpha_denom = second_derivative * 2.0 + third_derivative * global_sum
    alpha_denom = tf.where(alpha_denom != 0.0, alpha_denom, tf.ones_like(alpha_denom))
    alphas = alpha_num / alpha_denom
    alphas_normalized = alphas / tf.reduce_sum(alphas, axis=(0, 1))

    weights = tf.reduce_sum(first_derivative * alphas_normalized, axis=(0, 1))
    heatmap = tf.reduce_sum(weights * conv_output[0], axis=-1)
    heatmap = tf.maximum(heatmap, 0)
    heatmap /= tf.reduce_max(heatmap) + 1e-10

    return heatmap.numpy()

def show_grad_cam_plus_plus(img_path, output_path, alpha=0.5):
    """
    Overlay Grad-CAM++ heatmap on the original image.
    """
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array_preprocessed = preprocess_input(np.expand_dims(img_array, axis=0))

    model = VGG19(weights="imagenet")

    heatmap = grad_cam_plus_plus(model, img_array_preprocessed)

    heatmap = tf.image.resize(heatmap[..., tf.newaxis], (224, 224)).numpy().squeeze()

    # Visualize
    plt.figure(figsize=(10, 5))
    plt.subplot(1, 1, 1)
    plt.imshow(img)
    plt.imshow(heatmap, cmap="jet", alpha=alpha)
    plt.axis("off")
    plt.savefig(output_path, bbox_inches="tight", pad_inches=0, dpi=300)

def predict_mri(img_path):
    """Predict whether the image is MRI or Non-MRI."""
    img = image.load_img(img_path, target_size=mri_img_size)
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = mri_model.predict(img_array)
    return "MRI" if prediction[0][0] < 0.5 else "Non-MRI"

def preprocess_image(image_path, target_size=alzheimer_img_size):
    """Preprocess the image for the Alzheimer's model."""
    image = Image.open(image_path).convert('RGB')
    image = image.resize(target_size)
    image = np.array(image) / 255.0  # Normalize to [0, 1]
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image

# Endpoint for a simple greeting
@app.route('/', methods=['GET'])
def say_hi():
    return jsonify({"message": "Hi there!"})

# Endpoint for Grad-CAM++
@app.route('/process', methods=['POST'])
def process_image():
    data = request.json
    image_url = data.get('imageUrl')

    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

    # Download the image
    img_path = os.path.join(os.getcwd(), f"temp_{uuid.uuid4()}.jpg")
    try:
        response = requests.get(image_url)
        if response.status_code != 200:
            return jsonify({"error": "Failed to download image"}), 400
        with open(img_path, 'wb') as f:
            f.write(response.content)
    except Exception as e:
        return jsonify({"error": f"Error downloading image: {str(e)}"}), 500

    # Generate the output path
    output_path = os.path.join(os.getcwd(), f"gradcam_output_{uuid.uuid4()}.png")

     # Process the image
    try:
        show_grad_cam_plus_plus(img_path, output_path, alpha=0.5)
        print("Heatmap saved at:", output_path)
    except Exception as e:
        return jsonify({"error": f"Error generating heatmap: {str(e)}"}), 500

    # Upload the heatmap to Cloudinary
    try:
        heatmap_upload_response = cloudinary.uploader.upload(output_path)
        heatmap_url = heatmap_upload_response["secure_url"]
    except Exception as e:
        return jsonify({"error": f"Error uploading heatmap to Cloudinary: {str(e)}"}), 500

    # Clean up temporary files
    try:
        os.remove(img_path)
        os.remove(output_path)
    except Exception as e:
        print(f"Error deleting temporary files: {str(e)}")

    # Return the public URL of the heatmap
    return jsonify({"heatmapUrl": heatmap_url})



@app.route('/analyze', methods=['POST'])
def analyze_image():
    # Get the text prompt and image URL from the request
    data = request.json
    if not data or 'prompt' not in data or 'image_url' not in data:
        return jsonify({"error": "Please provide both 'prompt' and 'image_url' in the JSON payload"}), 400

    user_prompt = data['prompt']
    image_url = data['image_url']

    # Detect the language of the user's prompt
    try:
        language_code = detect(user_prompt)
    except:
        language_code = 'en'  # Default to English if detection fails

    # Map language codes to language names, including Marathi and Hindi
    language_map = {
        'en': 'English',
        'hi': 'Hindi',
        'mr': 'Marathi',
        # Add more languages as needed
    }
    language = language_map.get(language_code, 'English')  # Default to English if language not found

    # Define the structured prompt
    structured_prompt = f"""
        "{user_prompt}"
        You are an AI assistant specialized in medical imaging and neurological disorders. 
        A user has uploaded an MRI scan for Alzheimer's detection. 
        Please analyze the image carefully, looking for signs such as:
        - Brain atrophy (especially in the hippocampus and cortex).
        - Ventricular enlargement.
        - Abnormal white matter changes.

        Based on this, provide a detailed yet easy-to-understand medical analysis of the MRI scan.
        If Alzheimer's-related signs are detected, classify the severity (Mild, Moderate, Severe).
        Include an explanation for your findings in simple terms.
        PROVIDE YOUR RESPONSE IN THE SAME LANGUAGE AS user prompt
    """

    # Define the text prompt and include the image URL
    prompt = [
        {
            "type": "text",
            "text": user_prompt
        },
        {
            "type": "image_url",
            "image_url": {
                "url": image_url
            }
        }
    ]

    # Call OpenAI's GPT-4 Turbo with Vision model
    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": '''You are an AI assistant specialized in medical imaging and neurological disorders. 
        A user has uploaded an MRI scan for Alzheimer's detection. 
        Please analyze the image carefully, looking for signs such as:
        - Brain atrophy (especially in the hippocampus and cortex).
        - Ventricular enlargement.
        - Abnormal white matter changes.

        Based on this, provide a detailed yet easy-to-understand medical analysis of the MRI scan.
        If Alzheimer's-related signs are detected, classify the severity (Mild, Moderate, Severe).
        Include an explanation for your findings in simple terms.
        PROVIDE YOUR RESPONSE IN THE SAME LANGUAGE AS user prompt'''},
            {"role": "user", "content": prompt}
        ]
    )

    # Return the response
    return jsonify({"response": response.choices[0].message.content})

# Endpoint for MRI and Alzheimer's prediction
@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint to handle image URL and prediction."""
    data = request.json
    if not data or 'imageUrl' not in data:
        return jsonify({"error": "No image URL provided"}), 400

    image_url = data['imageUrl']

    try:
        # Download the image from the URL
        response = requests.get(image_url)
        if response.status_code != 200:
            return jsonify({"error": "Failed to download the image"}), 400

        # Load the image from the response content
        img = Image.open(BytesIO(response.content))

        # Convert the image to RGB if it is in RGBA mode
        if img.mode == 'RGBA':
            img = img.convert('RGB')

        # Save the image temporarily (optional, for debugging)
        temp_path = "temp_image.jpg"
        img.save(temp_path)

        # First, check if the image is an MRI
        mri_result = predict_mri(temp_path)
        if mri_result == "Non-MRI":
            return jsonify({"message": "The uploaded image is not an MRI."})

        # If it is an MRI, predict Alzheimer's
        img_array = preprocess_image(temp_path)
        prediction = alzheimer_model.predict(img_array)
        classification = np.argmax(prediction)
        if(classification == 1):
            category = "Demented"
        else:
            category = "Non Demented"
                    
        # probability = float(prediction[0][0]) * 100
        confidence = float(prediction[0][classification] * 100)
        
        return jsonify({
            "confidence": confidence,
            "prediction": "MRI",
            "category": category,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up: Delete the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.route('/fslanalyze', methods=['POST'])
def analyze_mri():
    print("Received /analyze request")
    if 'hdr_file' not in request.files or 'img_file' not in request.files:
        return jsonify({"error": "Both .hdr and .img files are required"}), 400

    hdr_file = request.files['hdr_file']
    img_file = request.files['img_file']

    if hdr_file.filename == '' or img_file.filename == '':
        return jsonify({"error": "No files selected"}), 400

    temp_dir = tempfile.mkdtemp()
    unique_id = uuid.uuid4().hex
    hdr_path = os.path.join(temp_dir, f"{unique_id}.hdr")
    img_path = os.path.join(temp_dir, f"{unique_id}.img")

    try:
        # Save uploaded files
        hdr_file.save(hdr_path)
        img_file.save(img_path)
        print(f"Saved HDR file to {hdr_path} and IMG file to {img_path}")

        # Generate medical report
        report = generate_medical_report(img_path)
        print(report);
        if 'error' in report:
            return jsonify(report), 500

        # Convert to JPEG and upload
        try:
            image_url = convert_to_jpg(unique_id, img_path, temp_dir)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

        return jsonify({
            "status": "success",
            "data": report,
            "image_url": image_url
        })

    except Exception as e:
        return jsonify({
            "error": f"Processing failed: {str(e)}",
            "status": "error"
        }), 500
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
        print(f"Cleaned up temporary directory {temp_dir}")
        
def generate_medical_report(mri_file):
    print(f"Generating medical report for {mri_file}")
    # Run basic statistics
    command = f"fslstats {mri_file} -R -M -V -P 50 -S"
    result = os.popen(command).read().strip().split()
    print(f"Basic statistics result: {result}")

    if len(result) < 6:
        return {"error": "Unable to extract basic statistics from the MRI scan"}

    # Parse numerical values
    try:
        stats = {
            "basic": {
                "min_intensity": float(result[0]),
                "max_intensity": float(result[1]),
                "mean_intensity": float(result[2]),
                "brain_volume_mm3": float(result[3]),
                "median_intensity": float(result[4]),
                "std_deviation": float(result[5])
            }
        }
    except ValueError:
        return {"error": "Numerical data parsing failed"}

    # Run FAST segmentation
    base = os.path.splitext(mri_file)[0]
    fast_prefix = base + "_fast"
    os.system(f"fast -t 1 -o {fast_prefix} {mri_file}")
    print(f"FAST segmentation output prefix: {fast_prefix}")

    seg_file = fast_prefix + "_seg.nii.gz"
    if not os.path.exists(seg_file):
        return {"error": "FAST segmentation failed"}

    # Get tissue volumes
    def get_tissue_volume(lower, upper):
        output = os.popen(f"fslstats {seg_file} -l {lower} -u {upper} -V").read().strip().split()
        print(f"Tissue volume for range {lower}-{upper}: {output}")
        return float(output[1]) if len(output) >= 2 else 0.0

    try:
        stats["tissue_volumes"] = {
            "csf_mm3": get_tissue_volume(0.5, 1.5),
            "gm_mm3": get_tissue_volume(1.5, 2.5),
            "wm_mm3": get_tissue_volume(2.5, 3.5)
        }
    except Exception as e:
        return {"error": f"Tissue volume calculation failed: {str(e)}"}

    return stats

def convert_to_jpg(unique_id, img_path, temp_dir):
    print(f"Converting {img_path} to JPEG with unique ID {unique_id}")
    try:
        # Load MRI image
        mri_img = nib.load(img_path)
        mri_data = mri_img.get_fdata()
        print(f"Loaded MRI data with shape {mri_data.shape}")

        # Extract middle slice and process
        slice_index = mri_data.shape[2] // 2  
        slice_2d = normalize_image(mri_data[:, :, slice_index])
        slice_2d = cv2.rotate(slice_2d, cv2.ROTATE_90_COUNTERCLOCKWISE)
        
        # Save temporary JPEG
        output_path = os.path.join(temp_dir, f"{unique_id}.jpg")
        cv2.imwrite(output_path, slice_2d)
        print(f"Saved JPEG to {output_path}")

        # Upload to Cloudinary
        upload_res = cloudinary.uploader.upload(output_path)
        print(f"Uploaded to Cloudinary: {upload_res['secure_url']}")
        return upload_res["secure_url"]

    except Exception as e:
        raise Exception(f"Image processing failed: {str(e)}")
    finally:
        # Clean up temporary JPEG
        if os.path.exists(output_path):
            os.remove(output_path)
            print(f"Removed temporary JPEG {output_path}")

def normalize_image(image):
    image = (image - np.min(image)) / (np.max(image) - np.min(image)) * 255
    return image.astype(np.uint8)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)