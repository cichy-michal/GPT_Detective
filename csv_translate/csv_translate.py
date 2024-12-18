import csv
import time
from googletrans import Translator, LANGUAGES
from requests.exceptions import RequestException

def translate_text(text, row_number, src='en', dest='pl', retries=1):
    translator = Translator()
    attempt = 0
    while attempt < retries:
        try:
            translated = translator.translate(text, src=src, dest=dest)
            return translated.text
        except (RequestException, TypeError) as e:
            print(f"Error translating text in row {row_number} (attempt {attempt + 1}): {e}")
            attempt += 1
            time.sleep(3)
    return None

def translate_csv(input_file, output_file, src='en', dest='pl'):
    with open(input_file, mode='r', encoding='utf-8') as infile, \
         open(output_file, mode='w', encoding='utf-8', newline='') as outfile:
        
        reader = csv.reader(infile, delimiter=';')
        writer = csv.writer(outfile, delimiter=';')

        headers = next(reader)
        writer.writerow(headers)

        for i, row in enumerate(reader, start=2):
            if len(row) > 2:
                original_text = row[2]
                translated_text = translate_text(original_text, i, src, dest)
                if translated_text is not None:
                    row[2] = translated_text
            writer.writerow(row)

if __name__ == '__main__':
    input_csv = 'ai_dataset_12.csv'
    output_csv = 'llm_dataset.csv'
    translate_csv(input_csv, output_csv)
