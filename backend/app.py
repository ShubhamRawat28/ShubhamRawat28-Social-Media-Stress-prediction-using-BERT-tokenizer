from flask import Flask, render_template, request, jsonify
import pickle
import traceback
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the pre-trained model and vectorizer
try:
    with open('E:\\stress_predict\\backend\\vectorizer.pkl', 'rb') as vectorizer_file:
        vect = pickle.load(vectorizer_file)
    with open('E:\\stress_predict\\backend\\mnb.pkl', 'rb') as model_file:
        model = pickle.load(model_file)
except Exception as e:
    traceback.print_exc()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # 1. preprocess
        text = request.json['text']
        print(text)
        # 2. vectorize
        p = vect.transform([text]).toarray()
        # 3. predict
        result = model.predict(p)[0]
        print(result)
        if result == 'Stressed':
            return jsonify(result='Stress')
        else:
            return jsonify(result='Not-stress')
        
    except Exception as e:
        print(f"An error occurred during prediction: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Error during prediction.'})

if __name__ == '__main__':
    app.run(debug=True)