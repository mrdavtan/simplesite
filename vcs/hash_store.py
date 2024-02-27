from vcs import hash_content, store_object

# Assuming these functions take the file path as an argument
with open('file1.txt', 'rb') as f:
    content = f.read()
    hash_id = hash_content(content)
    store_object(content, hash_id)

with open('file2.txt', 'rb') as f:
    content = f.read()
    hash_id = hash_content(content)
    store_object(content, hash_id)

