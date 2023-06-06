import json

words = []
with open("words.txt", "r", encoding="utf8") as file:
  for word in file:
    words.append(word[:-1])

words = filter(lambda word : len(word) > 2, words)
words = filter(lambda word : word.isalpha(), words)
words = list(words)

words_dict = {
  "words": words
}

words_json = json.dumps(words_dict)

print(words_json)