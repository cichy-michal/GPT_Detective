import tensorflow as tf
import json
import tensorflow_datasets as tfds
import sys
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

model = tf.keras.models.load_model('model.keras')

with open("vocabulary.json", "r") as vocab_file:
    vocabulary = json.load(vocab_file)

tokenizer = tfds.deprecated.text.Tokenizer()
encoder = tfds.deprecated.text.TokenTextEncoder(
    vocabulary, oov_token="<UNK>", lowercase=True, tokenizer=tokenizer
)

def replace_polish_characters(text):
    replacements = {
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
        'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
    }
    for polish_char, replacement in replacements.items():
        text = tf.strings.regex_replace(text, polish_char, replacement)
    return text

def clean_text(text):
    text = replace_polish_characters(text)
    text = tf.strings.regex_replace(text, r'[^a-zA-Z0-9\s]', '')
    return text

def predict_article(article_text):
    # Tokenizacja i czyszczenie tekstu
    clean_article_text = clean_text(tf.constant(article_text)).numpy().decode('utf-8')
    tokenized_text = "sostoken " + clean_article_text.lower() + " eostoken"
    encoded_text = encoder.encode(tokenized_text)

    # Predykcja
    prediction = model.predict(tf.expand_dims(encoded_text, 0), verbose=0)
    probability = prediction[0][0]

    # Klasyfikacja
    if probability > 0.5:
        return "AI"
    else:
        return "Human"

# Pobranie tekstu artykułu jako parametr z linii poleceń
article_text = sys.argv[1]

# Klasyfikacja artykułu
category = predict_article(article_text)

# Zapis artykułu do pliku
with open("demofile2.txt", "a") as f:
    f.write(article_text + "\n")

print(category)
